/**
 * Atelierschork Content Model v2.0 - TypeScript Type Definitions
 *
 * Generated from Sanity schema definitions
 * Project: atelierschork.com (4wgg11gp)
 * Dataset: production
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface Slug {
  _type: 'slug'
  current: string
}

export interface Reference {
  _type: 'reference'
  _ref: string
}

export interface Geopoint {
  _type: 'geopoint'
  lat: number
  lng: number
  alt?: number
}

export interface PortableTextBlock {
  _type: 'block'
  _key: string
  style?: string
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    [key: string]: any
  }>
}

// ============================================================================
// MEDIA OBJECT TYPES
// ============================================================================

export interface ImageMedia {
  _type: 'imageMedia'
  _key?: string
  image: {
    _type: 'image'
    asset: Reference
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
  }
  alt?: string
  caption?: string
  isPrimary?: boolean
}

export interface VideoMedia {
  _type: 'videoMedia'
  _key?: string
  video: {
    _type: 'file'
    asset: Reference
  }
  caption?: string
  isPrimary?: boolean
}

export interface VimeoMedia {
  _type: 'vimeoMedia'
  _key?: string
  vimeoId: string
  caption?: string
  isPrimary?: boolean
}

export interface YoutubeMedia {
  _type: 'youtubeMedia'
  _key?: string
  youtubeId: string
  caption?: string
  isPrimary?: boolean
}

export type MediaItem = ImageMedia | VideoMedia | VimeoMedia | YoutubeMedia

// ============================================================================
// SOCIAL MEDIA TYPES
// ============================================================================

export interface SocialMediaLink {
  _type: 'socialMediaLink'
  _key: string
  platform: string
  url: string
}

// ============================================================================
// EXHIBITION TYPES
// ============================================================================

export interface PressItem {
  _type: 'pressItem'
  _key: string
  title: string
  publication?: string
  url?: string
  date?: string
}

export interface GalleryItem {
  _type: 'galleryItem'
  _key: string
  image: {
    _type: 'image'
    asset: Reference
  }
  caption?: string
}

// ============================================================================
// CORE DOCUMENT TYPES
// ============================================================================

/**
 * Person - Artist/collaborator profiles
 * Matches the person schema in apps/studio/schemaTypes/person.ts
 */
export interface Person extends SanityDocument {
  _type: 'person'
  title?: string
  firstName: string
  middleName?: string
  lastName: string
  slug: Slug
  roles?: Reference[]
  profileImage?: {
    _type: 'image'
    asset: Reference
  }
  isCoreArtist?: boolean
  isActive?: boolean
  biography?: PortableTextBlock[]
  statement?: PortableTextBlock[]
  birthYear?: number
  birthPlace?: string
  currentLocation?: string
  interests?: string[]
  education?: Array<{
    degree: string
    institution: string
    year?: number
  }>
  cvFile?: {
    _type: 'file'
    asset: Reference
  }
  personalProjects?: Array<{
    title: string
    description?: string
    year?: number
    url?: string
  }>
  email?: string
  phone?: string
  website?: string
  socialMedia?: {
    instagram?: string
    vimeo?: string
    facebook?: string
    twitter?: string
    other?: string
  }
}

/**
 * @deprecated Use Person instead - kept for backwards compatibility
 */
export type Artist = Person

/**
 * Artwork - Individual art pieces with rich metadata
 * 21 fields total
 */
export interface Artwork extends SanityDocument {
  _type: 'artwork'
  title: string
  slug: Slug
  artists?: Reference[]
  year?: number
  creationDate?: string
  medium?: Reference
  techniques?: Reference[]
  tags?: Reference[]
  description?: PortableTextBlock[]
  dimensions?: string
  media?: MediaItem[]
  isPrimaryArtwork?: boolean
  isFeatured?: boolean
  credits?: string
  project?: Reference
  relatedArtworks?: Reference[]
  price?: number
  availability?: 'available' | 'sold' | 'notForSale' | 'private'
  location?: string
  orderRank?: number
}

