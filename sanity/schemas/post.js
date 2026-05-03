// post.js — Blog post schema for Medicina de la Voz
// Multilingual fields use an object with one key per locale.
// The frontend reads: item.title?.[lang] ?? item.title?.en ?? ''

const LOCALES = ['en', 'es', 'hi', 'fr', 'pt']

// Helper: build a localised string field group
function localisedString(name, title, description, required = false) {
  return {
    name,
    title,
    type: 'object',
    description,
    fields: LOCALES.map(lang => ({
      name: lang,
      title: lang.toUpperCase(),
      type: 'string',
      validation: required && lang === 'en'
        ? Rule => Rule.required().error(`${title} (EN) is required`)
        : undefined,
    })),
    // Preview shows the EN value in Studio
    preview: {
      select: { title: 'en' },
      prepare: ({ title }) => ({ title: title || '—' }),
    },
  }
}

// Helper: build a localised text (multiline) field group
function localisedText(name, title, description, rows = 3) {
  return {
    name,
    title,
    type: 'object',
    description,
    fields: LOCALES.map(lang => ({
      name: lang,
      title: lang.toUpperCase(),
      type: 'text',
      rows,
    })),
  }
}

export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',

  preview: {
    select: { titleObj: 'title', subtitle: 'category', media: 'coverImage' },
    prepare({ titleObj, subtitle, media }) {
      const title = titleObj?.en || titleObj?.es || 'Untitled Post'
      return {
        title,
        subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
        media,
      }
    },
  },

  fields: [
    // ── Required ──────────────────────────────────────────────
    localisedString(
      'title',
      'Title',
      'The main title of the blog post. Fill EN first — other languages are optional.',
      true,
    ),
    {
      name:        'slug',
      type:        'slug',
      title:       'URL Slug',
      description: 'Auto-generated from the English title. Used in the URL: /pillars/medicina-de-la-voz/[slug]',
      options:     { source: doc => doc.title?.en || '', maxLength: 96 },
      validation:  Rule => Rule.required().error('Slug is required — click "Generate"'),
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
          { title: 'Fundamentos',   value: 'Fundamentos' },
          { title: 'Práctica',      value: 'Práctica' },
          { title: 'Terapia',       value: 'Terapia' },
          { title: 'Investigación', value: 'Investigación' },
          { title: 'Entrevistas',   value: 'Entrevistas' },
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
    localisedText(
      'excerpt',
      'Excerpt / Summary',
      'Short summary shown on the blog card (max ~200 chars per language).',
      3,
    ),

    // ── Body ───────────────────────────────────────────────────
    {
      name:  'body',
      type:  'array',
      title: 'Body Content (EN)',
      description: 'Full content of the blog post in English. Add translated body fields below if needed.',
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
  ],
}
