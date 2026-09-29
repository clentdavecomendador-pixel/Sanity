import { defineField, defineType } from "sanity";

export const article = defineType({
    name: "article",
    title: "Article",
    type: "document",

    fields: [
        defineField({
            name: "title",
            type: "string"
        }),

        defineField({
            name: "Image_source",
            type: "image"
        }),

        defineField({
            name: "slug",
            type: "slug"
        }),

        defineField({
            name: "description",
            type: "text"
        }),

        defineField({
            name: "Dato",
            type: "date"
        }),

        defineField({
            name: "Author",
            type: "string"
        })
    ]
})