import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getProjectBySlug, getAllProjects } from "@/lib/sanity.queries"
import { getImageUrl } from "@/lib/sanity.client"
import { PortableText } from "@portabletext/react"
import { isImageMedia } from "@/lib/sanity.types"
import "./project-detail.css"

export const revalidate = 60 // Revalidate every 60 seconds

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    id: project.slug.current,
  }))
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectBySlug(id)

  if (!project) {
    notFound()
  }

  // Get primary media item or first item
  const primaryMedia = project.media?.find((item) => item.isPrimary) || project.media?.[0]

  return (
    <div className="container">
      <div className="project-detail-container">
        <Link href="/projects" className="back-link">
          <ArrowLeft className="back-icon" />
          Back to projects
        </Link>

        <section className="project-main">
          <div className="project-image-main">
            <div className="image-container">
              {project.coverImage ? (
                <Image
                  src={getImageUrl(project.coverImage, { width: 1200, height: 800 })}
                  alt={project.title}
                  fill
                  className="image"
                  priority
                />
              ) : primaryMedia && isImageMedia(primaryMedia) ? (
                <Image
                  src={getImageUrl(primaryMedia.image, { width: 1200, height: 800 })}
                  alt={primaryMedia.alt || project.title}
                  fill
                  className="image"
                  priority
                />
              ) : (
                <div className="placeholder-image">{project.title}</div>
              )}
            </div>
          </div>

          <div className="project-info">
            <div className="project-header">
              <h1>{project.title}</h1>
              <p className="project-meta">
                {project.startDate && new Date(project.startDate).getFullYear()}
                {project.endDate && ` - ${new Date(project.endDate).getFullYear()}`}
                {project.status && ` · ${project.status}`}
              </p>
            </div>

            {project.creators && project.creators.length > 0 && (
              <div className="project-collaborators">
                <h2>Creators</h2>
                <p>
                  {project.creators.map((creator) => (
                    <span key={creator._id}>
                      {creator.firstName} {creator.lastName}
                      {creator.roles && creator.roles.length > 0 && (
                        <span className="role"> ({creator.roles.join(", ")})</span>
                      )}
                    </span>
                  )).reduce((prev, curr) => [prev, ", ", curr] as any)}
                </p>
              </div>
            )}

            {project.collaborators && project.collaborators.length > 0 && (
              <div className="project-collaborators">
                <h2>Collaborators</h2>
                <p>
                  {project.collaborators.map((collaborator) =>
                    `${collaborator.firstName} ${collaborator.lastName}`
                  ).join(", ")}
                </p>
              </div>
            )}

            {project.description && (
              <div className="project-description">
                <h2>About</h2>
                <PortableText value={project.description} />
              </div>
            )}

            {project.artworkCount !== undefined && project.artworkCount > 0 && (
              <div className="project-stats">
                <p><strong>{project.artworkCount}</strong> artworks in this project</p>
              </div>
            )}

            {project.website && (
              <div className="project-website">
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  Visit project website →
                </a>
              </div>
            )}
          </div>
        </section>

        {project.media && project.media.length > 0 && (
          <section className="project-gallery">
            <h2>Project Gallery</h2>
            <div className="gallery-grid">
              {project.media.map((mediaItem, index) => (
                <div key={mediaItem._key || index} className="gallery-item">
                  {isImageMedia(mediaItem) && (
                    <Image
                      src={getImageUrl(mediaItem.image, { width: 600, height: 600 })}
                      alt={mediaItem.alt || `${project.title} - Image ${index + 1}`}
                      fill
                      className="image"
                    />
                  )}
                  {mediaItem.caption && (
                    <p className="caption">{mediaItem.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {project.artworks && project.artworks.length > 0 && (
          <section className="project-artworks">
            <h2>Artworks</h2>
            <div className="artworks-grid">
              {project.artworks.map((artwork) => (
                <Link
                  href={`/artworks/${artwork.slug.current}`}
                  key={artwork._id}
                  className="artwork-card"
                >
                  <div className="artwork-image">
                    {artwork.media?.[0] && isImageMedia(artwork.media[0]) ? (
                      <Image
                        src={getImageUrl(artwork.media[0].image, { width: 400, height: 400 })}
                        alt={artwork.media[0].alt || artwork.title}
                        fill
                        className="image"
                      />
                    ) : (
                      <div className="placeholder-image">{artwork.title}</div>
                    )}
                  </div>
                  <div className="artwork-info">
                    <h3>{artwork.title}</h3>
                    {artwork.year && <p>{artwork.year}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
