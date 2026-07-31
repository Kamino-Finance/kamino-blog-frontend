import { defineType, defineArrayMember, defineField } from 'sanity'

/**
 * Article body — a portable-text array plus the custom block objects the blog
 * renders. Each custom object maps 1:1 to a `Block` variant in
 * `src/content/types.ts`; see `sanity/adapter.ts` for the mapping.
 *
 * Standard portable-text `block`s carry headings (h2/h3), the lead style,
 * blockquotes, and inline marks (strong/em/code/link) — the adapter serialises
 * those to the restricted inline-markdown the renderer understands.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Lead', value: 'lead' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL' }],
          },
        ],
      },
    }),

    defineArrayMember({
      type: 'image',
      name: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
        defineField({
          name: 'width',
          type: 'string',
          title: 'Width',
          options: { list: ['inline', 'wide', 'full'], layout: 'radio' },
          initialValue: 'wide',
        }),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        defineField({ name: 'tone', type: 'string', options: { list: ['info', 'success', 'warning'] }, initialValue: 'info' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'text', type: 'text', rows: 3 }),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'code',
      title: 'Code',
      fields: [
        defineField({ name: 'language', type: 'string', options: { list: ['ts', 'tsx', 'bash', 'json', 'rust', 'text'] } }),
        defineField({ name: 'filename', type: 'string' }),
        defineField({ name: 'code', type: 'text', rows: 8 }),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'stat',
      title: 'Stat row',
      fields: [
        defineField({
          name: 'items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', type: 'string' },
                { name: 'label', type: 'string' },
              ],
            },
          ],
        }),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'gallery',
      title: 'Gallery',
      fields: [
        defineField({
          name: 'items',
          type: 'array',
          of: [{ type: 'image', fields: [{ name: 'alt', type: 'string' }, { name: 'caption', type: 'string' }] }],
        }),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'table',
      title: 'Table',
      fields: [
        defineField({ name: 'head', type: 'array', of: [{ type: 'string' }], title: 'Header cells' }),
        defineField({
          name: 'rows',
          type: 'array',
          title: 'Rows',
          of: [{ type: 'object', fields: [{ name: 'cells', type: 'array', of: [{ type: 'string' }] }] }],
        }),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'quote',
      title: 'Pull quote',
      fields: [
        defineField({ name: 'text', type: 'text', rows: 3 }),
        defineField({ name: 'attribution', type: 'string', title: 'Attributed to' }),
        defineField({ name: 'source', type: 'string', title: 'Role / company' }),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'embed',
      title: 'Embed',
      fields: [
        defineField({ name: 'kind', type: 'string', options: { list: ['video', 'tweet'] } }),
        defineField({ name: 'url', type: 'url' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'poster', type: 'image', title: 'Video poster' }),
      ],
    }),

    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Divider',
      fields: [defineField({ name: 'note', type: 'string', hidden: true })],
    }),
  ],
})
