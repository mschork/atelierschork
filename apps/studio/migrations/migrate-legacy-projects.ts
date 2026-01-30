import {defineMigration, at, set, setIfMissing, unset} from 'sanity/migrate'

// Migration: Update legacy project documents to match new Project schema
// Date: 2025-11-18
//
// Changes:
// 1. Add startYear/endYear (extracted from startDate/endDate)
// 2. Add isOngoing field (based on status)
// 3. Rename mainImage → coverImage
// 4. Keep existing fields: title, slug, description, creators, status, tags, gallery

export default defineMigration({
  title: 'Update legacy projects to new Project schema',
  documentTypes: ['project'],

  migrate: {
    document(doc) {
      const operations: any[] = []

      // Extract year from startDate if available
      if (doc.startDate && typeof doc.startDate === 'string') {
        const startYear = parseInt(doc.startDate.substring(0, 4))
        operations.push(at('startYear', setIfMissing(startYear)))
      }

      // Extract year from endDate if available
      if (doc.endDate && typeof doc.endDate === 'string') {
        const endYear = parseInt(doc.endDate.substring(0, 4))
        operations.push(at('endYear', setIfMissing(endYear)))
      }

      // Set isOngoing based on status (false for completed projects)
      const isOngoing = doc.status !== 'completed'
      operations.push(at('isOngoing', setIfMissing(isOngoing)))

      // Rename mainImage to coverImage if it exists
      if (doc.mainImage) {
        operations.push(at('coverImage', setIfMissing(doc.mainImage)))
        operations.push(at('mainImage', unset()))
      }

      // Clean up old fields that don't exist in new schema
      if (doc.startDate) {
        operations.push(at('startDate', unset()))
      }
      if (doc.endDate) {
        operations.push(at('endDate', unset()))
      }
      if (doc.videos) {
        operations.push(at('videos', unset()))
      }
      if (doc.documents) {
        operations.push(at('documents', unset()))
      }
      if (doc.categories) {
        operations.push(at('categories', unset()))
      }
      if (doc.relatedProjects) {
        operations.push(at('relatedProjects', unset()))
      }

      return operations
    },
  },
})
