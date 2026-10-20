import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiArrowUp,
  FiMenu,
  FiX,
  FiDownload,
  FiMail,
} from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./portfolio.css";
const External = ({ href, children, ...props }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
      <FiArrowUpRight aria-hidden="true" />
    </a>
  ) : null;
function Project({ project, index }) {
  return (
    <article
      className={`project-entry ${project.image ? "has-preview" : ""}`}
      id={`project-${project.id}`}
    >
      {project.image && (
        <a
          className="project-preview"
          href={project.image}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} screenshot`}
        >
          <img
            src={project.image}
            alt={project.imageAlt || `${project.title} screenshot`}
            loading="lazy"
            width="1100"
            height="720"
          />
        </a>
      )}
      <div className="project-copy">
        <div className="project-meta">
          <span>{project.year}</span>
          <span>{project.tags.slice(0, 3).join(" · ")}</span>
        </div>
        <h3>{project.title}</h3>
        {project.summary && <p>{project.summary}</p>}
        <div className="project-links">
          <External href={project.github}>
            <FaGithub aria-hidden="true" /> Repository
          </External>
          <External href={project.demo}>Website / demo</External>
          <External href={project.video}>Watch walkthrough</External>
        </div>
        <details open={index === 0 ? true : undefined}>
          <summary>Implementation details</summary>
          {project.role && (
            <p>
              <strong>My contribution:</strong> {project.role}
            </p>
          )}
          <ul>
            {project.features.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          {project.challenge && (
            <p>
              <strong>Technical challenge:</strong> {project.challenge}
            </p>
          )}
          {project.result && (
            <p>
              <strong>Result:</strong> {project.result}
            </p>
          )}
          <div className="tags" aria-label="Technologies">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </details>
      </div>
    </article>
  );
}
export default function PublicPortfolio({ site, projects }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);
  const sections = [
    ...(projects.length ? [["projects", "Projects"]] : []),
    ...(site.experience.length ? [["experience", "Experience"]] : []),
    ["about", "About"],
    ...(site.certifications.length ? [["certifications", "Credentials"]] : []),
    ["contact", "Contact"],
  ];
  return (
    <div className="portfolio">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-container header-inner">
          <a
            className="wordmark"
            href="#home"
            onClick={() => setMenuOpen(false)}
          >
            {site.profile.displayName}
            <span aria-hidden="true">.</span>
          </a>
          <button
            id="menu-toggle"
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
          <nav
            id="site-navigation"
            className={menuOpen ? "is-open" : ""}
            aria-label="Main navigation"
          >
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main id="main">
        <section id="home" className="site-container hero-section">
          <div className="hero-copy">
            <p className="hero-location">{site.profile.location}</p>
            <h1>{site.profile.name}</h1>
            <p className="hero-headline">{site.profile.headline}</p>
            <p className="hero-summary">{site.profile.summary}</p>
            <div className="hero-actions">
              {projects.length > 0 && (
                <a className="site-button primary" href="#projects">
                  Explore my work <FiArrowUpRight aria-hidden="true" />
                </a>
              )}
              {site.profile.resume && (
                <a
                  className="site-button"
                  href={site.profile.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  View résumé <FiDownload aria-hidden="true" />
                </a>
              )}
            </div>
            <p className="availability">{site.profile.availability}</p>
          </div>
          {site.profile.photo && (
            <figure className="hero-portrait">
              <img
                src={site.profile.photo}
                alt={site.profile.name}
                width="384"
                height="450"
                fetchPriority="high"
              />
              <figcaption>{site.profile.displayName}</figcaption>
            </figure>
          )}
        </section>
        {projects.length > 0 && (
          <section id="projects" className="site-container content-section">
            <div className="section-heading">
              <h2>{site.sections.projects}</h2>
              <span>{projects.length} projects</span>
            </div>
            <div className="project-list">
              {projects.map((project, index) => (
                <Project key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        )}
        {site.experience.length > 0 && (
          <section id="experience" className="site-container content-section">
            <h2>{site.sections.experience}</h2>
            <div className="experience-list">
              {site.experience.map((item) => (
                <article className="experience-entry" key={item.id}>
                  <div>
                    <p className="item-date">{item.dates}</p>
                    <h3>{item.title}</h3>
                    <p className="organization">{item.organization}</p>
                  </div>
                  <div>
                    <p>{item.summary}</p>
                    {item.highlights.length > 0 && (
                      <ul>
                        {item.highlights.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    )}
                    <div className="tags">
                      {item.technologies.map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                    </div>
                    <External href={item.certificate} className="text-link">
                      View internship certificate
                    </External>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        <section
          id="about"
          className="site-container content-section about-section"
        >
          <div>
            <h2>{site.sections.about}</h2>
            <p className="about-name">{site.profile.displayName}</p>
          </div>
          <div className="about-copy">
            {site.profile.about
              .split("\n")
              .filter(Boolean)
              .map((text, i) => (
                <p key={i}>{text}</p>
              ))}
          </div>
        </section>
        {site.skills.length > 0 && (
          <section id="skills" className="site-container content-section">
            <h2>{site.sections.skills}</h2>
            <div className="skill-list">
              {site.skills.map((item) => (
                <article key={item.id} className="skill-group">
                  <div>
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  <ul>
                    {item.items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}
        {site.certifications.length > 0 && (
          <section
            id="certifications"
            className="site-container content-section"
          >
            <h2>{site.sections.certifications}</h2>
            <div className="credential-grid">
              {site.certifications.map((item) => (
                <article key={item.id} className="credential">
                  <div className="credential-preview">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={`${item.title} — ${item.issuer}`}
                        width="640"
                        height="400"
                        loading="lazy"
                      />
                    ) : (
                      <span>{item.issuer}</span>
                    )}
                  </div>
                  <div className="credential-copy">
                    <p className="credential-type">
                      {item.kind}
                      {item.date ? ` · ${item.date}` : ""}
                    </p>
                    <h3>{item.title}</h3>
                    <p className="credential-issuer">{item.issuer}</p>
                    {item.summary && <p>{item.summary}</p>}
                    <External
                      href={item.credential || item.image}
                      className="text-link"
                    >
                      View credential
                    </External>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {site.education.length > 0 && (
          <section id="education" className="site-container content-section">
            <h2>{site.sections.education}</h2>
            <div className="education-list">
              {site.education.map((item) => (
                <article key={item.id}>
                  <div>
                    <h3>{item.degree}</h3>
                    <p>{item.institution}</p>
                    {item.detail && (
                      <p className="education-detail">{item.detail}</p>
                    )}
                  </div>
                  <p className="item-date">{item.dates}</p>
                </article>
              ))}
            </div>
          </section>
        )}
        <section
          id="contact"
          className="site-container content-section contact-section"
        >
          <h2>{site.sections.contact}</h2>
          <p>{site.sections.contactText}</p>
          <a className="contact-email" href={`mailto:${site.contact.email}`}>
            <FiMail aria-hidden="true" />
            {site.contact.email}
          </a>
          <div className="contact-links">
            <External href={site.contact.github}>
              <FaGithub aria-hidden="true" /> GitHub
            </External>
            <External href={site.contact.linkedin}>
              <FaLinkedin aria-hidden="true" /> LinkedIn
            </External>
            <External href={site.contact.instagram}>Instagram</External>
          </div>
        </section>
      </main>
      <footer className="site-container site-footer">
        <div>
          <p>{site.footer.credit}</p>
          <p>{site.footer.copyright}</p>
        </div>
        <div>
          <a href="/admin">Owner sign-in</a>
          <a href="#home" aria-label="Back to top">
            <FiArrowUp aria-hidden="true" />
            Top
          </a>
        </div>
      </footer>
    </div>
  );
}
