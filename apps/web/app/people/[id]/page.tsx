import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getArtistBySlug, getAllArtists } from "@/lib/sanity.queries"
import { getImageUrl, getFileUrl } from "@/lib/sanity.client"
import { PortableText } from "@portabletext/react"
import { isImageMedia } from "@/lib/sanity.types"
import "./person-detail.css"

export const revalidate = 60 // Revalidate every 60 seconds

// Generate static params for all artists
export async function generateStaticParams() {
  const artists = await getAllArtists()
  return artists.map((artist) => ({
    id: artist.slug.current,
  }))
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artist = await getArtistBySlug(id)

  if (!artist) {
    notFound()
  }

  return (
    <div className="container">
      <div className="person-detail-container">
        <Link href="/people" className="back-link">
          <ArrowLeft className="back-icon" />
          Back to people
        </Link>

        <section className="person-main">
          <div className="person-image-main">
            <div className="image-container">
              {artist.profileImage ? (
                <Image
                  src={getImageUrl(artist.profileImage, { width: 800, height: 800 })}
                  alt={`${artist.firstName} ${artist.lastName}`}
                  fill
                  className="image"
                  priority
                />
              ) : (
                <div className="placeholder-image">
                  {artist.firstName} {artist.lastName}
                </div>
              )}
            </div>
          </div>

          <div className="person-info">
            <div className="person-header">
              <h1>
                {artist.title && `${artist.title} `}
                {artist.firstName} {artist.middleName && `${artist.middleName} `}
                {artist.lastName}
              </h1>
              {artist.roles && artist.roles.length > 0 && (
                <p className="person-role">
                  {artist.roles.map((role) => role.title).join(", ")}
                </p>
              )}
              {(artist.birthDate || artist.birthPlace || artist.nationality) && (
                <div className="person-meta">
                  {artist.birthDate && <p>Born: {new Date(artist.birthDate).getFullYear()}</p>}
                  {artist.birthPlace && <p>Birthplace: {artist.birthPlace}</p>}
                  {artist.nationality && <p>Nationality: {artist.nationality}</p>}
                </div>
              )}
            </div>

            {artist.biography && (
              <div className="person-bio">
                <PortableText value={artist.biography} />
              </div>
            )}

            {artist.education && (
              <div className="person-details">
                <div className="person-education">
                  <h2>Education</h2>
                  <PortableText value={artist.education} />
                </div>
              </div>
            )}

            {artist.exhibitions && (
              <div className="person-details">
                <div className="person-exhibitions">
                  <h2>Selected Exhibitions</h2>
                  <PortableText value={artist.exhibitions} />
                </div>
              </div>
            )}

            {artist.interests && (
              <div className="person-details">
                <div className="person-interests">
                  <h2>Interests</h2>
                  <PortableText value={artist.interests} />
                </div>
              </div>
            )}

            {artist.nonArtisticWork && (
              <div className="person-details">
                <div className="person-other-work">
                  <h2>Other Work</h2>
                  <PortableText value={artist.nonArtisticWork} />
                </div>
              </div>
            )}

            <div className="person-contact">
              {artist.website && (
                <p>
                  <a href={artist.website} target="_blank" rel="noopener noreferrer">
                    Website →
                  </a>
                </p>
              )}
              {artist.email && (
                <p>
                  <a href={`mailto:${artist.email}`}>Email</a>
                </p>
              )}
              {artist.socialMedia?.instagram && (
                <p>
                  <a href={artist.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram →
                  </a>
                </p>
              )}
              {artist.socialMedia?.vimeo && (
                <p>
                  <a href={artist.socialMedia.vimeo} target="_blank" rel="noopener noreferrer">
                    Vimeo →
                  </a>
                </p>
              )}
              {artist.socialMedia?.facebook && (
                <p>
                  <a href={artist.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook →
                  </a>
                </p>
              )}
              {artist.socialMedia?.twitter && (
                <p>
                  <a href={artist.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter →
                  </a>
                </p>
              )}
              {artist.cvFile && (
                <p>
                  <a href={getFileUrl(artist.cvFile)} download>
                    Download CV
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        {artist.artworks && artist.artworks.length > 0 && (
          <section className="person-artworks">
            <h2>Selected Artworks</h2>
            <div className="artworks-grid">
              {artist.artworks.slice(0, 6).map((artwork) => (
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

        {artist.projects && artist.projects.length > 0 && (
          <section className="person-projects">
            <h2>Selected Projects</h2>
            <div className="projects-grid">
              {artist.projects.map((project) => (
                <Link href={`/projects/${project.slug.current}`} key={project._id} className="project-card">
                  <div className="project-image">
                    {project.coverImage ? (
                      <Image
                        src={getImageUrl(project.coverImage, { width: 400, height: 400 })}
                        alt={project.title}
                        fill
                        className="image"
                      />
                    ) : (
                      <div className="placeholder-image">{project.title}</div>
                    )}
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    {project.startDate && (
                      <p>{new Date(project.startDate).getFullYear()}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {artist.exhibitionDocs && artist.exhibitionDocs.length > 0 && (
          <section className="person-exhibitions-list">
            <h2>Exhibitions</h2>
            <div className="exhibitions-grid">
              {artist.exhibitionDocs.map((exhibition) => (
                <Link
                  href={`/exhibitions/${exhibition.slug.current}`}
                  key={exhibition._id}
                  className="exhibition-card"
                >
                  <h3>{exhibition.title}</h3>
                  <p>
                    {exhibition.startDate && new Date(exhibition.startDate).getFullYear()}
                    {exhibition.venue && ` · ${exhibition.venue}`}
                    {exhibition.city && ` · ${exhibition.city}`}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
