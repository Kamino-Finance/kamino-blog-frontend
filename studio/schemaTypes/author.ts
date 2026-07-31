import { defineType, defineField } from 'sanity'

/**
 * Author document. `avatar` (a photo) maps to `Author.avatarUrl` in the app; a
 * seeded monogram is shown when it's absent. Reference implementation for the
 * FE team's Sanity Studio — copy into your `schemaTypes`.
 */
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'role', title: 'Role', type: 'string', description: 'e.g. “Product”, “Protocol Engineering”' }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 3 }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'avatar' } },
})
