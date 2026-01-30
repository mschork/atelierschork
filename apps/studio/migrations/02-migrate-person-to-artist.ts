/**
 * Migration Script 02: Migrate Person to Artist
 *
 * This script migrates person documents to the new artist schema:
 * - Changes _type from "person" to "artist"
 * - Sets isCoreArtist: true for Francisco and Markus Schork
 * - Sets isActive: true for all artists
 * - Converts socialMedia from array to object structure
 * - Adds empty values for new fields
 *
 * Usage:
 *   npx sanity exec migrations/02-migrate-person-to-artist.ts --with-user-token
 */

import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

interface OldSocialMedia {
  platform: string
  url: string
}

interface NewSocialMedia {
  instagram?: string
  vimeo?: string
  facebook?: string
  twitter?: string
  other?: string
}

function convertSocialMedia(oldSocialMedia?: OldSocialMedia[]): NewSocialMedia {
  if (!oldSocialMedia || !Array.isArray(oldSocialMedia)) {
    return {}
  }

  const newSocialMedia: NewSocialMedia = {}

  oldSocialMedia.forEach((item) => {
    const platform = item.platform?.toLowerCase()
    const url = item.url

    if (!platform || !url) return

    if (platform.includes('instagram')) {
      newSocialMedia.instagram = url
    } else if (platform.includes('vimeo')) {
      newSocialMedia.vimeo = url
    } else if (platform.includes('facebook')) {
      newSocialMedia.facebook = url
    } else if (platform.includes('twitter') || platform.includes('x.com')) {
      newSocialMedia.twitter = url
    } else {
      newSocialMedia.other = url
    }
  })

  return newSocialMedia
}

function isCoreArtist(firstName: string, lastName: string): boolean {
  const fullName = `${firstName} ${lastName}`.toLowerCase()
  return (
    fullName.includes('francisco schork') ||
    fullName.includes('markus schork') ||
    (firstName?.toLowerCase() === 'francisco' && lastName?.toLowerCase() === 'schork') ||
    (firstName?.toLowerCase() === 'markus' && lastName?.toLowerCase() === 'schork')
  )
}

async function migratePerson() {
  console.log('🔄 Starting person → artist migration...\n')

  try {
    // Fetch all person documents
    console.log('📥 Fetching person documents...')
    const persons = await client.fetch(`*[_type == "person"]`)

    console.log(`✅ Found ${persons.length} person documents\n`)

    if (persons.length === 0) {
      console.log('ℹ️  No person documents to migrate')
      return
    }

    // Process each person
    console.log('🔄 Migrating documents...')
    let successCount = 0
    let errorCount = 0

    for (const person of persons) {
      try {
        const {_id, _rev, socialMedia, firstName, lastName, ...rest} = person

        // Convert social media
        const newSocialMedia = convertSocialMedia(socialMedia)

        // Determine if core artist
        const isCore = isCoreArtist(firstName, lastName)

        // Create artist document
        const artistDoc = {
          ...rest,
          _type: 'artist',
          firstName,
          lastName,
          socialMedia: newSocialMedia,
          isCoreArtist: isCore,
          isActive: true,
          // Add empty arrays for new fields
          education: [],
          personalProjects: [],
          interests: [],
        }

        // Create transaction
        const transaction = client.transaction()

        // Delete old person document
        transaction.delete(_id)

        // Create new artist document with same ID (without drafts prefix if present)
        const newId = _id.replace('drafts.', '')
        transaction.create({
          ...artistDoc,
          _id: newId,
        })

        // If it was a draft, create draft version too
        if (_id.startsWith('drafts.')) {
          transaction.create({
            ...artistDoc,
            _id: _id,
          })
        }

        await transaction.commit()

        const coreIndicator = isCore ? ' ⭐ CORE' : ''
        console.log(`  ✓ Migrated: ${firstName} ${lastName}${coreIndicator}`)
        successCount++
      } catch (error) {
        console.error(`  ✗ Failed to migrate: ${person.firstName} ${person.lastName}`, error)
        errorCount++
      }
    }

    // Print summary
    console.log('\n' + '─'.repeat(50))
    console.log('📊 Migration Summary:')
    console.log(`  ✅ Successful: ${successCount}`)
    console.log(`  ❌ Failed: ${errorCount}`)
    console.log(`  📝 Total: ${persons.length}`)
    console.log('─'.repeat(50))

    if (errorCount > 0) {
      throw new Error(`Migration completed with ${errorCount} errors`)
    }

    console.log('\n✅ Person → Artist migration completed successfully!\n')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Run migration
migratePerson()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
