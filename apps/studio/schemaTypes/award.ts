import {defineField, defineType} from 'sanity'
import {BsTrophy} from 'react-icons/bs'

export default defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  icon: BsTrophy,
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
    },
    {
      name: 'recipients',
      title: 'Recipients',
    },
    {
      name: 'details',
      title: 'Details',
    },
    {
      name: 'media',
      title: 'Media',
    },
  ],
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Award Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'organization',
      title: 'Awarding Organization',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
      group: 'basic',
    }),

    // Recipients
    defineField({
      name: 'recipients',
      title: 'Recipients',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      validation: (Rule) => Rule.required().min(1),
      group: 'recipients',
    }),
    defineField({
      name: 'artwork',
      title: 'Associated Artwork',
      type: 'reference',
      to: [{type: 'artwork'}],
      description: 'If award was given for a specific artwork',
      group: 'recipients',
    }),

    // Details
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
      group: 'details',
    }),
    defineField({
      name: 'category',
      title: 'Award Category',
      type: 'string',
      description: 'e.g., "Best Emerging Artist", "Grand Prize"',
      group: 'details',
    }),
    defineField({
      name: 'url',
      title: 'Award Website',
      type: 'url',
      description: 'Link to award information',
      group: 'details',
    }),

    // Media
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Award certificate, trophy photo, or related image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        },
      ],
      group: 'media',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      organization: 'organization',
      year: 'year',
      media: 'image',
    },
    prepare({title, organization, year, media}) {
      return {
        title,
        subtitle: `${organization}, ${year}`,
        media,
      }
    },
  },
})
