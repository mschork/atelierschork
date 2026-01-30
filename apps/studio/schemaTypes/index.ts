// Documents
import person from './person'
import artwork from './artwork'
import project from './project'
import exhibition from './exhibition'
import award from './award'
// artist.ts removed - reverted back to person with roles

// Places
import location from './location'
import locationType from './locationType'

// Taxonomies
import mediaType from './mediaType'
import medium from './medium' // Legacy - to be migrated to mediaType
import technique from './technique'
import tag from './tag'
import category from './category'
import role from './role'
import projectType from './projectType'

// Settings
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Main Content
  person,
  artwork,
  project,
  exhibition,
  award,

  // Legacy (to be migrated)
  medium,

  // Places
  location,
  locationType,

  // Taxonomies
  mediaType,
  technique,
  tag,
  category,
  role,
  projectType,

  // Settings
  siteSettings,
]
