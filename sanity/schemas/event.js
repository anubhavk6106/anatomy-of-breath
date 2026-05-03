// event.js — Workshop / Event schema for Experiences section
// Multilingual fields use an object with one key per locale.
// The frontend reads: item.title?.[lang] ?? item.title?.en ?? ''

const LOCALES = ['en', 'es', 'hi', 'fr', 'pt']

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
  }
}

function localisedText(name, title, description, rows = 4) {
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
  name: 'event',
  title: 'Event / Workshop',
  type: 'document',

  preview: {
    select: {
      titleObj: 'title',
      date:     'date',
      isOnline: 'isOnline',
      location: 'location',
      media:    'coverImage',
    },
    prepare({ titleObj, date, isOnline, location, media }) {
      const title   = titleObj?.en || titleObj?.es || 'Untitled Event'
      const dateStr = date
        ? new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'No date set'
      const place = isOnline ? '🌐 Online' : (location ? `📍 ${location}` : 'No location')
      return { title, subtitle: `${dateStr} — ${place}`, media }
    },
  },

  fields: [
    // ── Required ──────────────────────────────────────────────
    localisedString(
      'title',
      'Event Title',
      'The name of the workshop, ceremony, or gathering. Fill EN first.',
      true,
    ),
    {
      name:        'slug',
      type:        'slug',
      title:       'URL Slug',
      description: 'Auto-generated from the English title. Used in the URL: /pillars/experiences/[slug]',
      options:     { source: doc => doc.title?.en || '', maxLength: 96 },
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
      name:         'isOnline',
      type:         'boolean',
      title:        'Online Event?',
      description:  'Toggle ON if this event takes place online (Zoom, etc.).',
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
    localisedText(
      'description',
      'Description',
      'Full description of the event. Fill EN first — other languages are optional.',
      6,
    ),

    // ── Booking ────────────────────────────────────────────────
    {
      name:        'bookingUrl',
      type:        'url',
      title:       'Booking / Registration URL',
      description: 'Link to the booking page (Eventbrite, Calendly, etc.).',
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