/**
 * Project - Groupings of related work (replaces Collection)
 * 15 fields total
 */
export interface Project extends SanityDocument {
  _type: 'project'
  title: string
  slug: Slug
  status?: 'planning' | 'inProgress' | 'completed' | 'archived'
  description?: PortableTextBlock[]
  creators?: Reference[]
  collaborators?: Reference[]
  coverImage?: {
    _type: 'image'
    asset: Reference
  }
  startDate?: string
  endDate?: string
  website?: string
  media?: MediaItem[]
  tags?: Reference[]
  isFeatured?: boolean
  orderRank?: number
}

/**
 * Exhibition - Events showcasing artworks
 * 19 fields total
 */
export interface Exhibition extends SanityDocument {
  _type: 'exhibition'
  title: string
  slug: Slug
  type?: 'solo' | 'group' | 'collaboration'
  status?: 'upcoming' | 'current' | 'past'
  mainImage?: {
    _type: 'image'
    asset: Reference
  }
  description?: PortableTextBlock[]
  curators?: Reference[]
  location?: Reference
  venue?: string
  city?: string
  country?: string
  startDate?: string
  endDate?: string
  artworks?: Reference[]
  featuredProjects?: Reference[]
  press?: PressItem[]
  gallery?: GalleryItem[]
  isFeatured?: boolean
}

// ============================================================================
// SUPPORT & RECOGNITION TYPES
// ============================================================================

/**
 * Award - Recognition and prizes
 * 9 fields total
 */
export interface Award extends SanityDocument {
  _type: 'award'
  title: string
  slug: Slug
  organization?: string
  year?: number
  description?: PortableTextBlock[]
  recipients?: Reference[]
  artwork?: Reference
  isMajorAward?: boolean
}

/**
 * Location - Physical venues with geographic data
 * 10 fields total
 */
export interface Location extends SanityDocument {
  _type: 'location'
  name: string
  slug: Slug
  locationType?: Reference
  address?: string
  city?: string
  country?: string
  coordinates?: Geopoint
  website?: string
  openingHours?: string
}

// ============================================================================
// TAXONOMY TYPES
// ============================================================================

/**
 * Role - Person/artist role classification
 * 4 fields total
 */
export interface Role extends SanityDocument {
  _type: 'role'
  title: string
  description?: string
  orderRank?: number
}

/**
 * Medium - Art medium taxonomy
 * 4 fields total
 */
export interface Medium extends SanityDocument {
  _type: 'medium'
  title: string
  description?: string
  orderRank?: number
}

/**
 * Technique - Artistic technique taxonomy
 * 4 fields total
 */
export interface Technique extends SanityDocument {
  _type: 'technique'
  title: string
  description?: string
  orderRank?: number
}

/**
 * Tag - Content tagging
 * 3 fields total
 */
export interface Tag extends SanityDocument {
  _type: 'tag'
  title: string
  slug: Slug
}

/**
 * Category - Hierarchical categorization
 * 5 fields total
 */
export interface Category extends SanityDocument {
  _type: 'category'
  title: string
  slug: Slug
  description?: string
  parent?: Reference
}

/**
 * LocationType - Location taxonomy
 * 2 fields total
 */
export interface LocationType extends SanityDocument {
  _type: 'locationType'
  title: string
}

/**
 * Media Type - Legacy media taxonomy
 * 4 fields total
 */
export interface MediaType extends SanityDocument {
  _type: 'mediaType'
  title: string
  description?: string
  orderRank?: number
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Site Settings - Global website configuration
 * 7 fields total
 */
export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings'
  title: string
  description?: string
  contactEmail?: string
  socialMedia?: {
    instagram?: string
    vimeo?: string
    facebook?: string
  }
  footerText?: PortableTextBlock[]
}

// ============================================================================
// UNION TYPES FOR QUERIES
// ============================================================================

