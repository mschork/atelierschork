import {defineField, defineType} from 'sanity'

/**
 * @deprecated This schema is deprecated and will be removed in a future version.
 * Use 'mediaType' instead for art media classification.
 *
 * This schema is kept for backwards compatibility with existing data.
 * Once all data has been migrated to 'mediaType', this file can be deleted.
 *
 * Migration steps:
 * 1. Run migration to copy medium documents to mediaType
 * 2. Update all artwork references from medium to mediaType
 * 3. Verify no references to medium exist
 * 4. Remove this file and its import from index.ts
 */
export default defineType({
  name: 'medium',
  title: 'Medium (Deprecated)',
  type: 'document',
  deprecated: {
    reason: 'Use mediaType instead. This schema will be removed in a future version.',
  },
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
}) 