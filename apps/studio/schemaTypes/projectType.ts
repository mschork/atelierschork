import {defineField, defineType} from 'sanity'
import {BsGrid} from 'react-icons/bs'

export default defineType({
  name: 'projectType',
  title: 'Project Type',
  type: 'document',
  icon: BsGrid,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or icon identifier',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
      description: 'description',
    },
    prepare({title, icon, description}) {
      return {
        title: `${icon || '📁'} ${title}`,
        subtitle: description,
      }
    },
  },
})
