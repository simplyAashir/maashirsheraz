import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiStar } from "react-icons/fi";
import { projects } from "../data/projects";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function ProjectCard({ project }) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="group flex flex-col rounded-2xl border border-white/5 bg-[#1e293b] p-6 transition-colors hover:border-[#6366f1]/40"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        {project.featured && (
          <span className="flex items-center gap-1 rounded-full bg-[#6366f1]/10 px-2 py-1 text-xs text-[#6366f1]">
            <FiStar className="text-[10px]" /> Featured
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-[#94a3b8] leading-relaxed">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[#0a0f1e] px-2.5 py-1 text-xs text-[#94a3b8] border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-5 text-sm">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[#94a3b8] hover:text-[#6366f1] transition"
          >
            <FiGithub /> Code
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[#94a3b8] hover:text-[#6366f1] transition"
          >
            <FiExternalLink /> Live Demo
          </a>
        )}
      </div>
    </motion.article>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-[#0a0f1e]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          Featured <span className="text-[#6366f1]">Projects</span>
        </motion.h2>
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#6366f1]"
        />
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 mb-12 max-w-2xl text-center text-[#94a3b8]"
        >
          A selection of things I've built — from full-stack apps to developer tools.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Projects;
