/**
 * Atelier Schork - Sanity GROQ Queries
 *
 * This file contains reusable GROQ queries for fetching data from Sanity
 * All queries are typed and optimized for the v2.0 content model
 */

import { sanityClient } from './sanity.client'
import type {
  Artist,
  ArtistExpanded,
  Person,
  PersonExpanded,
  Artwork,
  ArtworkExpanded,
  Project,
  ProjectExpanded,
  Exhibition,
  ExhibitionExpanded,
  Award,
  AwardExpanded,
  Location,
  LocationExpanded,
  SiteSettings,
  Role,
  Medium,
  Technique,
  Tag,
  Category,
  CategoryExpanded,
} from './sanity.types'

// ============================================================================
// GROQ QUERY FRAGMENTS
// ============================================================================

/**
 * Common projection for artist with expanded roles
 */
const artistProjection = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  firstName,
  middleName,
  lastName,
  slug,
  "roles": roles[]->{ _id, title, description },
  profileImage,
  birthDate,
  birthPlace,
  nationality,
  biography,
  education,
  exhibitions,
  cvFile,
  website,
  email,
  phone,
  socialMedia,
  interests,
  nonArtisticWork
`

/**
 * Common projection for person with expanded roles
 */
const personProjection = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  firstName,
  middleName,
  lastName,
  slug,
  "roles": roles[]->{ _id, title, description },
  profileImage,
  biography,
  website,
  email,
  socialMedia
`

/**
 * Common projection for artwork with expanded references
 */
const artworkProjection = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "artists": artists[]->{
    _id,
    _type,
    firstName,
    lastName,
    slug,
    "roles": roles[]->title
  },
  year,
  creationDate,
  "medium": medium->{ _id, title, description },
  "techniques": techniques[]->{ _id, title, description },
  "tags": tags[]->{ _id, title, slug },
  description,
  dimensions,
  media,
  isPrimaryArtwork,
  isFeatured,
  credits,
  "project": project->{ _id, title, slug },
  "relatedArtworks": relatedArtworks[]->{ _id, title, slug, media },
  price,
  availability,
  location,
  orderRank
`

/**
 * Common projection for project with expanded references
 */
const projectProjection = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  status,
  description,
  "creators": creators[]->{
    _id,
    _type,
    firstName,
    lastName,
    slug,
    "roles": roles[]->title
  },
  "collaborators": collaborators[]->{
    _id,
    firstName,
    lastName,
    slug
  },
  coverImage,
  startDate,
  endDate,
  website,
  media,
  "tags": tags[]->{ _id, title, slug },
  isFeatured,
  orderRank,
  "artworkCount": count(*[_type == "artwork" && project._ref == ^._id])
`

/**
 * Common projection for exhibition with expanded references
 */
const exhibitionProjection = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  type,
  status,
  mainImage,
  description,
  "curators": curators[]->{
    _id,
    firstName,
    lastName,
    slug
  },
  "location": location->{
    _id,
    name,
    slug,
    address,
    city,
    country,
    coordinates
  },
  venue,
  city,
  country,
  startDate,
  endDate,
  "artworks": artworks[]->{ _id, title, slug, media },
  "featuredProjects": featuredProjects[]->{ _id, title, slug, coverImage },
  press,
  gallery,
  isFeatured
