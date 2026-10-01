import { getCliClient } from 'sanity/cli'

type LocationSeed = {
  code: string
  name: string
  capital: string
  attraction: string
}

type Reference = {
  _type: 'reference'
  _ref: string
}

type SeedDocument = {
  _id: string
  _type: 'country' | 'city' | 'attraction'
  Name: string
  Code?: string
  Slug: { _type: 'slug'; current: string }
  Description: string
  Country?: Reference
  City?: Reference
}

type ExistingDocument = {
  _id: string
  _type: 'country' | 'city' | 'attraction'
  Name?: string
  Code?: string
  Country?: { _ref?: string }
  City?: { _ref?: string }
}

type Mutation = { createIfNotExists: SeedDocument }

const writeEnabled = process.argv.includes('--write')
const client = getCliClient({ apiVersion: '2025-02-19' })

const entries: LocationSeed[] = `
AD|Andorra|Andorra la Vella|Casa de la Vall
AE|United Arab Emirates|Abu Dhabi|Sheikh Zayed Grand Mosque
AF|Afghanistan|Kabul|Bagh-e Babur
AG|Antigua and Barbuda|Saint John's|St John's Cathedral
AL|Albania|Tirana|Skanderbeg Square
AM|Armenia|Yerevan|Cascade Complex
AO|Angola|Luanda|Fortaleza de Sao Miguel
AR|Argentina|Buenos Aires|Casa Rosada
AT|Austria|Vienna|Schonbrunn Palace
AU|Australia|Canberra|Australian War Memorial
AZ|Azerbaijan|Baku|Maiden Tower
BA|Bosnia and Herzegovina|Sarajevo|Sebilj Fountain
BB|Barbados|Bridgetown|Garrison Savannah
BD|Bangladesh|Dhaka|Lalbagh Fort
BE|Belgium|Brussels|Grand Place
BF|Burkina Faso|Ouagadougou|National Museum of Burkina Faso
BG|Bulgaria|Sofia|Alexander Nevsky Cathedral
BH|Bahrain|Manama|Bahrain National Museum
BI|Burundi|Gitega|National Museum of Gitega
BJ|Benin|Porto-Novo|Honme Museum
BN|Brunei|Bandar Seri Begawan|Sultan Omar Ali Saifuddien Mosque
BO|Bolivia|La Paz|Plaza Murillo
BR|Brazil|Brasilia|Cathedral of Brasilia
BS|Bahamas|Nassau|Queen's Staircase
BT|Bhutan|Thimphu|Tashichho Dzong
BW|Botswana|Gaborone|Three Dikgosi Monument
BY|Belarus|Minsk|Island of Tears
BZ|Belize|Belmopan|Belize Museum
CA|Canada|Ottawa|Parliament Hill
CD|Democratic Republic of the Congo|Kinshasa|National Museum of the Democratic Republic of the Congo
CF|Central African Republic|Bangui|Boganda Museum
CG|Republic of the Congo|Brazzaville|Basilique Sainte-Anne
CH|Switzerland|Bern|Bern Old Town
CI|Cote d'Ivoire|Yamoussoukro|Basilica of Our Lady of Peace
CL|Chile|Santiago|La Moneda Palace
CM|Cameroon|Yaounde|Reunification Monument
CN|China|Beijing|Forbidden City
CO|Colombia|Bogota|Gold Museum
CR|Costa Rica|San Jose|National Theatre of Costa Rica
CU|Cuba|Havana|Old Havana
CV|Cabo Verde|Praia|Praia Cathedral
CY|Cyprus|Nicosia|Cyprus Museum
CZ|Czechia|Prague|Prague Castle
DE|Germany|Berlin|Brandenburg Gate
DJ|Djibouti|Djibouti|Hamoudi Mosque
DK|Denmark|Copenhagen|Nyhavn
DM|Dominica|Roseau|Dominica Museum
DO|Dominican Republic|Santo Domingo|Alcazar de Colon
DZ|Algeria|Algiers|Martyrs' Memorial
EC|Ecuador|Quito|Basilica of the National Vow
EE|Estonia|Tallinn|Tallinn Old Town
EG|Egypt|Cairo|Egyptian Museum
ER|Eritrea|Asmara|Fiat Tagliero
ES|Spain|Madrid|Royal Palace of Madrid
ET|Ethiopia|Addis Ababa|National Museum of Ethiopia
FI|Finland|Helsinki|Suomenlinna
FJ|Fiji|Suva|Fiji Museum
FM|Federated States of Micronesia|Palikir|Pohnpei Cultural Center
FR|France|Paris|Eiffel Tower
GA|Gabon|Libreville|St Michael's Church
GB|United Kingdom|London|Palace of Westminster
GD|Grenada|Saint George's|Fort George
GE|Georgia|Tbilisi|Narikala Fortress
GH|Ghana|Accra|Kwame Nkrumah Memorial Park
GM|Gambia|Banjul|Arch 22
GN|Guinea|Conakry|Conakry Grand Mosque
GQ|Equatorial Guinea|Malabo|Malabo Cathedral
GR|Greece|Athens|Acropolis of Athens
GT|Guatemala|Guatemala City|National Palace of Culture
GW|Guinea-Bissau|Bissau|Bissau Velho
GY|Guyana|Georgetown|Stabroek Market
HN|Honduras|Tegucigalpa|Basilica of Suyapa
HR|Croatia|Zagreb|Zagreb Cathedral
HT|Haiti|Port-au-Prince|National Pantheon Museum
HU|Hungary|Budapest|Hungarian Parliament Building
ID|Indonesia|Jakarta|National Monument
IE|Ireland|Dublin|Trinity College Dublin
IL|Israel|Jerusalem|Western Wall
IN|India|New Delhi|Red Fort
IQ|Iraq|Baghdad|Iraq National Museum
IR|Iran|Tehran|Azadi Tower
IS|Iceland|Reykjavik|Hallgrimskirkja
IT|Italy|Rome|Colosseum
JM|Jamaica|Kingston|Bob Marley Museum
JO|Jordan|Amman|Amman Citadel
JP|Japan|Tokyo|Tokyo Imperial Palace
KE|Kenya|Nairobi|Kenyatta International Convention Centre
KG|Kyrgyzstan|Bishkek|Ala-Too Square
KH|Cambodia|Phnom Penh|Royal Palace of Cambodia
KI|Kiribati|South Tarawa|Bairiki National Stadium
KM|Comoros|Moroni|Old Friday Mosque
KN|Saint Kitts and Nevis|Basseterre|Berkeley Memorial
KP|North Korea|Pyongyang|Juche Tower
KR|South Korea|Seoul|Gyeongbokgung Palace
KW|Kuwait|Kuwait City|Kuwait Towers
KZ|Kazakhstan|Astana|Baiterek Tower
LA|Laos|Vientiane|Pha That Luang
LB|Lebanon|Beirut|National Museum of Beirut
LC|Saint Lucia|Castries|Castries Market
LI|Liechtenstein|Vaduz|Vaduz Castle
LK|Sri Lanka|Sri Jayawardenepura Kotte|Diyatha Uyana
LR|Liberia|Monrovia|Centennial Pavilion
LS|Lesotho|Maseru|Thaba Bosiu
LT|Lithuania|Vilnius|Gediminas Tower
LU|Luxembourg|Luxembourg City|Grand Ducal Palace
LV|Latvia|Riga|House of the Blackheads
LY|Libya|Tripoli|Red Castle Museum
MA|Morocco|Rabat|Hassan Tower
MC|Monaco|Monaco|Prince's Palace of Monaco
MD|Moldova|Chisinau|Nativity Cathedral
ME|Montenegro|Podgorica|Millennium Bridge
MG|Madagascar|Antananarivo|Rova of Antananarivo
MH|Marshall Islands|Majuro|Alele Museum
MK|North Macedonia|Skopje|Stone Bridge
ML|Mali|Bamako|National Museum of Mali
MM|Myanmar|Naypyidaw|Uppatasanti Pagoda
MN|Mongolia|Ulaanbaatar|Gandan Monastery
MR|Mauritania|Nouakchott|Nouakchott Mosque
MT|Malta|Valletta|St John's Co-Cathedral
MU|Mauritius|Port Louis|Aapravasi Ghat
MV|Maldives|Male|Old Friday Mosque
MW|Malawi|Lilongwe|Lilongwe Wildlife Centre
MX|Mexico|Mexico City|Palace of Fine Arts
MY|Malaysia|Kuala Lumpur|Petronas Twin Towers
MZ|Mozambique|Maputo|Maputo Railway Station
NA|Namibia|Windhoek|Christ Church
NE|Niger|Niamey|Grand Mosque of Niamey
NG|Nigeria|Abuja|National Mosque
NI|Nicaragua|Managua|Old Cathedral of Managua
NL|Netherlands|Amsterdam|Rijksmuseum
NO|Norway|Oslo|Oslo Opera House
NP|Nepal|Kathmandu|Boudhanath Stupa
NR|Nauru|Yaren|Nauru Parliament House
NZ|New Zealand|Wellington|Museum of New Zealand Te Papa Tongarewa
OM|Oman|Muscat|Sultan Qaboos Grand Mosque
PA|Panama|Panama City|Panama Canal Miraflores Visitor Center
PE|Peru|Lima|Plaza Mayor of Lima
PG|Papua New Guinea|Port Moresby|National Parliament House
PH|Philippines|Manila|Intramuros
PK|Pakistan|Islamabad|Faisal Mosque
PL|Poland|Warsaw|Royal Castle in Warsaw
PS|Palestine|Ramallah|Yasser Arafat Museum
PT|Portugal|Lisbon|Belem Tower
PW|Palau|Ngerulmud|Capitol of Palau
PY|Paraguay|Asuncion|Palace of the Lopez
QA|Qatar|Doha|Museum of Islamic Art
RO|Romania|Bucharest|Palace of the Parliament
RS|Serbia|Belgrade|Belgrade Fortress
RU|Russia|Moscow|Red Square
RW|Rwanda|Kigali|Kigali Genocide Memorial
SA|Saudi Arabia|Riyadh|Masmak Fortress
SB|Solomon Islands|Honiara|National Museum of the Solomon Islands
SC|Seychelles|Victoria|Victoria Clocktower
SD|Sudan|Khartoum|National Museum of Sudan
SE|Sweden|Stockholm|Vasa Museum
SG|Singapore|Singapore|Gardens by the Bay
SI|Slovenia|Ljubljana|Ljubljana Castle
SK|Slovakia|Bratislava|Bratislava Castle
SL|Sierra Leone|Freetown|Cotton Tree
SM|San Marino|San Marino|Guaita Tower
SN|Senegal|Dakar|African Renaissance Monument
SO|Somalia|Mogadishu|Mogadishu Cathedral
SR|Suriname|Paramaribo|Presidential Palace of Suriname
SS|South Sudan|Juba|John Garang Mausoleum
ST|Sao Tome and Principe|Sao Tome|Sao Tome Cathedral
SV|El Salvador|San Salvador|National Palace of El Salvador
SY|Syria|Damascus|Umayyad Mosque
SZ|Eswatini|Mbabane|Mbabane Market
TD|Chad|N'Djamena|National Museum of Chad
TG|Togo|Lome|Independence Monument
TH|Thailand|Bangkok|Grand Palace
TJ|Tajikistan|Dushanbe|National Museum of Tajikistan
TL|Timor-Leste|Dili|Cristo Rei of Dili
TM|Turkmenistan|Ashgabat|Monument of Neutrality
TN|Tunisia|Tunis|Medina of Tunis
TO|Tonga|Nuku'alofa|Royal Palace of Tonga
TR|Turkey|Ankara|Anitkabir
TT|Trinidad and Tobago|Port of Spain|Magnificent Seven
TV|Tuvalu|Funafuti|Tuvalu Government Building
TZ|Tanzania|Dodoma|Gaddafi Mosque
UA|Ukraine|Kyiv|Saint Sophia Cathedral
UG|Uganda|Kampala|Uganda National Mosque
US|United States|Washington, D.C.|White House
UY|Uruguay|Montevideo|Solis Theatre
UZ|Uzbekistan|Tashkent|Amir Timur Museum
VA|Vatican City|Vatican City|St Peter's Basilica
VC|Saint Vincent and the Grenadines|Kingstown|Fort Charlotte
VE|Venezuela|Caracas|National Pantheon of Venezuela
VN|Vietnam|Hanoi|Ho Chi Minh Mausoleum
VU|Vanuatu|Port Vila|Vanuatu Cultural Centre
WS|Samoa|Apia|Immaculate Conception Cathedral
YE|Yemen|Sanaa|Old City of Sanaa
ZA|South Africa|Pretoria|Union Buildings
ZM|Zambia|Lusaka|Lusaka National Museum
ZW|Zimbabwe|Harare|National Heroes Acre
`.trim().split('\n').map((line) => {
  const [code, name, capital, attraction] = line.split('|')
  return { code, name, capital, attraction }
})

