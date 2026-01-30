/**
 * Migration Script 01: Backup Current Data
 *
 * This script exports all documents from Sanity to JSON files for backup
 * before running any migrations.
 *
 * Usage:
 *   npx sanity exec migrations/01-backup-current-data.ts --with-user-token
 */

import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

interface DocumentCount {
  _type: string
  count: number
}

interface BackupReport {
  timestamp: string
  totalDocuments: number
  documentsByType: DocumentCount[]
  backupPath: string
}

async function backupData() {
  console.log('🔄 Starting data backup...\n')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.join(process.cwd(), 'migration-backup', timestamp)

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, {recursive: true})
  }

  try {
    // Fetch all documents
    console.log('📥 Fetching all documents...')
    const documents = await client.fetch(`*[!(_id in path("_.**"))]`)

    console.log(`✅ Found ${documents.length} documents\n`)

    // Group documents by type
    const documentsByType = documents.reduce((acc: {[key: string]: any[]}, doc: any) => {
      const type = doc._type
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(doc)
      return acc
    }, {})

    // Save each document type to a separate file
    console.log('💾 Saving documents by type...')
    const counts: DocumentCount[] = []

    for (const [type, docs] of Object.entries(documentsByType)) {
      const filename = `${type}.json`
      const filepath = path.join(backupDir, filename)

      fs.writeFileSync(filepath, JSON.stringify(docs, null, 2))
      console.log(`  ✓ Saved ${docs.length} ${type} documents → ${filename}`)

      counts.push({
        _type: type,
        count: docs.length,
      })
    }

    // Save all documents in one file too
    const allDocsPath = path.join(backupDir, 'all-documents.json')
    fs.writeFileSync(allDocsPath, JSON.stringify(documents, null, 2))
    console.log(`  ✓ Saved all documents → all-documents.json\n`)

    // Generate inventory report
    const report: BackupReport = {
      timestamp,
      totalDocuments: documents.length,
      documentsByType: counts.sort((a, b) => b.count - a.count),
      backupPath: backupDir,
    }

    const reportPath = path.join(backupDir, 'backup-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    // Print summary
    console.log('📊 Backup Summary:')
    console.log('─'.repeat(50))
    console.log(`Total Documents: ${report.totalDocuments}`)
    console.log('\nDocuments by Type:')
    report.documentsByType.forEach(({_type, count}) => {
      console.log(`  • ${_type}: ${count}`)
    })
    console.log('─'.repeat(50))
    console.log(`\n✅ Backup completed successfully!`)
    console.log(`📁 Backup location: ${backupDir}\n`)

    return report
  } catch (error) {
    console.error('❌ Backup failed:', error)
    throw error
  }
}

// Run backup
backupData()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