`

// ============================================================================
// ARTIST QUERIES
// ============================================================================

/**
 * Get all artists with expanded roles
 */
export async function getAllArtists(): Promise<ArtistExpanded[]> {
  const query = `*[_type == "artist"] | order(lastName asc) { ${artistProjection} }`
  return await sanityClient.fetch(query)
}

/**
 * Get artist by slug with expanded data
 */
export async function getArtistBySlug(slug: string): Promise<ArtistExpanded | null> {
  const query = `*[_type == "artist" && slug.current == $slug][0] {
    ${artistProjection},
    "artworks": *[_type == "artwork" && references(^._id)] | order(year desc) {
      ${artworkProjection}
    },
    "projects": *[_type == "project" && references(^._id)] | order(startDate desc) {
      ${projectProjection}
    },
    "exhibitionDocs": *[_type == "exhibition" && references(^._id)] | order(startDate desc) {
      ${exhibitionProjection}
    }
  }`
  return await sanityClient.fetch(query, { slug })
}

// ============================================================================
// PERSON QUERIES
// ============================================================================

/**
 * Get all people with expanded roles
 */
export async function getAllPeople(): Promise<PersonExpanded[]> {
  const query = `*[_type == "person"] | order(lastName asc) { ${personProjection} }`
  return await sanityClient.fetch(query)
}

/**
 * Get person by slug with expanded data
 */
export async function getPersonBySlug(slug: string): Promise<PersonExpanded | null> {
  const query = `*[_type == "person" && slug.current == $slug][0] { ${personProjection} }`
  return await sanityClient.fetch(query, { slug })
}

// ============================================================================
// ARTWORK QUERIES
// ============================================================================

/**
 * Get all artworks with expanded references
 */
export async function getAllArtworks(params?: {
  limit?: number
  offset?: number
}): Promise<ArtworkExpanded[]> {
  const { limit = 100, offset = 0 } = params || {}
  const query = `*[_type == "artwork"] | order(year desc, orderRank asc) [$offset...$limit] { ${artworkProjection} }`
  return await sanityClient.fetch(query, { offset, limit: offset + limit })
}

/**
 * Get featured artworks
 */
export async function getFeaturedArtworks(limit: number = 6): Promise<ArtworkExpanded[]> {
  const query = `*[_type == "artwork" && isFeatured == true] | order(orderRank asc) [0...$limit] { ${artworkProjection} }`
  return await sanityClient.fetch(query, { limit })
}

/**
 * Get artwork by slug with all related data
 */
export async function getArtworkBySlug(slug: string): Promise<ArtworkExpanded | null> {
  const query = `*[_type == "artwork" && slug.current == $slug][0] { ${artworkProjection} }`
  return await sanityClient.fetch(query, { slug })
}

/**
 * Get artworks by artist slug
 */
export async function getArtworksByArtist(artistSlug: string): Promise<ArtworkExpanded[]> {
  const query = `*[_type == "artwork" && references(*[_type == "artist" && slug.current == $artistSlug]._id)] | order(year desc) { ${artworkProjection} }`
  return await sanityClient.fetch(query, { artistSlug })
}

/**
 * Get artworks by project slug
 */
export async function getArtworksByProject(projectSlug: string): Promise<ArtworkExpanded[]> {
  const query = `*[_type == "artwork" && project->slug.current == $projectSlug] | order(orderRank asc, year desc) { ${artworkProjection} }`
  return await sanityClient.fetch(query, { projectSlug })
}

/**
 * Get artworks by technique
 */
export async function getArtworksByTechnique(techniqueSlug: string): Promise<ArtworkExpanded[]> {
  const query = `*[_type == "artwork" && $techniqueSlug in techniques[]->slug.current] | order(year desc) { ${artworkProjection} }`
  return await sanityClient.fetch(query, { techniqueSlug })
}

/**
 * Get artworks by tag
 */
export async function getArtworksByTag(tagSlug: string): Promise<ArtworkExpanded[]> {
  const query = `*[_type == "artwork" && $tagSlug in tags[]->slug.current] | order(year desc) { ${artworkProjection} }`
  return await sanityClient.fetch(query, { tagSlug })
}

// ============================================================================
// PROJECT QUERIES
// ============================================================================

/**
 * Get all projects with expanded references
 */
export async function getAllProjects(): Promise<ProjectExpanded[]> {
  const query = `*[_type == "project"] | order(startDate desc) { ${projectProjection} }`
  return await sanityClient.fetch(query)
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(limit: number = 3): Promise<ProjectExpanded[]> {
  const query = `*[_type == "project" && isFeatured == true] | order(orderRank asc) [0...$limit] { ${projectProjection} }`
  return await sanityClient.fetch(query, { limit })
}

/**
 * Get project by slug with all artworks
 */
export async function getProjectBySlug(slug: string): Promise<ProjectExpanded | null> {
  const query = `*[_type == "project" && slug.current == $slug][0] {
    ${projectProjection},
    "artworks": *[_type == "artwork" && project._ref == ^._id] | order(orderRank asc, year desc) {
      ${artworkProjection}
    }
  }`
  return await sanityClient.fetch(query, { slug })
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(
  status: 'planning' | 'inProgress' | 'completed' | 'archived'
): Promise<ProjectExpanded[]> {
  const query = `*[_type == "project" && status == $status] | order(startDate desc) { ${projectProjection} }`
  return await sanityClient.fetch(query, { status })
}

// ============================================================================
// EXHIBITION QUERIES
// ============================================================================

/**
 * Get all exhibitions
 */
export async function getAllExhibitions(): Promise<ExhibitionExpanded[]> {
  const query = `*[_type == "exhibition"] | order(startDate desc) { ${exhibitionProjection} }`
  return await sanityClient.fetch(query)
}

/**
 * Get upcoming exhibitions
 */
export async function getUpcomingExhibitions(): Promise<ExhibitionExpanded[]> {
  const query = `*[_type == "exhibition" && status == "upcoming"] | order(startDate asc) { ${exhibitionProjection} }`
  return await sanityClient.fetch(query)
}

/**
 * Get current exhibitions
 */
export async function getCurrentExhibitions(): Promise<ExhibitionExpanded[]> {
  const query = `*[_type == "exhibition" && status == "current"] | order(startDate desc) { ${exhibitionProjection} }`
  return await sanityClient.fetch(query)
}

/**
 * Get past exhibitions
 */
export async function getPastExhibitions(limit: number = 20): Promise<ExhibitionExpanded[]> {
  const query = `*[_type == "exhibition" && status == "past"] | order(startDate desc) [0...$limit] { ${exhibitionProjection} }`
  return await sanityClient.fetch(query, { limit })
}

/**
 * Get exhibition by slug
 */
export async function getExhibitionBySlug(slug: string): Promise<ExhibitionExpanded | null> {
  const query = `*[_type == "exhibition" && slug.current == $slug][0] { ${exhibitionProjection} }`
  return await sanityClient.fetch(query, { slug })
}

// ============================================================================
// AWARD QUERIES
// ============================================================================

/**
 * Get all awards
 */
export async function getAllAwards(): Promise<AwardExpanded[]> {
  const query = `*[_type == "award"] | order(year desc) {
    _id,
    _type,
    title,
    slug,
    organization,
    year,
    description,
    "recipients": recipients[]->{
      _id,
      _type,
      firstName,
      lastName,
      slug
    },
    "artwork": artwork->{ _id, title, slug, media },
    isMajorAward
  }`
  return await sanityClient.fetch(query)
}

/**
 * Get awards by artist or person slug
 */
export async function getAwardsByProfile(slug: string): Promise<AwardExpanded[]> {
  const query = `*[_type == "award" && references(*[(_type == "artist" || _type == "person") && slug.current == $slug]._id)] | order(year desc) {
    _id,
    title,
    slug,
    organization,
    year,
    description,
    isMajorAward
  }`
  return await sanityClient.fetch(query, { slug })
}

// ============================================================================
// LOCATION QUERIES
// ============================================================================

/**
 * Get all locations
 */
export async function getAllLocations(): Promise<LocationExpanded[]> {
  const query = `*[_type == "location"] | order(name asc) {
    _id,
    name,
    slug,
    "locationType": locationType->{ _id, title },
    address,
    city,
    country,
    coordinates,
    website,
    openingHours
  }`
  return await sanityClient.fetch(query)
}

/**
 * Get location by slug
 */
export async function getLocationBySlug(slug: string): Promise<LocationExpanded | null> {
  const query = `*[_type == "location" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    "locationType": locationType->{ _id, title },
    address,
    city,
    country,
    coordinates,
    website,
    openingHours,
    "exhibitions": *[_type == "exhibition" && location._ref == ^._id] | order(startDate desc) {
      _id,
      title,
      slug,
      startDate,
      endDate,
      status
    }
  }`
  return await sanityClient.fetch(query, { slug })
}

// ============================================================================
// TAXONOMY QUERIES
// ============================================================================

/**
 * Get all roles
 */
export async function getAllRoles(): Promise<Role[]> {
  const query = `*[_type == "role"] | order(orderRank asc, title asc)`
  return await sanityClient.fetch(query)
}

/**
 * Get all mediums
 */
export async function getAllMediums(): Promise<Medium[]> {
  const query = `*[_type == "medium"] | order(orderRank asc, title asc)`
  return await sanityClient.fetch(query)
}

/**
 * Get all techniques
 */
export async function getAllTechniques(): Promise<Technique[]> {
  const query = `*[_type == "technique"] | order(orderRank asc, title asc)`
  return await sanityClient.fetch(query)
}

/**
 * Get all tags
 */
export async function getAllTags(): Promise<Tag[]> {
  const query = `*[_type == "tag"] | order(title asc)`
  return await sanityClient.fetch(query)
}

/**
 * Get all categories with parent relationships
 */
export async function getAllCategories(): Promise<CategoryExpanded[]> {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "parent": parent->{ _id, title, slug }
  }`
  return await sanityClient.fetch(query)
}

