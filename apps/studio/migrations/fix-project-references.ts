import {defineMigration, at, set} from 'sanity/migrate'

// Artist ID to Person ID mapping
const ARTIST_TO_PERSON_MAP: Record<string, string> = {
  // Markus Schork
  '3f151b53-676a-4dbb-a9c6-7a9fc5952634': 'd2ebbc9b-ae79-40c9-81f3-841b471a43e5',
  // Francisco Schork
  'd5ea0301-9ebe-49e5-aa98-3866934f9d88': 'c43bcb53-d258-482a-acf5-5d47f5dbe22e',
  // Émilie Queney
  '18eed5a6-d7fa-4925-b316-8c58240500e1': '42c64ebe-d55a-4586-943d-fd2b6f6d9874',
}

export default defineMigration({
  title: 'Fix project creator references after incorrect migration',
  documentTypes: ['project'],

  migrate: {
    document(doc) {
      if (doc._type === 'project' && doc.creators && Array.isArray(doc.creators)) {
        // Check if creators contains patch operations instead of references
        const hasIncorrectFormat = doc.creators.some((item: any) => item.op && item.path)

        if (hasIncorrectFormat) {
          // Extract the person IDs from the patch operations
          const fixedCreators = doc.creators
            .filter((item: any) => item.op && item.op.value)
            .map((item: any) => ({
              _type: 'reference',
              _ref: item.op.value,
              _key: item._key,
            }))

          return at('creators', set(fixedCreators))
        }
      }

      // Also fix collaborators if they exist
      if (doc._type === 'project' && doc.collaborators && Array.isArray(doc.collaborators)) {
        const hasIncorrectFormat = doc.collaborators.some((item: any) => item.op && item.path)

        if (hasIncorrectFormat) {
          const fixedCollaborators = doc.collaborators
            .filter((item: any) => item.op && item.op.value)
            .map((item: any) => ({
              _type: 'reference',
              _ref: item.op.value,
              _key: item._key,
            }))

          return at('collaborators', set(fixedCollaborators))
        }
      }

      return
    },
  },
})
