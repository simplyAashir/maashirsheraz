import { motion } from "framer-motion";
import { FiFolder, FiGithub, FiExternalLink } from "react-icons/fi";
import { projects } from "../data/projects";

// Until real projects are added to src/data/projects.js, show placeholder cards.
const placeholders = [0, 1, 2];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function PlaceholderCard() {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="relative bg-[#1e293b] rounded-2xl p-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
    >
      {/* Coming Soon badge */}
      <span className="absolute top-4 right-4 bg-[#6366f1]/20 text-[#818cf8] text-xs rounded-full px-2 py-0.5">
        Coming Soon
      </span>

      {/* Top row */}
      <div className="flex items-center">
        <FiFolder className="text-[#6366f1] text-2xl flex-1" />
        <div className="flex items-center gap-3 text-[#94a3b8]">
          <FiGithub className="hover:text-[#6366f1] transition cursor-pointer" />
          <FiExternalLink className="hover:text-[#6366f1] transition cursor-pointer" />
        </div>
      </div>

      {/* Title + description */}
      <h3 className="text-lg font-bold text-white mt-4">Project Title</h3>
      <p className="text-[#94a3b8] text-sm mt-2 leading-relaxed">
        Description coming soon.
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {["React", "TypeScript"].map((tag) => (
          <span
            key={tag}
            className="bg-[#0a0f1e] border border-[#6366f1]/30 rounded-full px-3 py-1 text-xs text-[#94a3b8]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="relative bg-[#1e293b] rounded-2xl p-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
    >
      <div className="flex items-center">
        <FiFolder className="text-[#6366f1] text-2xl flex-1" />
        <div className="flex items-center gap-3 text-[#94a3b8]">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" aria-label="Code">
              <FiGithub className="hover:text-[#6366f1] transition" />
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" aria-label="Live demo">
              <FiExternalLink className="hover:text-[#6366f1] transition" />
            </a>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mt-4">{project.title}</h3>
      <p className="text-[#94a3b8] text-sm mt-2 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-[#0a0f1e] border border-[#6366f1]/30 rounded-full px-3 py-1 text-xs text-[#94a3b8]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function Projects() {
  const hasProjects = projects.length > 0;

  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-24">
      {/* Title */}
      <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
      <p className="text-[#94a3b8] mt-2">Things I've built</p>
      <div className="mt-3 mb-16 h-1 w-16 rounded-full bg-[#6366f1]" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {hasProjects
          ? projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))
          : placeholders.map((i) => <PlaceholderCard key={i} />)}
      </motion.div>
    </section>
  );
}

export default Projects;
