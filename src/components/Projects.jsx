import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiCheck } from "react-icons/fi";
import initialContent from "../../content/projects.json";

const cardContentVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function Projects() {
  const [projects, setProjects] = useState(initialContent.projects);
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/projects', {signal: controller.signal}).then(response => {
      if (!response.ok) throw new Error('Projects unavailable');
      return response.json();
    }).then(data => { if (Array.isArray(data.projects)) setProjects(data.projects); }).catch(() => {});
    return () => controller.abort();
  }, []);
  const activeProject = projects[Math.min(activeIdx, projects.length - 1)];
  if (!activeProject) return <div><h2 className="text-3xl font-bold text-white">Projects & Work</h2><p className="mt-6 text-[#94a3b8]">New projects will appear here.</p></div>;

  return (
    <div>
      {/* Title */}
      <h2 className="text-3xl font-bold text-white">Projects & Work</h2>
      <div className="mt-3 mb-10 h-1 w-16 rounded-full bg-[#6366f1]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs (Borderless list with sliding bar) */}
        <div className="lg:col-span-4 flex overflow-x-auto lg:overflow-x-visible lg:flex-col pb-4 lg:pb-0 scrollbar-none snap-x border-b border-[#1e293b]/40 lg:border-b-0 lg:border-l lg:border-[#1e293b]/60 gap-1">
          {projects.map((project, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={project.title}
                onClick={() => setActiveIdx(idx)}
                className={`group relative snap-center shrink-0 text-left py-3.5 px-4 lg:pl-6 transition-all duration-300 font-medium text-sm flex items-center justify-between gap-4 cursor-pointer outline-none border-b border-[#1e293b]/10 lg:border-b-0 ${
                  isActive ? "text-white font-semibold" : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeProjectBar"
                    className="absolute left-0 bottom-0 lg:bottom-auto lg:top-0 w-full h-[2px] lg:w-[2px] lg:h-full bg-[#6366f1] shadow-[0_0_8px_#6366f1] pointer-events-none"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center gap-3.5 truncate">
                  <span
                    className={`text-[11px] font-mono transition-colors duration-300 ${
                      isActive ? "text-[#6366f1]" : "text-[#475569] group-hover:text-[#6366f1]"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="truncate">{project.title}</span>
                </div>
                
                <span
                  className={`relative z-10 text-[10px] tracking-wider px-2 py-0.5 rounded-md font-mono transition-all duration-300 ${
                    isActive
                      ? "bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/25"
                      : "bg-slate-900/60 text-[#475569] border border-transparent"
                  }`}
                >
                  {project.year}
                </span>
              </button>
            );
          })}
        </div>

        {/* Showcase Detail Card */}
        <div className="lg:col-span-8">
          <div
            className="relative rounded-3xl p-6 md:p-8 overflow-hidden border border-[#1e293b] min-h-[420px] transition-colors duration-300 hover:border-[#6366f1]/30"
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Background glowing orb */}
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] opacity-15 pointer-events-none"
              style={{ background: "#6366f1" }}
            />

            <motion.div
              key={activeIdx}
              initial="hidden"
              animate="show"
              variants={cardContentVariants}
              className="h-full flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <motion.div
                  variants={childVariants}
                  className="flex flex-wrap items-center justify-between gap-4 mb-4"
                >
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {activeProject.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    {activeProject.github && (
                      <motion.a
                        href={activeProject.github}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-[#1e293b] hover:border-[#6366f1]/40 text-[#94a3b8] hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 text-xs font-semibold cursor-pointer"
                      >
                        <FiGithub className="text-sm" />
                        <span>Code</span>
                      </motion.a>
                    )}
                    {activeProject.demo && (
                      <motion.a
                        href={activeProject.demo}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-[#1e293b] hover:border-[#6366f1]/40 text-[#94a3b8] hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 text-xs font-semibold cursor-pointer"
                      >
                        <FiExternalLink className="text-sm" />
                        <span>Demo</span>
                      </motion.a>
                    )}
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div variants={childVariants} className="flex flex-wrap gap-2 mb-6">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#0a0f1e]/80 border border-[#6366f1]/30 rounded-xl px-3 py-1 text-xs text-[#818cf8] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* Features checklist */}
                <div className="space-y-4 mb-4">
                  {activeProject.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      variants={childVariants}
                      className="flex items-start gap-3.5 text-sm text-[#94a3b8]"
                    >
                      <div className="p-1 rounded-lg bg-[#6366f1]/10 text-[#6366f1] mt-0.5 shrink-0">
                        <FiCheck className="text-xs stroke-[3]" />
                      </div>
                      <span className="leading-relaxed text-[#e2e8f0] font-medium">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
