import Image from "next/image"
import Link from "next/link"
import { getFeaturedProjects } from "@/lib/sanity.queries"
import { getImageUrl } from "@/lib/sanity.client"
import "./home.css"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const featuredProjects = await getFeaturedProjects(3)

  return (
    <div className="container">
      <div className="home-container">
        <section className="intro-section">
          <h1>Art collective by Markus and Francisco Schork</h1>
          <p>
            Exploring the intersection of art, design, and technology through collaborative and individual projects.
          </p>
        </section>

        <section className="featured-section">
          <h2>Featured Projects</h2>
          <div className="projects-grid">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <Link href={`/projects/${project.slug.current}`} key={project._id} className="project-card">
                  <div className="project-image">
                    {project.coverImage ? (
                      <Image
                        src={getImageUrl(project.coverImage, { width: 600, height: 600 })}
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
              ))
            ) : (
              // Fallback for no featured projects
              <div className="no-projects">
                <p>No featured projects yet. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="view-all">
            <Link href="/projects">View all projects →</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
