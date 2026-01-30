import {defineMigration, createOrReplace} from 'sanity/migrate'

// Migration: Create artist documents from person documents
// Date: 2025-11-17
//
// Since _type is immutable, we use createOrReplace to create new documents
// with the same _id but different _type (artist instead of person)

const CORE_ARTIST_IDS = [
  '13384ffd-86fa-41fd-af89-3f3c54d4c23f', // Markus Schork
  'd18786be-d29f-40d1-8605-b728a82f8eeb', // Francisco Schork
]

export default defineMigration({
  title: 'Migrate person documents to artist',
  documentTypes: ['person'],

  migrate: {
    document(doc) {
      const newArtistDoc = {
        // Keep the same _id so references remain valid
        _id: doc._id,
        _type: 'artist',

        // Copy existing fields
        firstName: doc.firstName,
        middleName: doc.middleName,
        lastName: doc.lastName,
        bio: doc.bio || null,
        image: doc.image || null,
        email: doc.email || null,
        phone: doc.phone || null,
        roles: doc.roles || [],

        // Add new fields
        isCoreArtist: CORE_ARTIST_IDS.includes(doc._id),
        isActive: true,

        // Initialize socialMedia as empty object (was null/array)
        socialMedia: {
          instagram: '',
          website: '',
          facebook: '',
          twitter: '',
          linkedin: '',
        },

        // Initialize new artist-specific fields
        statement: null,
        birthYear: null,
        birthPlace: null,
        currentLocation: null,
        education: [],
        cv: null,
        personalProjects: [],
        interests: [],
        website: '',
      }

      return createOrReplace(newArtistDoc)
    },
  },
})
