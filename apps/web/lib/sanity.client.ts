/**
 * Atelier Schork - Sanity Client Configuration
 *
 * This file configures the Sanity client for fetching data from the CMS
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable')
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET environment variable')
}

/**
 * Sanity client configuration
 */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-01-01', // Use current date for latest API version
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for better performance
}

/**
 * Main Sanity client instance
 * Use this for all data fetching operations
 */
export const sanityClient = createClient(sanityConfig)

/**
 * Image URL builder
 * Use this to generate optimized image URLs from Sanity image assets
 *
 * @example
 * const imageUrl = urlFor(image)
 *   .width(800)
 *   .height(600)
 *   .fit('crop')
 *   .url()
 */
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Get optimized image URL with default settings
 */
export function getImageUrl(
  source: SanityImageSource,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'jpg' | 'png' | 'webp'
  } = {}
): string {
  const { width = 1200, height, quality = 90, format = 'webp' } = options

  let urlBuilder = urlFor(source).width(width).quality(quality).format(format)

  if (height) {
    urlBuilder = urlBuilder.height(height)
  }

  return urlBuilder.url()
}

/**
 * Get responsive image URLs for different screen sizes
 */
export function getResponsiveImageUrls(source: SanityImageSource) {
  return {
    mobile: getImageUrl(source, { width: 640 }),
    tablet: getImageUrl(source, { width: 1024 }),
    desktop: getImageUrl(source, { width: 1920 }),
    original: urlFor(source).url(),
  }
}

/**
 * Get image dimensions from Sanity asset
 * Note: This accesses internal Sanity image builder properties
 */
export function getImageDimensions(source: SanityImageSource) {
  const image = urlFor(source)
  const imageSource = image.options.source as Record<string, unknown> | undefined
  const asset = imageSource?.asset as Record<string, unknown> | undefined
  const metadata = asset?.metadata as Record<string, unknown> | undefined
  const dimensions = metadata?.dimensions as Record<string, unknown> | undefined

  return {
    width: dimensions?.width as number | undefined,
    height: dimensions?.height as number | undefined,
    aspectRatio: dimensions?.aspectRatio as number | undefined,
  }
}

/**
 * Get file URL from Sanity file asset reference
 * File references are in format: file-{assetId}-{extension}
 */
export function getFileUrl(fileAsset: { _ref: string } | { asset: { _ref: string } }): string {
  const ref = '_ref' in fileAsset ? fileAsset._ref : fileAsset.asset._ref

  // Parse the reference: file-{assetId}-{extension}
  const [, assetId, extension] = ref.split('-')

  if (!assetId || !extension) {
    console.warn('Invalid file asset reference:', ref)
    return ''
  }

  return `https://cdn.sanity.io/files/${sanityConfig.projectId}/${sanityConfig.dataset}/${assetId}.${extension}`
}
