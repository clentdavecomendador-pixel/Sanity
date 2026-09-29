import { defineField, defineType } from "sanity";

export const user = defineType({
    name: "user",
    title: "User",
    type: "document",

    fields: [
        defineField({
            name: "Profil_Picture",
            type: "image"
        }),

        defineField({
            name: "Name",
            type: "string"
        }),

        defineField({
            name: "Email",
            type: "email"
        }),

        defineField({
            name: "Bio",
            type: "text"
        })

    ]
})