/**
 * Get root categories (no parent)
 */
export async function getRootCategories(): Promise<CategoryExpanded[]> {
  const query = `*[_type == "category" && !defined(parent)] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "children": *[_type == "category" && parent._ref == ^._id] | order(title asc) {
      _id,
      title,
      slug
    }
  }`
  return await sanityClient.fetch(query)
}

// ============================================================================
// SITE SETTINGS QUERIES
// ============================================================================

/**
 * Get site settings
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const query = `*[_type == "siteSettings"][0]`
  return await sanityClient.fetch(query)
}

// ============================================================================
// SEARCH QUERIES
// ============================================================================

/**
 * Search across artworks, projects, and people
 */
export async function searchContent(searchTerm: string): Promise<{
  artworks: ArtworkExpanded[]
  projects: ProjectExpanded[]
  artists: ArtistExpanded[]
  people: PersonExpanded[]
}> {
  const artworksQuery = `*[_type == "artwork" && (title match $searchTerm || pt::text(description) match $searchTerm)] | order(year desc) [0...10] { ${artworkProjection} }`
  const projectsQuery = `*[_type == "project" && (title match $searchTerm || pt::text(description) match $searchTerm)] | order(startDate desc) [0...10] { ${projectProjection} }`
  const artistsQuery = `*[_type == "artist" && (firstName match $searchTerm || lastName match $searchTerm || pt::text(biography) match $searchTerm)] | order(lastName asc) [0...10] { ${artistProjection} }`
  const peopleQuery = `*[_type == "person" && (firstName match $searchTerm || lastName match $searchTerm || pt::text(biography) match $searchTerm)] | order(lastName asc) [0...10] { ${personProjection} }`

  const [artworks, projects, artists, people] = await Promise.all([
    sanityClient.fetch(artworksQuery, { searchTerm: `*${searchTerm}*` }),
    sanityClient.fetch(projectsQuery, { searchTerm: `*${searchTerm}*` }),
    sanityClient.fetch(artistsQuery, { searchTerm: `*${searchTerm}*` }),
    sanityClient.fetch(peopleQuery, { searchTerm: `*${searchTerm}*` }),
  ])

  return { artworks, projects, artists, people }
}
