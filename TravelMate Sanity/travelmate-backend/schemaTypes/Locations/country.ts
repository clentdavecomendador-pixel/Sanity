import { defineField, defineType } from "sanity";

export const country = defineType({
    name: "country",
    title: "Country",
    type: "document",

    fields: [
        defineField({
            name: "Flag",
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
            name: "Code",
            type: "string"
        }),

        defineField({
            name: "Description",
            type: "text"
        })
    ]
})