import Image from "next/image"
import Link from "next/link"
import { getAllPeople } from "@/lib/sanity.queries"
import { getImageUrl } from "@/lib/sanity.client"
import { PortableText } from "@portabletext/react"
import "./people.css"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function PeoplePage() {
  const people = await getAllPeople()

  return (
    <div className="container">
      <div className="people-container">
        <section className="people-intro">
          <h1>People</h1>
          <p>The artists behind Atelierschork.</p>
        </section>

        <section className="people-list">
          {people.length > 0 ? (
            <div className="people-grid">
              {people.map((person) => (
                <Link href={`/people/${person.slug.current}`} key={person._id} className="person-card">
                  <div className="person-image">
                    {person.profileImage ? (
                      <Image
                        src={getImageUrl(person.profileImage, { width: 600, height: 600 })}
                        alt={`${person.firstName} ${person.lastName}`}
                        fill
                        className="image"
                      />
                    ) : (
                      <div className="placeholder-image">
                        {person.firstName} {person.lastName}
                      </div>
                    )}
                  </div>
                  <div className="person-info">
                    <h2>
                      {person.title && `${person.title} `}
                      {person.firstName} {person.lastName}
                    </h2>
                    {person.roles && person.roles.length > 0 && (
                      <p className="person-role">
                        {person.roles.map((role) => role.title).join(", ")}
                      </p>
                    )}
                    {person.biography && person.biography.length > 0 && (
                      <div className="person-bio">
                        <PortableText value={person.biography.slice(0, 1)} />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-people">
              <p>No people available yet. Check back soon!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
