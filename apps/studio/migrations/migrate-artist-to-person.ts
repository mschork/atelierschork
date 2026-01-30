import {defineMigration, at, set, setIfMissing, unset} from 'sanity/migrate'

// Artist ID to Person ID mapping
// OLD_ARTIST_ID -> NEW_PERSON_ID
const ARTIST_TO_PERSON_MAP: Record<string, string> = {
  // Markus Schork (Artist → Core Team + Artist)
  '3f151b53-676a-4dbb-a9c6-7a9fc5952634': 'd2ebbc9b-ae79-40c9-81f3-841b471a43e5',
  // Francisco Schork (Artist → Core Team + Artist)
  'd5ea0301-9ebe-49e5-aa98-3866934f9d88': 'c43bcb53-d258-482a-acf5-5d47f5dbe22e',
  // Émilie Queney (Artist → Artist)
  '18eed5a6-d7fa-4925-b316-8c58240500e1': '42c64ebe-d55a-4586-943d-fd2b6f6d9874',
}

// Role IDs
const CORE_TEAM_ROLE_ID = '162e58c7-9fe6-4f18-8a88-3c077f4486e0'
const ARTIST_ROLE_ID = '195653e7-a005-4f3d-b802-1312fa0a082f'

// Note: Person documents created with appropriate roles:
// - Markus & Francisco: Artist + Core Team roles
// - Émilie: Artist role

export default defineMigration({
  title: 'Migrate artist documents to person with roles',
  documentTypes: ['artist', 'artwork', 'project', 'award', 'exhibition'],

  migrate: {
    // Note: We cannot change _type via migration, so person documents must be created manually
    // This migration will only update references

    // Step 1: Update artwork references
    document(doc, context) {
      if (doc._type === 'artwork' && doc.artists) {
        const updatedArtists = doc.artists.map((artist: any) => {
          if (artist._ref && ARTIST_TO_PERSON_MAP[artist._ref]) {
            return at('_ref', set(ARTIST_TO_PERSON_MAP[artist._ref]))
          }
          return artist
        })
        return at('artists', set(updatedArtists))
      }

      // Step 2: Update project creator references
      if (doc._type === 'project' && doc.creators) {
        const updatedCreators = doc.creators.map((creator: any) => {
          if (creator._ref && ARTIST_TO_PERSON_MAP[creator._ref]) {
            return at('_ref', set(ARTIST_TO_PERSON_MAP[creator._ref]))
          }
          return creator
        })
        return at('creators', set(updatedCreators))
      }

      // Step 3: Update project collaborator references
      if (doc._type === 'project' && doc.collaborators) {
        const updatedCollaborators = doc.collaborators.map((collaborator: any) => {
          if (collaborator._ref && ARTIST_TO_PERSON_MAP[collaborator._ref]) {
            return at('_ref', set(ARTIST_TO_PERSON_MAP[collaborator._ref]))
          }
          return collaborator
        })
        return at('collaborators', set(updatedCollaborators))
      }

      // Step 4: Update award recipient references
      if (doc._type === 'award' && doc.recipients) {
        const updatedRecipients = doc.recipients.map((recipient: any) => {
          if (recipient._ref && ARTIST_TO_PERSON_MAP[recipient._ref]) {
            return at('_ref', set(ARTIST_TO_PERSON_MAP[recipient._ref]))
          }
          return recipient
        })
        return at('recipients', set(updatedRecipients))
      }

      // Step 5: Update exhibition curator references
      if (doc._type === 'exhibition' && doc.curators) {
        const updatedCurators = doc.curators.map((curator: any) => {
          if (curator._ref && ARTIST_TO_PERSON_MAP[curator._ref]) {
            return at('_ref', set(ARTIST_TO_PERSON_MAP[curator._ref]))
          }
          return curator
        })
        return at('curators', set(updatedCurators))
      }

      // Step 6: Update exhibition participant references
      if (doc._type === 'exhibition' && doc.participants) {
        const updatedParticipants = doc.participants.map((participant: any) => {
          if (participant._ref && ARTIST_TO_PERSON_MAP[participant._ref]) {
            return at('_ref', set(ARTIST_TO_PERSON_MAP[participant._ref]))
          }
          return participant
        })
        return at('participants', set(updatedParticipants))
      }

      return
    },
  },
})
