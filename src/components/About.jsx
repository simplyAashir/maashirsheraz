import { motion } from "framer-motion";
import { FiCpu, FiGlobe } from "react-icons/fi";

const stats = [
  { Icon: FiCpu, label: "AI Intern @ MFSYS Technologies" },
  { Icon: FiGlobe, label: "Available for Remote Work" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title */}
      <h2 className="text-3xl font-bold text-white">About Me</h2>
      <div className="mt-3 mb-16 h-1 w-16 rounded-full bg-[#6366f1]" />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT: photo (first on mobile) */}
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
          <img
            src="/profile.jpg"
            loading="lazy"
            alt="Muhammad Aashir Sheraz"
            className="w-full max-w-sm mx-auto rounded-2xl border-2 border-[#6366f1]/30"
            style={{ boxShadow: "0 0 40px rgba(99,102,241,0.15)" }}
          />
        </motion.div>

        {/* RIGHT: text */}
        <div>
          <p className="text-[#94a3b8] leading-relaxed">
            A Computer Science student at FAST-NUCES Islamabad with hands-on experience across AI, full-stack web development, game development (C++ and Unity), and low-level systems programming. Currently interning in AI at MFSYS Technologies, building real-world exposure to how intelligent systems are designed and deployed.
          </p>

          {/* Stats / Bullets */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-2 mt-8"
          >
            {stats.map(({ Icon, label }) => (
              <motion.div
                key={label}
                variants={item}
                className="group flex items-center gap-5 py-2 cursor-default"
              >
                {/* Smooth Icon Container */}
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#1e293b]/30 text-[#94a3b8] group-hover:text-[#6366f1] group-hover:bg-[#6366f1]/10 transition-all duration-500 ease-out">
                  <Icon className="text-xl relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  {/* Subtle glow behind icon on hover */}
                  <div className="absolute inset-0 rounded-full bg-[#6366f1] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500" />
                </div>

                {/* Text */}
                <span className="text-[#94a3b8] group-hover:text-[#f1f5f9] group-hover:translate-x-3 transition-all duration-500 ease-out text-base font-medium">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Download CV */}
          <a
            href="/resume.pdf"
            download
            className="border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 px-6 py-2.5 rounded-xl font-semibold mt-8 inline-block transition"
          >
            Download CV
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default About;
