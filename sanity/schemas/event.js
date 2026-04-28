// event.js — Workshop / Event schema for Experiences section
// Client can add/edit events from Sanity Studio without touching code.

export default {
  name: 'event',
  title: 'Event / Workshop',
  type: 'document',

  // Preview in Studio list view
  preview: {
    select: {
      title:    'title',
      date:     'date',
      isOnline: 'isOnline',
      location: 'location',
      media:    'coverImage',
    },
    prepare({ title, date, isOnline, location, media }) {
      const dateStr = date
        ? new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'No date set'
      const place = isOnline ? '🌐 Online' : (location ? `📍 ${location}` : 'No location')
      return {
        title:    title || 'Untitled Event',
        subtitle: `${dateStr} — ${place}`,
        media,
      }
    },
  },

  fields: [
    // ── Required ──────────────────────────────────────────────
    {
      name:        'title',
      type:        'string',
      title:       'Event Title',
      description: 'The name of the workshop, ceremony, or gathering.',
      validation:  Rule => Rule.required().min(5).max(120).error('Title is required'),
    },
    {
      name:        'slug',
      type:        'slug',
      title:       'URL Slug',
      description: 'Auto-generated from the title. Used in the URL: /pillars/experiences/[slug]',
      options:     { source: 'title', maxLength: 96 },
      validation:  Rule => Rule.required().error('Slug is required — click "Generate"'),
    },
    {
      name:        'date',
      type:        'datetime',
      title:       'Date & Time',
      description: 'When the event takes place. Past events will be shown with a "Past" label.',
      validation:  Rule => Rule.required().error('Date is required'),
      options:     { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' },
    },

    // ── Location ───────────────────────────────────────────────
    {
      name:        'isOnline',
      type:        'boolean',
      title:       'Online Event?',
      description: 'Toggle ON if this event takes place online (Zoom, etc.).',
      initialValue: false,
    },
    {
      name:        'location',
      type:        'string',
      title:       'Location',
      description: 'Physical location (city, venue). Leave blank for online events.',
      hidden:      ({ document }) => document?.isOnline === true,
    },

    // ── Cover Image ────────────────────────────────────────────
    {
      name:        'coverImage',
      type:        'image',
      title:       'Cover Image',
      description: 'Image shown on the event card. Recommended: 1200×800px.',
      options:     { hotspot: true },
      fields: [
        {
          name:        'alt',
          type:        'string',
          title:       'Alt Text',
          description: 'Describe the image for accessibility.',
          validation:  Rule => Rule.required().warning('Alt text is important for accessibility'),
        },
      ],
    },

    // ── Description ────────────────────────────────────────────
    {
      name:        'description',
      type:        'array',
      title:       'Description',
      description: 'Full description of the event. Shown on the event detail page.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal',    value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote',     value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
    },

    // ── Booking ────────────────────────────────────────────────
    {
      name:        'bookingUrl',
      type:        'url',
      title:       'Booking / Registration URL',
      description: 'Link to the booking page (Eventbrite, Calendly, etc.). Leave blank if not applicable.',
      validation:  Rule => Rule.uri({ scheme: ['http', 'https', 'mailto'] }).warning('Enter a valid URL'),
    },
  ],

  orderings: [
    {
      title: 'Date (Upcoming First)',
      name:  'dateAsc',
      by:    [{ field: 'date', direction: 'asc' }],
    },
    {
      title: 'Date (Most Recent First)',
      name:  'dateDesc',
      by:    [{ field: 'date', direction: 'desc' }],
    },
  ],
}
