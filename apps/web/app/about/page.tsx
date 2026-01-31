import Image from "next/image"
import "./about.css"

export default function AboutPage() {
  return (
    <div className="container">
      <div className="about-container">
        <section className="about-intro">
          <h1>About</h1>
          <p>
            Atelierschork is an art collective founded by Markus and Francisco Schork, dedicated to exploring the
            intersection of art, design, and technology.
          </p>
        </section>

        <section className="about-approach">
          <div className="approach-text">
            <h2>Our Approach</h2>
            <p>
              Our practice is guided by principles of clarity, functionality, and thoughtful minimalism. We believe in
              the power of reduction—removing the unnecessary to emphasize what remains.
            </p>
            <p>
              Drawing inspiration from Bauhaus principles and the design philosophy of Dieter Rams, we create works that
              balance form and function, aesthetics and purpose. Our collaborative process allows us to combine
              different perspectives and skills, resulting in projects that span multiple disciplines.
            </p>
          </div>

          <div className="approach-image">
            <Image
              src="/placeholder.svg?height=800&width=800&text=Studio"
              alt="Atelierschork studio"
              fill
              className="image"
            />
          </div>
        </section>

        <section className="about-studio">
          <h2>Studio</h2>
          <p>
            Our studio serves as both a workspace and a laboratory for experimentation. Located in a converted
            industrial space, it provides us with the room to work across different media and scales—from small objects
            to large installations.
          </p>
          <div className="studio-images">
            {[1, 2, 3].map((i) => (
              <div key={i} className="studio-image">
                <Image
                  src={`/placeholder.svg?height=600&width=600&text=Studio ${i}`}
                  alt={`Studio image ${i}`}
                  fill
                  className="image"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="about-contact">
          <h2>Contact</h2>
          <div className="contact-info">
            <div className="contact-text">
              <p>
                For inquiries about our work, collaboration opportunities, or any other questions, please feel free to
                get in touch.
              </p>
              <div className="contact-details">
                <p>Email: info@atelierschork.com</p>
                <p>Instagram: @atelierschork</p>
              </div>
            </div>
            <div className="contact-address">
              <p>
                Atelierschork
                <br />
                Example Street 123
                <br />
                10115 Berlin
                <br />
                Germany
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
