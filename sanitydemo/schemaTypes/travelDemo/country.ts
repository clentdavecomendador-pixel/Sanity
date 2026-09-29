import { defineField, defineType } from "sanity";

export const country = defineType({
    name: "country",
    title: "Country",
    type: "document",

    fields: [
        defineField({
            name: "Image_Of_The_Country",
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
            name: "Country_Code",
            type: "string"
        }),

        defineField({
            name: "Description",
            type: "text"
        })
    ]
})