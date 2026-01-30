import {defineMigration, at, setIfMissing, unset} from 'sanity/migrate'

// Migration: Convert person documents to artist documents
// Date: 2025-11-17
//
// Changes:
// 1. Change _type from "person" to "artist"
// 2. Add isCoreArtist field (true for Francisco & Markus Schork)
// 3. Add isActive field (true for all)
// 4. Add empty socialMedia object structure
// 5. Add placeholder fields for new artist schema

const CORE_ARTIST_IDS = [
  '13384ffd-86fa-41fd-af89-3f3c54d4c23f', // Markus Schork
  'd18786be-d29f-40d1-8605-b728a82f8eeb', // Francisco Schork
]

export default defineMigration({
  title: 'Migrate person documents to artist',
  documentTypes: ['person'],

  migrate: {
    document(doc, context) {
      // Change document type
      const operations = [
        at('_type', set('artist')),

        // Set core artist flag
        at('isCoreArtist', setIfMissing(CORE_ARTIST_IDS.includes(doc._id))),

        // Set active status
        at('isActive', setIfMissing(true)),

        // Initialize empty socialMedia object if null
        at('socialMedia', setIfMissing({
          instagram: '',
          website: '',
          facebook: '',
          twitter: '',
          linkedin: '',
        })),

        // Initialize new fields as empty/null
        at('statement', setIfMissing(null)),
        at('birthYear', setIfMissing(null)),
        at('birthPlace', setIfMissing(null)),
        at('currentLocation', setIfMissing(null)),
        at('education', setIfMissing([])),
        at('cv', setIfMissing(null)),
        at('personalProjects', setIfMissing([])),
        at('interests', setIfMissing([])),
        at('website', setIfMissing('')),
      ]

      return operations
    },
  },
})

function set(value: any) {
  return (prev: any) => value
}
