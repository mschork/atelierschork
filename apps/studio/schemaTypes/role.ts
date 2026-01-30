import {defineField, defineType} from 'sanity'
import {BsPersonBadge} from 'react-icons/bs'

export default defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  icon: BsPersonBadge,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}) 