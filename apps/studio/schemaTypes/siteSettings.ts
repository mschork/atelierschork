import {defineField, defineType} from 'sanity'
import {BsGear} from 'react-icons/bs'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: BsGear,
  groups: [
    {
      name: 'siteInfo',
      title: 'Site Information',
    },
    {
      name: 'contact',
      title: 'Contact',
    },
    {
      name: 'content',
      title: 'Content',
    },
  ],
  fields: [
    // Site Information
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'siteInfo',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      description: 'Brief description for SEO and social sharing',
      rows: 3,
      group: 'siteInfo',
    }),
    defineField({
      name: 'metaImage',
      title: 'Default Meta Image',
      type: 'image',
      description: 'Default image for social sharing (OG image)',
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
      group: 'siteInfo',
    }),

    // Contact
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: 'email',
          invert: false,
        }),
      group: 'contact',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'vimeo',
          title: 'Vimeo',
          type: 'url',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        },
        {
          name: 'other',
          title: 'Other',
          type: 'url',
        },
      ],
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
        },
      ],
      group: 'contact',
    }),

    // Content
    defineField({
      name: 'aboutText',
      title: 'About Text',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Main about/intro text for the site',
      group: 'content',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global site configuration',
      }
    },
  },
})
