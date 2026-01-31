import {defineField, defineType} from 'sanity'
import {BsPalette} from 'react-icons/bs'

export default defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  icon: BsPalette,
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
    },
    {
      name: 'details',
      title: 'Artwork Details',
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'exhibition',
      title: 'Exhibition History',
    },
    {
      name: 'location',
      title: 'Location',
    },
    {
      name: 'publication',
      title: 'Publication',
    },
    {
      name: 'taxonomy',
      title: 'Taxonomy',
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
      name: 'artists',
      title: 'Artist(s)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year of creation',
      validation: (Rule) =>
        Rule.integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
      group: 'basic',
    }),

    // Artwork Details
    defineField({
      name: 'creationDate',
      title: 'Creation Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      description: 'Full creation date (year will be extracted)',
      group: 'details',
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'mediaType'}]}],
      description: 'Primary medium/media type (e.g., Photography, Film, Installation)',
      group: 'details',
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'string',
      description: 'Materials used (e.g., "Oil on canvas", "Bronze")',
      group: 'details',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        {
          name: 'width',
          title: 'Width',
          type: 'number',
        },
        {
          name: 'height',
          title: 'Height',
          type: 'number',
        },
        {
          name: 'depth',
          title: 'Depth',
          type: 'number',
        },
        {
          name: 'unit',
          title: 'Unit',
          type: 'string',
          options: {
            list: [
              {title: 'cm', value: 'cm'},
              {title: 'mm', value: 'mm'},
              {title: 'inches', value: 'in'},
              {title: 'meters', value: 'm'},
            ],
          },
          initialValue: 'cm',
        },
      ],
      group: 'details',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'object',
      description: 'For video/performance artworks',
      fields: [
        {
          name: 'minutes',
          title: 'Minutes',
          type: 'number',
          validation: (Rule) => Rule.integer().min(0),
        },
        {
          name: 'seconds',
          title: 'Seconds',
          type: 'number',
          validation: (Rule) => Rule.integer().min(0).max(59),
        },
      ],
      group: 'details',
    }),
    defineField({
      name: 'techniques',
      title: 'Techniques',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'technique'}]}],
      group: 'details',
    }),

    // Media
    defineField({
      name: 'media',
      title: 'Media',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'imageMedia',
          title: 'Image',
          fields: [
            {
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              initialValue: 'image',
              hidden: true,
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
            },
            {
              name: 'isPrimary',
              title: 'Primary Image',
              type: 'boolean',
              description: 'Use as main preview image',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
              isPrimary: 'isPrimary',
            },
            prepare({media, caption, isPrimary}) {
              return {
                title: caption || 'Image',
                subtitle: isPrimary ? '⭐ Primary' : 'Image',
                media,
              }
            },
          },
        },
        {
          type: 'object',
          name: 'videoMedia',
          title: 'Video File',
          fields: [
            {
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              initialValue: 'video',
              hidden: true,
            },
            {
              name: 'video',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/*',
              },
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
            },
          ],
          preview: {
            select: {
              caption: 'caption',
            },
            prepare({caption}) {
              return {
                title: caption || 'Video',
                subtitle: 'Video File',
              }
            },
          },
        },
        {
          type: 'object',
          name: 'vimeoMedia',
          title: 'Vimeo',
          fields: [
            {
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              initialValue: 'vimeo',
              hidden: true,
            },
            {
              name: 'url',
              title: 'Vimeo URL',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['https'],
                  allowRelative: false,
                }),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
          preview: {
            select: {
              caption: 'caption',
              url: 'url',
            },
            prepare({caption, url}) {
              return {
                title: caption || 'Vimeo',
                subtitle: url,
              }
            },
          },
        },
        {
          type: 'object',
          name: 'youtubeMedia',
          title: 'YouTube',
          fields: [
            {
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              initialValue: 'youtube',
              hidden: true,
            },
            {
              name: 'url',
              title: 'YouTube URL',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['https'],
                  allowRelative: false,
                }),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
          preview: {
            select: {
              caption: 'caption',
              url: 'url',
            },
            prepare({caption, url}) {
              return {
                title: caption || 'YouTube',
                subtitle: url,
              }
            },
          },
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Project this artwork belongs to',
      group: 'media',
    }),

    // Exhibition History
    defineField({
      name: 'exhibitions',
      title: 'Exhibitions',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'exhibition'}]}],
      description: 'Exhibitions where this artwork was shown',
      group: 'exhibition',
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'award'}]}],
      description: 'Awards received for this artwork',
      group: 'exhibition',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              description: 'e.g., Director, Cinematographer, Sound Design',
            },
            {
              name: 'person',
              title: 'Person',
              type: 'string',
            },
          ],
          preview: {
            select: {
              role: 'role',
              person: 'person',
            },
            prepare({role, person}) {
              return {
                title: person,
                subtitle: role,
              }
            },
          },
        },
      ],
      description: 'For film/performance credits',
      group: 'exhibition',
    }),

    // Location
    defineField({
      name: 'currentLocation',
      title: 'Current Location',
      type: 'object',
      fields: [
        {
          name: 'locationType',
          title: 'Location Type',
          type: 'string',
          options: {
            list: [
              {title: 'Institution', value: 'institution'},
              {title: 'Private Collection', value: 'privateCollection'},
              {title: 'Artist Collection', value: 'artistCollection'},
            ],
          },
        },
        {
          name: 'location',
          title: 'Location',
          type: 'reference',
          to: [{type: 'location'}],
          hidden: ({parent}) =>
            parent?.locationType === 'privateCollection' ||
            parent?.locationType === 'artistCollection',
        },
      ],
      group: 'location',
    }),

    // Publication
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      description: 'Is this artwork publicly visible?',
      initialValue: true,
      group: 'publication',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Feature on homepage/gallery highlights',
      initialValue: false,
      group: 'publication',
    }),
    defineField({
      name: 'orderRank',
      title: 'Display Order',
      type: 'number',
      description: 'Custom sort order (lower numbers appear first)',
      group: 'publication',
    }),
    defineField({
      name: 'purchaseInquiry',
      title: 'Enable Purchase Inquiries',
      type: 'boolean',
      description: 'Allow visitors to inquire about purchasing',
      initialValue: false,
      group: 'publication',
    }),

    // Taxonomy
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      group: 'taxonomy',
    }),
    defineField({
      name: 'relatedArtworks',
      title: 'Related Artworks',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artwork'}]}],
      group: 'taxonomy',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      artist0: 'artists.0.firstName',
      artistLast0: 'artists.0.lastName',
      media0: 'media.0.image',
      year: 'year',
    },
    prepare(selection) {
      const {title, artist0, artistLast0, media0, year} = selection
      const artistName =
        artist0 && artistLast0
          ? `${artist0} ${artistLast0}`
          : artist0 || artistLast0 || ''
      const subtitle = [artistName ? `by ${artistName}` : null, year]
        .filter(Boolean)
        .join(' • ')

      return {
        title,
        subtitle,
        media: media0,
      }
    },
  },
}) 