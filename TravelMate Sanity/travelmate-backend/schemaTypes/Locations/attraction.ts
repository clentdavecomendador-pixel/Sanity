import { defineField, defineType } from "sanity";

export const attraction = defineType({
    name: "attraction",
    title: "Attraction",
    type: "document",

    fields: [
        defineField({
            name: "Image",
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
            name: "City",
            type: "reference",
            to: [{ type: "city" }]
        })
    ]
})