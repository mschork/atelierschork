import {defineField, defineType} from 'sanity'
import {BsGeoAlt} from 'react-icons/bs'

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: BsGeoAlt,
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
    },
    {
      name: 'address',
      title: 'Address & Location',
    },
    {
      name: 'details',
      title: 'Additional Details',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'locationType',
      title: 'Location Type',
      type: 'reference',
      to: [{type: 'locationType'}],
      group: 'basic',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'basic',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'address',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'address',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'address',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      group: 'address',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'details',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      group: 'details',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'image',
    },
  },
}) 