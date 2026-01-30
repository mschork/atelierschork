import {defineField, defineType} from 'sanity'
import {BsBuilding} from 'react-icons/bs'

export default defineType({
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  icon: BsBuilding,
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
    },
    {
      name: 'details',
      title: 'Exhibition Details',
    },
    {
      name: 'location',
      title: 'Dates & Location',
    },
    {
      name: 'content',
      title: 'Exhibition Content',
    },
    {
      name: 'resources',
      title: 'Resources',
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'press',
      title: 'Press & Reviews',
    },
    {
      name: 'meta',
      title: 'Meta',
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
      name: 'type',
      title: 'Exhibition Type',
      type: 'string',
      options: {
        list: [
          {title: 'Solo', value: 'solo'},
          {title: 'Group', value: 'group'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Current', value: 'current'},
          {title: 'Past', value: 'past'},
        ],
        layout: 'radio',
      },
      description: 'Can be auto-calculated based on dates',
      group: 'basic',
    }),

    // Exhibition Details
    defineField({
      name: 'curatedBy',
      title: 'Curated By',
      type: 'string',
      description: 'Curator name(s) as text',
      group: 'details',
    }),
    defineField({
      name: 'curators',
      title: 'Curator(s)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      description: 'Curators as person references (if in system)',
      group: 'details',
    }),
    defineField({
      name: 'participants',
      title: 'Participants',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      description: 'For group shows - all participating people',
      group: 'details',
    }),

    // Dates & Location
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule) => Rule.required(),
      group: 'location',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      group: 'location',
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      description: 'Venue name as plain text',
      group: 'location',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'location',
      title: 'Location (Structured)',
      type: 'reference',
      to: [{type: 'location'}],
      description: 'Rich venue data (optional - use venue/city/country for simple cases)',
      group: 'location',
    }),

    // Content
    defineField({
      name: 'artworks',
      title: 'Artworks',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artwork'}]}],
      description: 'Artworks featured in this exhibition',
      group: 'content',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      description: 'Legacy field - consider using Collections',
      group: 'content',
    }),

    // Resources
    defineField({
      name: 'catalogUrl',
      title: 'Catalog URL',
      type: 'url',
      description: 'Link to online catalog',
      group: 'resources',
    }),
    defineField({
      name: 'pressRelease',
      title: 'Press Release',
      type: 'file',
      description: 'Upload press release PDF',
      options: {
        accept: '.pdf',
      },
      group: 'resources',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Exhibition website',
      group: 'resources',
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
      name: 'press',
      title: 'Press/Reviews',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'publication',
              title: 'Publication',
              type: 'string',
            },
            {
              name: 'author',
              title: 'Author',
              type: 'string',
            },
            {
              name: 'date',
              title: 'Date',
              type: 'date',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
            {
              name: 'excerpt',
              title: 'Excerpt',
              type: 'text',
            },
            {
              name: 'file',
              title: 'File',
              type: 'file',
            },
          ],
        },
      ],
      group: 'press',
    }),
    // Meta
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'Feature this exhibition prominently',
      initialValue: false,
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      group: 'meta',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location.name',
      startDate: 'startDate',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, location, startDate, media} = selection
      const date = startDate ? new Date(startDate).getFullYear() : ''
      return {
        title,
        subtitle: location && date ? `${location}, ${date}` : location || date,
        media,
      }
    },
  },
}) 