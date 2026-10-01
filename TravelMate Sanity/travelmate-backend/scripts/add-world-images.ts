import { getCliClient } from 'sanity/cli'

type ImageField = 'Flag' | 'Image'

type ImageTask = {
  documentId: string
  field: ImageField
  title: string
  context: string
  fallbackSearch?: string
  code?: string
  isFlag: boolean
}

type ExistingDocument = {
  _id: string
  Name: string
  Code?: string
  countryName?: string
  cityName?: string
}

type CommonsMetadata = { value?: string }

type CommonsPage = {
  index?: number
  title: string
  imageinfo?: Array<{
    thumburl?: string
    descriptionurl?: string
    mime?: string
    extmetadata?: Record<string, CommonsMetadata>
  }>
}

type CommonsResponse = { query?: { pages?: Record<string, CommonsPage> } }

type ImageSource = {
  url: string
  filename: string
  contentType: string
  title: string
  description: string
  source: { id: string; name: string; url: string }
  creditLine?: string
}

const client = getCliClient({ apiVersion: '2025-02-19' })
const writeEnabled = process.argv.includes('--write')
const userAgent = 'TravelMate Sanity image importer/1.0'

async function fetchWithRetry(url: string, headers?: HeadersInit): Promise<Response> {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers })
      if (response.ok) return response
      if (attempt === 4 || ![429, 500, 502, 503, 504].includes(response.status)) {
        throw new Error(`HTTP ${response.status} for ${url}`)
      }
      const retryAfter = Number(response.headers.get('retry-after'))
      await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : attempt * 1000))
    } catch (error) {
      if (attempt === 4) throw error
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
    }
  }
  throw new Error(`Unable to fetch ${url}`)
}

function plainText(value: string | undefined): string {
  return (value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim()
}

async function findCommonsImage(
  title: string,
  context: string,
  fallbackSearch?: string,
): Promise<ImageSource | undefined> {
  const searches = [`${title} ${context}`, title, ...(fallbackSearch ? [fallbackSearch] : [])]

  for (const search of searches) {
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: search,
      gsrnamespace: '6',
      gsrlimit: '5',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata|mime',
      iiurlwidth: '1200',
      format: 'json',
    })
    const response = await fetchWithRetry(
      `https://commons.wikimedia.org/w/api.php?${params}`,
      { 'User-Agent': userAgent },
    )
    const data = (await response.json()) as CommonsResponse
    const pages = Object.values(data.query?.pages ?? {}).sort(
      (left, right) => (left.index ?? 0) - (right.index ?? 0),
    )

    for (const page of pages) {
      const image = page.imageinfo?.[0]
      if (!image?.thumburl || !image.mime?.startsWith('image/')) continue
      if (image.mime === 'image/svg+xml' || image.mime === 'image/gif') continue

      const metadata = image.extmetadata ?? {}
      const license = plainText(metadata.LicenseShortName?.value) || 'License listed on Wikimedia Commons'
      const artist = plainText(metadata.Artist?.value) || plainText(metadata.Credit?.value)
      const fileUrl = image.descriptionurl ?? image.thumburl

      return {
        url: image.thumburl,
        filename: `${page.title.replace(/^File:/, '').replace(/[^a-zA-Z0-9.-]+/g, '-')}`,
        contentType: image.mime,
        title: page.title.replace(/^File:/, ''),
        description: `Source: Wikimedia Commons. License: ${license}.`,
        source: { id: page.title, name: 'Wikimedia Commons', url: fileUrl },
        creditLine: [artist, license].filter(Boolean).join(' | '),
      }
    }
  }

  return undefined
}

async function findFlag(code: string, countryName: string): Promise<ImageSource | undefined> {
  const url = `https://flagcdn.com/w320/${code.toLowerCase()}.png`
  try {
    await fetchWithRetry(url, { 'User-Agent': userAgent })
    return {
      url,
      filename: `${code.toLowerCase()}-flag.png`,
      contentType: 'image/png',
      title: `${countryName} flag`,
      description: `Flag of ${countryName}.`,
      source: { id: code.toLowerCase(), name: 'FlagCDN', url },
      creditLine: 'Flag image from FlagCDN',
    }
  } catch {
    return findCommonsImage(`${countryName} flag`, 'flag')
  }
}

async function loadTasks(): Promise<ImageTask[]> {
  const [countries, cities, attractions] = await Promise.all([
    client.fetch<ExistingDocument[]>(
      '*[_type == "country" && !defined(Flag.asset)]{_id,Name,Code}',
    ),
    client.fetch<ExistingDocument[]>(
      '*[_type == "city" && !defined(Image.asset)]{_id,Name,"countryName":Country->Name}',
    ),
    client.fetch<ExistingDocument[]>(
      '*[_type == "attraction" && !defined(Image.asset)]{_id,Name,"cityName":City->Name,"countryName":City->Country->Name}',
    ),
  ])

  return [
    ...countries.map((country) => ({
      documentId: country._id,
      field: 'Flag' as const,
      title: country.Name,
      context: 'flag',
      code: country.Code,
      isFlag: true,
    })),
    ...cities.map((city) => ({
      documentId: city._id,
      field: 'Image' as const,
      title: city.Name,
      context: `${city.countryName ?? ''} city skyline`,
      isFlag: false,
    })),
    ...attractions.map((attraction) => ({
      documentId: attraction._id,
      field: 'Image' as const,
      title: attraction.Name,
      context: `${attraction.cityName ?? ''} ${attraction.countryName ?? ''}`,
      fallbackSearch: `${attraction.cityName ?? ''} architecture`,
      isFlag: false,
    })),
  ]
}

async function processTask(task: ImageTask): Promise<boolean> {
  const image = task.isFlag
    ? await findFlag(task.code ?? '', task.title)
    : await findCommonsImage(task.title, task.context, task.fallbackSearch)

  if (!image) throw new Error(`No image source found for ${task.title}`)
  if (!writeEnabled) return true

  const response = await fetchWithRetry(image.url, { 'User-Agent': userAgent })
  const contentType = response.headers.get('content-type')?.split(';')[0] ?? image.contentType
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), {
    filename: image.filename,
    contentType,
    title: image.title,
    description: image.description,
    source: image.source,
    ...(image.creditLine ? { creditLine: image.creditLine } : {}),
  })

  await client
    .patch(task.documentId)
    .setIfMissing({
      [task.field]: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
    .commit()

  return true
}

const tasks = await loadTasks()
console.log(`Missing image fields: ${tasks.length}`)
console.log(`Mode: ${writeEnabled ? 'upload and update' : 'dry run'}`)

let cursor = 0
let succeeded = 0
const failures: string[] = []

async function worker(): Promise<void> {
  while (cursor < tasks.length) {
    const task = tasks[cursor++]
    try {
      await processTask(task)
      succeeded += 1
    } catch (error) {
      failures.push(`${task.title}: ${error instanceof Error ? error.message : String(error)}`)
    }

    if (succeeded > 0 && succeeded % 25 === 0) {
      console.log(`Resolved ${succeeded}/${tasks.length} images`)
    }
  }
}

await Promise.all(Array.from({ length: 3 }, () => worker()))
console.log(`${writeEnabled ? 'Updated' : 'Available'} images: ${succeeded}/${tasks.length}`)

if (failures.length > 0) {
  console.error(`Failed images (${failures.length}):\n${failures.join('\n')}`)
  throw new Error('Some image fields could not be populated; rerun to retry the remaining documents.')
}

if (!writeEnabled) {
  console.log('Dry run only. Use --with-user-token and --write to upload the images.')
}