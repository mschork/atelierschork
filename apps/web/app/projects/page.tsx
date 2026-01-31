import Image from "next/image"
import Link from "next/link"
import { getAllProjects } from "@/lib/sanity.queries"
import { getImageUrl } from "@/lib/sanity.client"
import "./projects.css"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="container">
      <div className="projects-container">
        <section className="projects-intro">
          <h1>Projects</h1>
          <p>A collection of works exploring various mediums and concepts.</p>
        </section>

        <section className="projects-list">
          {projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((project) => (
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
                    <p>
                      {project.startDate && new Date(project.startDate).getFullYear()}
                      {project.status && ` · ${project.status}`}
                    </p>
                    {project.creators && project.creators.length > 0 && (
                      <p className="collaborators">
                        {project.creators.map((creator) =>
                          `${creator.firstName} ${creator.lastName}`
                        ).join(", ")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <p>No projects available yet. Check back soon!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
