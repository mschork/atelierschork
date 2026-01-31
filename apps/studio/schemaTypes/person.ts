import {defineField, defineType} from 'sanity'
import {BsPerson} from 'react-icons/bs'

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: BsPerson,
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
    },
    {
      name: 'bio',
      title: 'Biography',
    },
    {
      name: 'professional',
      title: 'Professional',
    },
    {
      name: 'contact',
      title: 'Contact Information',
    },
  ],
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        list: [
          {title: 'Mr.', value: 'Mr.'},
          {title: 'Mrs.', value: 'Mrs.'},
          {title: 'Ms.', value: 'Ms.'},
          {title: 'Dr.', value: 'Dr.'},
          {title: 'Prof.', value: 'Prof.'},
          {title: 'Mx.', value: 'Mx.'},
        ],
      },
      group: 'basic',
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'middleName',
      title: 'Middle Name',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => {
          const firstName = doc.firstName || ''
          const lastName = doc.lastName || ''
          return `${firstName} ${lastName}`.trim()
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'roles',
      title: 'Roles',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'role'}]}],
      group: 'basic',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'basic',
    }),
    defineField({
      name: 'isCoreArtist',
      type: 'boolean',
      description: 'Is this a core member of Atelier Schork? (Francisco & Markus)',
      initialValue: false,
      group: 'basic',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Is this artist currently active/collaborating?',
      initialValue: true,
      group: 'basic',
    }),

    // Biography
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'array',
      of: [{type: 'block'}],
      group: 'bio',
    }),
    defineField({
      name: 'statement',
      title: 'Artist Statement',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Personal artist statement',
      group: 'bio',
    }),
    defineField({
      name: 'birthYear',
      title: 'Birth Year',
      type: 'number',
      validation: (Rule) =>
        Rule.min(1900).max(new Date().getFullYear()).integer(),
      group: 'bio',
    }),
    defineField({
      name: 'birthPlace',
      title: 'Birth Place',
      type: 'string',
      group: 'bio',
    }),
    defineField({
      name: 'currentLocation',
      title: 'Current Location',
      type: 'string',
      description: 'Where the artist currently lives/works',
      group: 'bio',
    }),
    defineField({
      name: 'interests',
      title: 'Interests',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Artist interests and themes',
      group: 'bio',
    }),

    // Professional
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'degree',
              title: 'Degree',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'institution',
              title: 'Institution',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'year',
              title: 'Year',
              type: 'number',
              validation: (Rule) => Rule.integer(),
            },
          ],
          preview: {
            select: {
              degree: 'degree',
              institution: 'institution',
              year: 'year',
            },
            prepare({degree, institution, year}) {
              return {
                title: degree,
                subtitle: `${institution}${year ? `, ${year}` : ''}`,
              }
            },
          },
        },
      ],
      group: 'professional',
    }),
    defineField({
      name: 'cv',
      title: 'CV / Resume',
      type: 'file',
      description: 'Upload CV as PDF',
      options: {
        accept: '.pdf',
      },
      group: 'professional',
    }),
    defineField({
      name: 'personalProjects',
      title: 'Personal Projects',
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
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'year',
              title: 'Year',
              type: 'number',
              validation: (Rule) => Rule.integer(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
          preview: {
            select: {
              title: 'title',
              year: 'year',
            },
            prepare({title, year}) {
              return {
                title,
                subtitle: year ? `${year}` : '',
              }
            },
          },
        },
      ],
      group: 'professional',
    }),

    // Contact Information
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
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
  ],
  preview: {
    select: {
      honorific: 'title',
      firstName: 'firstName',
      middleName: 'middleName',
      lastName: 'lastName',
      role0: 'roles.0.title',
      media: 'portrait',
      isCoreArtist: 'isCoreArtist',
    },
    prepare(selection) {
      const {honorific, firstName, middleName, lastName, role0, media, isCoreArtist} = selection

      // Format name as: Dr. First M. Last
      let formattedName = ''

      // Add honorific (Dr., Prof., etc.) if available
      if (honorific) {
        formattedName = honorific + ' '
      }

      formattedName += firstName || ''

      // Add middle initial with period if available
      if (middleName && middleName.length > 0) {
        formattedName += ` ${middleName.charAt(0)}.`
      }

      // Add last name
      if (lastName) {
        formattedName += ` ${lastName}`
      }

      // Build subtitle with role and core artist indicator
      const subtitle = [role0, isCoreArtist ? '⭐ Core Artist' : null]
        .filter(Boolean)
        .join(' • ')

      return {
        title: formattedName.trim(),
        subtitle,
        media,
      }
    },
  },
})
