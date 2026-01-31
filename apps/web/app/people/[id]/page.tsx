import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPersonBySlug, getAllPeople } from "@/lib/sanity.queries"
import { getImageUrl, getFileUrl } from "@/lib/sanity.client"
import { PortableText } from "@portabletext/react"
import { isImageMedia, PortableTextBlock } from "@/lib/sanity.types"
import "./person-detail.css"

export const revalidate = 60 // Revalidate every 60 seconds

// Generate static params for all people
export async function generateStaticParams() {
  const people = await getAllPeople()
  return people.map((person) => ({
    id: person.slug.current,
  }))
}

// Helper to extract plain text from portable text
function portableTextToPlainText(blocks?: PortableTextBlock[]): string {
  if (!blocks) return ""
  return blocks
    .map((block) =>
      block.children?.map((child) => child.text).join("") ?? ""
    )
    .join(" ")
    .slice(0, 160)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const person = await getPersonBySlug(id)

  if (!person) {
    return {
      title: "Profile Not Found",
    }
  }

  const fullName = [person.title, person.firstName, person.middleName, person.lastName]
    .filter(Boolean)
    .join(" ")

  const roleText = person.roles?.map((role) => role.title).join(", ")
  const description = portableTextToPlainText(person.biography) ||
    `${fullName}${roleText ? ` - ${roleText}` : ""} at Atelierschork`

  const imageUrl = person.profileImage
    ? getImageUrl(person.profileImage, { width: 1200, height: 630 })
    : undefined

  return {
    title: `${fullName} | Atelierschork`,
    description,
    openGraph: {
      title: fullName,
      description,
      type: "profile",
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: fullName,
      description,
    },
  }
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const person = await getPersonBySlug(id)

  if (!person) {
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
              {person.profileImage ? (
                <Image
                  src={getImageUrl(person.profileImage, { width: 800, height: 800 })}
                  alt={`${person.firstName} ${person.lastName}`}
                  fill
                  className="image"
                  priority
                />
              ) : (
                <div className="placeholder-image">
                  {person.firstName} {person.lastName}
                </div>
              )}
            </div>
          </div>

          <div className="person-info">
            <div className="person-header">
              <h1>
                {person.title && `${person.title} `}
                {person.firstName} {person.middleName && `${person.middleName} `}
                {person.lastName}
              </h1>
              {person.roles && person.roles.length > 0 && (
                <p className="person-role">
                  {person.roles.map((role) => role.title).join(", ")}
                </p>
              )}
              {(person.birthYear || person.birthPlace || person.currentLocation) && (
                <div className="person-meta">
                  {person.birthYear && <p>Born: {person.birthYear}</p>}
                  {person.birthPlace && <p>Birthplace: {person.birthPlace}</p>}
                  {person.currentLocation && <p>Based in: {person.currentLocation}</p>}
                </div>
              )}
            </div>

            {person.biography && (
              <div className="person-bio">
                <PortableText value={person.biography} />
              </div>
            )}

            {person.statement && (
              <div className="person-details">
                <div className="person-statement">
                  <h2>Artist Statement</h2>
                  <PortableText value={person.statement} />
                </div>
              </div>
            )}

            {person.education && person.education.length > 0 && (
              <div className="person-details">
                <div className="person-education">
                  <h2>Education</h2>
                  <ul>
                    {person.education.map((edu, index) => (
                      <li key={index}>
                        {edu.degree} — {edu.institution}
                        {edu.year && ` (${edu.year})`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {person.interests && person.interests.length > 0 && (
              <div className="person-details">
                <div className="person-interests">
                  <h2>Interests</h2>
                  <p>{person.interests.join(", ")}</p>
                </div>
              </div>
            )}

            <div className="person-contact">
              {person.website && (
                <p>
                  <a href={person.website} target="_blank" rel="noopener noreferrer">
                    Website →
                  </a>
                </p>
              )}
              {person.email && (
                <p>
                  <a href={`mailto:${person.email}`}>Email</a>
                </p>
              )}
              {person.socialMedia?.instagram && (
                <p>
                  <a href={person.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram →
                  </a>
                </p>
              )}
              {person.socialMedia?.vimeo && (
                <p>
                  <a href={person.socialMedia.vimeo} target="_blank" rel="noopener noreferrer">
                    Vimeo →
                  </a>
                </p>
              )}
              {person.socialMedia?.facebook && (
                <p>
                  <a href={person.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook →
                  </a>
                </p>
              )}
              {person.socialMedia?.twitter && (
                <p>
                  <a href={person.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter →
                  </a>
                </p>
              )}
              {person.cvFile && (
                <p>
                  <a href={getFileUrl(person.cvFile)} download>
                    Download CV
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        {person.artworks && person.artworks.length > 0 && (
          <section className="person-artworks">
            <h2>Selected Artworks</h2>
            <div className="artworks-grid">
              {person.artworks.slice(0, 6).map((artwork) => (
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

        {person.projects && person.projects.length > 0 && (
          <section className="person-projects">
            <h2>Selected Projects</h2>
            <div className="projects-grid">
              {person.projects.map((project) => (
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

        {person.exhibitionDocs && person.exhibitionDocs.length > 0 && (
          <section className="person-exhibitions-list">
            <h2>Exhibitions</h2>
            <div className="exhibitions-grid">
              {person.exhibitionDocs.map((exhibition) => (
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
