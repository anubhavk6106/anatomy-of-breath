// somaFeature.js — Dynamic featured content block for the Soma page
// Multilingual fields use an object with one key per locale.

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
  name: 'somaFeature',
  title: 'Soma Featured Block',
  type: 'document',

  preview: {
    select: { titleObj: 'title', isActive: 'isActive' },
    prepare({ titleObj, isActive }) {
      const title = titleObj?.en || titleObj?.es || 'Untitled Feature'
      return {
        title,
        subtitle: isActive ? '✅ Currently Active' : '⏸ Inactive',
      }
    },
  },

  fields: [
    localisedString(
      'title',
      'Feature Title',
      'Headline shown in the featured block on the Soma page. Fill EN first.',
      true,
    ),
    localisedText(
      'description',
      'Description',
      'Supporting text shown below the title. Fill EN first.',
      4,
    ),
    {
      name:         'isActive',
      type:         'boolean',
      title:        'Show on Soma Page?',
      description:  'Only ONE feature should be active at a time.',
      initialValue: false,
    },
  ],
}
