import { defineType, defineField } from 'sanity'

/**
 * Post document. Maps to `Post` in `src/content/types.ts` via `sanity/adapter.ts`.
 * Categories are a fixed set defined in code (`src/content/categories.ts`), so
 * `category` is a string enum rather than a reference.
 */
export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['announcements', 'partner-stories', 'deep-dives'], layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'updatedAt', title: 'Updated at', type: 'datetime' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, validation: (r) => r.required().max(240) }),
    defineField({ name: 'cover', title: 'Cover image', type: 'image', options: { hotspot: true }, description: '16:9 announcement banner' }),
    defineField({
      name: 'coverFocus',
      title: 'Cover focal point',
      type: 'string',
      options: { list: ['center', 'left', 'right', 'top'], layout: 'radio' },
      initialValue: 'center',
      description: 'Which edge to keep when the banner is cropped (for edge-anchored headlines).',
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'title', type: 'string', title: 'Meta title' },
        { name: 'description', type: 'text', rows: 2, title: 'Meta description' },
        { name: 'ogImage', type: 'image', title: 'OG image' },
      ],
    }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent', validation: (r) => r.required() }),
  ],
  orderings: [{ title: 'Newest', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } },
})
