import {defineField, defineType} from 'sanity'
import {BsFileEarmarkText} from 'react-icons/bs'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: BsFileEarmarkText,
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
    },
    {
      name: 'details',
      title: 'Details',
    },
    {
      name: 'people',
      title: 'People',
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'classification',
      title: 'Classification',
    },
  ],
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
      group: 'basic',
    }),
    defineField({
      name: 'isOngoing',
      title: 'Ongoing',
      type: 'boolean',
      description: 'Is this project currently ongoing?',
      initialValue: false,
      group: 'basic',
    }),

    // Details
    defineField({
      name: 'startYear',
      title: 'Start Year',
      type: 'number',
      validation: (Rule) =>
        Rule.integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
      group: 'details',
    }),
    defineField({
      name: 'endYear',
      title: 'End Year',
      type: 'number',
      validation: (Rule) =>
        Rule.integer()
          .min(1900)
          .max(new Date().getFullYear() + 1)
          .custom((endYear, context) => {
            const startYear = (context.document as any)?.startYear
            const isOngoing = (context.document as any)?.isOngoing

            if (isOngoing) {
              return true // No validation needed if ongoing
            }

            if (endYear && startYear && endYear < startYear) {
              return 'End year must be equal to or after start year'
            }
            return true
          }),
      hidden: ({document}) => document?.isOngoing === true,
      group: 'details',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'In Progress', value: 'inProgress'},
          {title: 'Completed', value: 'completed'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      group: 'details',
    }),

    // People
    defineField({
      name: 'creators',
      title: 'Creators',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      group: 'people',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      group: 'people',
    }),

    // Media
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        },
      ],
      group: 'media',
    }),

    // Classification
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'reference',
      to: [{type: 'projectType'}],
      description: 'Type of project (Art, Logo Design, Website Design, etc.)',
      group: 'classification',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      group: 'classification',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      startYear: 'startYear',
      endYear: 'endYear',
      isOngoing: 'isOngoing',
      media: 'coverImage',
      creator0: 'creators.0.firstName',
      creatorLast0: 'creators.0.lastName',
    },
    prepare({title, startYear, endYear, isOngoing, media, creator0, creatorLast0}) {
      const yearRange = isOngoing
        ? `${startYear || '?'} - Ongoing`
        : startYear && endYear
        ? `${startYear} - ${endYear}`
        : startYear
        ? `${startYear}`
        : 'No dates'

      const creatorName = creator0 && creatorLast0 ? `${creator0} ${creatorLast0}` : creator0 || creatorLast0 || ''
      const subtitle = creatorName ? `${yearRange} • ${creatorName}` : yearRange

      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
