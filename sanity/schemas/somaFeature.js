// somaFeature.js — Dynamic featured content block for the Soma page
// Only one feature can be active at a time (controlled by the isActive toggle).

export default {
  name: 'somaFeature',
  title: 'Soma Featured Block',
  type: 'document',

  preview: {
    select: {
      title:    'title',
      isActive: 'isActive',
    },
    prepare({ title, isActive }) {
      return {
        title:    title || 'Untitled Feature',
        subtitle: isActive ? '✅ Currently Active' : '⏸ Inactive',
      }
    },
  },

  fields: [
    {
      name:        'title',
      type:        'string',
      title:       'Feature Title',
      description: 'Headline shown in the featured block on the Soma page.',
      validation:  Rule => Rule.required().error('Title is required'),
    },
    {
      name:        'description',
      type:        'text',
      title:       'Description',
      description: 'Supporting text shown below the title.',
      rows:        4,
    },
    {
      name:        'isActive',
      type:        'boolean',
      title:       'Show on Soma Page?',
      description: 'Only ONE feature should be active at a time. Toggle this ON to display it on the website.',
      initialValue: false,
    },
  ],
}
