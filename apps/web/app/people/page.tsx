import Image from "next/image"
import Link from "next/link"
import { getAllArtists } from "@/lib/sanity.queries"
import { getImageUrl } from "@/lib/sanity.client"
import { PortableText } from "@portabletext/react"
import "./people.css"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function PeoplePage() {
  const artists = await getAllArtists()

  return (
    <div className="container">
      <div className="people-container">
        <section className="people-intro">
          <h1>People</h1>
          <p>The artists behind Atelierschork.</p>
        </section>

        <section className="people-list">
          {artists.length > 0 ? (
            <div className="people-grid">
              {artists.map((artist) => (
                <Link href={`/people/${artist.slug.current}`} key={artist._id} className="person-card">
                  <div className="person-image">
                    {artist.profileImage ? (
                      <Image
                        src={getImageUrl(artist.profileImage, { width: 600, height: 600 })}
                        alt={`${artist.firstName} ${artist.lastName}`}
                        fill
                        className="image"
                      />
                    ) : (
                      <div className="placeholder-image">
                        {artist.firstName} {artist.lastName}
                      </div>
                    )}
                  </div>
                  <div className="person-info">
                    <h2>
                      {artist.title && `${artist.title} `}
                      {artist.firstName} {artist.lastName}
                    </h2>
                    {artist.roles && artist.roles.length > 0 && (
                      <p className="person-role">
                        {artist.roles.map((role) => role.title).join(", ")}
                      </p>
                    )}
                    {artist.biography && artist.biography.length > 0 && (
                      <div className="person-bio">
                        <PortableText value={artist.biography.slice(0, 1)} />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-people">
              <p>No artists available yet. Check back soon!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