export type SanityDocumentType =
  | Person
  | Artwork
  | Project
  | Exhibition
  | Award
  | Location
  | Role
  | Medium
  | Technique
  | Tag
  | Category
  | LocationType
  | MediaType
  | SiteSettings

export type TaxonomyType = Role | Medium | Technique | Tag | Category | LocationType | MediaType

export type ProfileType = Person

export type ContentType = Artwork | Project | Exhibition | Award

// ============================================================================
// EXPANDED TYPES WITH POPULATED REFERENCES
// ============================================================================

/**
 * Expanded Person type with populated references
 * Note: artworks, projects, and exhibitionDocs are fetched via reverse references
 * in getPersonBySlug query.
 */
export interface PersonExpanded extends Omit<Person, 'roles'> {
  roles?: Role[]
  artworks?: ArtworkExpanded[]
  projects?: ProjectExpanded[]
  exhibitionDocs?: ExhibitionExpanded[]
}

/**
 * @deprecated Use PersonExpanded instead - kept for backwards compatibility
 */
export type ArtistExpanded = PersonExpanded

/**
 * Expanded Artwork type with populated references
 */
export interface ArtworkExpanded extends Omit<Artwork, 'artists' | 'medium' | 'techniques' | 'tags' | 'project' | 'relatedArtworks'> {
  artists?: Person[]
  mediaTypes?: MediaType[]
  techniques?: Technique[]
  tags?: Tag[]
  project?: Project
  relatedArtworks?: Artwork[]
}

/**
 * Expanded Project type with populated references
 * Note: artworks is fetched via reverse reference in getProjectBySlug query
 */
export interface ProjectExpanded extends Omit<Project, 'creators' | 'collaborators' | 'tags'> {
  creators?: Person[]
  collaborators?: Person[]
  tags?: Tag[]
  artworkCount?: number
  artworks?: ArtworkExpanded[]
}

/**
 * Expanded Exhibition type with populated references
 */
export interface ExhibitionExpanded extends Omit<Exhibition, 'curators' | 'location' | 'artworks' | 'featuredProjects'> {
  curators?: Person[]
  location?: Location
  artworks?: Artwork[]
  featuredProjects?: Project[]
}

/**
 * Expanded Award type with populated references
 */
export interface AwardExpanded extends Omit<Award, 'recipients' | 'artwork'> {
  recipients?: Person[]
  artwork?: Artwork
}

/**
 * Expanded Location type with populated references
 */
export interface LocationExpanded extends Omit<Location, 'locationType'> {
  locationType?: LocationType
}

/**
 * Expanded Category type with populated references
 */
export interface CategoryExpanded extends Omit<Category, 'parent'> {
  parent?: Category
}

// ============================================================================
// HELPER TYPE GUARDS
// ============================================================================

export function isPerson(doc: SanityDocumentType): doc is Person {
  return doc._type === 'person'
}

/**
 * @deprecated Use isPerson instead - artist type no longer exists
 */
export const isArtist = isPerson

export function isArtwork(doc: SanityDocumentType): doc is Artwork {
  return doc._type === 'artwork'
}

export function isProject(doc: SanityDocumentType): doc is Project {
  return doc._type === 'project'
}

export function isExhibition(doc: SanityDocumentType): doc is Exhibition {
  return doc._type === 'exhibition'
}

export function isAward(doc: SanityDocumentType): doc is Award {
  return doc._type === 'award'
}

export function isLocation(doc: SanityDocumentType): doc is Location {
  return doc._type === 'location'
}

export function isImageMedia(media: MediaItem): media is ImageMedia {
  return media._type === 'imageMedia'
}

export function isVideoMedia(media: MediaItem): media is VideoMedia {
  return media._type === 'videoMedia'
}

export function isVimeoMedia(media: MediaItem): media is VimeoMedia {
  return media._type === 'vimeoMedia'
}

export function isYoutubeMedia(media: MediaItem): media is YoutubeMedia {
  return media._type === 'youtubeMedia'
}
