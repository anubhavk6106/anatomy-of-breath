// post.js — Blog post schema for Medicina de la Voz
// Client can add/edit blog posts from Sanity Studio without touching code.

export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',

  // Preview in Studio list view
  preview: {
    select: {
      title:    'title',
      subtitle: 'category',
      media:    'coverImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title:    title || 'Untitled Post',
        subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
        media,
      }
    },
  },

  fields: [
    // ── Required ──────────────────────────────────────────────
    {
      name:       'title',
      type:       'string',
      title:      'Title',
      description: 'The main title of the blog post. Keep it clear and engaging.',
      validation:  Rule => Rule.required().min(5).max(120).error('Title is required (5–120 characters)'),
    },
    {
      name:        'slug',
      type:        'slug',
      title:       'URL Slug',
      description: 'Auto-generated from the title. Used in the page URL: /pillars/medicina-de-la-voz/[slug]',
      options:     { source: 'title', maxLength: 96 },
      validation:  Rule => Rule.required().error('Slug is required — click "Generate" to create it from the title'),
    },

    // ── Metadata ───────────────────────────────────────────────
    {
      name:        'publishedAt',
      type:        'datetime',
      title:       'Published Date',
      description: 'When this post was published. Used for sorting.',
      options:     { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' },
    },
    {
      name:        'category',
      type:        'string',
      title:       'Category',
      description: 'Used for filtering on the blog page.',
      options: {
        list: [
          { title: 'Fundamentos',  value: 'Fundamentos' },
          { title: 'Práctica',     value: 'Práctica' },
          { title: 'Terapia',      value: 'Terapia' },
          { title: 'Investigación', value: 'Investigación' },
          { title: 'Entrevistas',  value: 'Entrevistas' },
        ],
        layout: 'radio',
      },
    },

    // ── Cover Image ────────────────────────────────────────────
    {
      name:        'coverImage',
      type:        'image',
      title:       'Cover Image',
      description: 'Main image shown on the blog card and at the top of the post. Recommended: 1200×800px.',
      options:     { hotspot: true },
      fields: [
        {
          name:        'alt',
          type:        'string',
          title:       'Alt Text',
          description: 'Describe the image for accessibility and SEO.',
          validation:  Rule => Rule.required().warning('Alt text improves accessibility and SEO'),
        },
      ],
    },

    // ── Excerpt ────────────────────────────────────────────────
    {
      name:        'excerpt',
      type:        'text',
      title:       'Excerpt / Summary',
      description: 'Short summary shown on the blog card. Max 200 characters.',
      rows:        3,
      validation:  Rule => Rule.max(200).warning('Keep the excerpt under 200 characters'),
    },

    // ── Body ───────────────────────────────────────────────────
    {
      name:  'body',
      type:  'array',
      title: 'Body Content',
      description: 'The full content of the blog post. You can add text, headings, images, and more.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal',      value: 'normal' },
            { title: 'Heading 1',   value: 'h1' },
            { title: 'Heading 2',   value: 'h2' },
            { title: 'Heading 3',   value: 'h3' },
            { title: 'Quote',       value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name:   'link',
                type:   'object',
                title:  'Link',
                fields: [
                  { name: 'href',  type: 'url',     title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true },
                ],
              },
            ],
          },
        },
        {
          type:    'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt',     type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption (optional)' },
          ],
        },
      ],
    },
  ],

  orderings: [
    {
      title: 'Published Date (Newest First)',
      name:  'publishedAtDesc',
      by:    [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title A–Z',
      name:  'titleAsc',
      by:    [{ field: 'title', direction: 'asc' }],
    },
  ],
}
