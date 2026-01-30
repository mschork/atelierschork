import {defineMigration, at, set} from 'sanity/migrate'

// Migration: Update project creators from person to artist references
// Date: 2025-11-17
//
// Mapping of old person IDs to new artist IDs:
// - Markus: 13384ffd-86fa-41fd-af89-3f3c54d4c23f → 3f151b53-676a-4dbb-a9c6-7a9fc5952634
// - Francisco: d18786be-d29f-40d1-8605-b728a82f8eeb → d5ea0301-9ebe-49e5-aa98-3866934f9d88
// - Émilie: 0cdee811-8f95-442d-ae12-d47d133959e7 → 18eed5a6-d7fa-4925-b316-8c58240500e1

const PERSON_TO_ARTIST_MAP: Record<string, string> = {
  '13384ffd-86fa-41fd-af89-3f3c54d4c23f': '3f151b53-676a-4dbb-a9c6-7a9fc5952634', // Markus
  'd18786be-d29f-40d1-8605-b728a82f8eeb': 'd5ea0301-9ebe-49e5-aa98-3866934f9d88', // Francisco
  '0cdee811-8f95-442d-ae12-d47d133959e7': '18eed5a6-d7fa-4925-b316-8c58240500e1', // Émilie
}

export default defineMigration({
  title: 'Update project creators from person to artist references',
  documentTypes: ['project'],
  filter: 'defined(creators) && count(creators[]) > 0',

  migrate: {
    document(doc) {
      if (!doc.creators || !Array.isArray(doc.creators)) {
        return
      }

      // Map old person references to new artist references
      const updatedCreators = doc.creators.map((creator: any) => {
        if (creator._ref && PERSON_TO_ARTIST_MAP[creator._ref]) {
          return {
            ...creator,
            _ref: PERSON_TO_ARTIST_MAP[creator._ref],
          }
        }
        return creator
      })

      return at('creators', set(updatedCreators))
    },
  },
})
