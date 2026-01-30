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
      title: 'Project Details',
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
    {
      name: 'related',
      title: 'Related Content',
    },
  ],
  fields: [
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
      name: 'mainImage',
      title: 'Main Image',
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
      group: 'basic',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      group: 'details',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
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
    defineField({
      name: 'creators',
      title: 'Creators',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      validation: (Rule) => Rule.required(),
      group: 'people',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      group: 'people',
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
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
          ],
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'documents',
      title: 'Documents',
      type: 'array',
      of: [
        {
          type: 'file',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
          ],
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      group: 'classification',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      group: 'classification',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      group: 'related',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      creator0: 'creators.0.firstName',
      creatorLast0: 'creators.0.lastName',
      creatorRole0: 'creators.0.roles.0.title',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, creator0, creatorLast0, creatorRole0, media} = selection
      const creatorName = creator0 && creatorLast0 ? `${creator0} ${creatorLast0}` : creator0 || creatorLast0 || ''
      const subtitle = creatorName ? `by ${creatorName}${creatorRole0 ? ` (${creatorRole0})` : ''}` : ''
      
      return {
        title,
        subtitle,
        media,
      }
    },
  },
}) 