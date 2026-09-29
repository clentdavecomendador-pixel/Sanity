import { defineField, defineType } from "sanity";

export const city = defineType({
    name: "city",
    title: "City",
    type: "document",

    fields: [
        defineField({
            name: "Image_Of_The_City",
            type: "image"
        }),

        defineField({
            name: "Name",
            type: "string"
        }),

        defineField({
            name: "Slug",
            type: "slug"
        }),

        defineField({
            name: "Description",
            type: "text"
        }),

        defineField({
            name: "Country",
            type: "reference",
            to: [{ type: "country"}]
        })
    ]
})