if (entries.length !== 195 || new Set(entries.map(({ code }) => code)).size !== entries.length) {
  throw new Error(`Expected 195 unique country entries, found ${entries.length}`)
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const query = '*[_type in ["country", "city", "attraction"]]{_id,_type,Name,Code,Country,City}'
const documents = await client.fetch<ExistingDocument[]>(query)
const countries = documents.filter((document) => document._type === 'country')
const cities = documents.filter((document) => document._type === 'city')
const attractions = documents.filter((document) => document._type === 'attraction')
const mutations: Mutation[] = []

for (const entry of entries) {
  const country = countries.find((document) => document.Code === entry.code)
  const countryId = country?._id ?? `country-${entry.code.toLowerCase()}`

  if (!country) {
    mutations.push({
      createIfNotExists: {
        _id: countryId,
        _type: 'country',
        Name: entry.name,
        Code: entry.code,
        Slug: { _type: 'slug', current: slugify(entry.name) },
        Description: `Discover the history, culture, and places to visit in ${entry.name}.`,
      },
    })
  }

  const city = cities.find(
    (document) =>
      document.Country?._ref === countryId &&
      document.Name?.toLowerCase() === entry.capital.toLowerCase(),
  )
  const cityId = city?._id ?? `city-${entry.code.toLowerCase()}-${slugify(entry.capital)}`

  if (!city) {
    mutations.push({
      createIfNotExists: {
        _id: cityId,
        _type: 'city',
        Name: entry.capital,
        Slug: { _type: 'slug', current: slugify(entry.capital) },
        Description: `${entry.capital} is the capital city of ${entry.name}.`,
        Country: { _type: 'reference', _ref: countryId },
      },
    })
  }

  const hasAttraction = attractions.some((document) => document.City?._ref === cityId)
  if (!hasAttraction) {
    mutations.push({
      createIfNotExists: {
        _id: `attraction-${entry.code.toLowerCase()}-${slugify(entry.attraction)}`,
        _type: 'attraction',
        Name: entry.attraction,
        Slug: { _type: 'slug', current: slugify(entry.attraction) },
        Description: `${entry.attraction} is a featured place to visit in ${entry.capital}, ${entry.name}.`,
        City: { _type: 'reference', _ref: cityId },
      },
    })
  }
}

console.log(`Countries in seed: ${entries.length}`)
console.log(`New documents planned: ${mutations.length}`)

if (!writeEnabled) {
  console.log('Dry run only. Use --with-user-token and --write to create the missing documents.')
} else {
  for (let index = 0; index < mutations.length; index += 50) {
    const transaction = client.transaction()
    for (const mutation of mutations.slice(index, index + 50)) {
      transaction.createIfNotExists(mutation.createIfNotExists)
    }
    await transaction.commit()
  }

  console.log(`Created or confirmed ${mutations.length} missing documents.`)
}
