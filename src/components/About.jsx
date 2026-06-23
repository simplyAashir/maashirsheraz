import { motion } from "framer-motion";

const stats = [
  { emoji: "🎓", label: "FAST-NUCES" },
  { emoji: "📍", label: "Islamabad, Pakistan" },
  { emoji: "💼", label: "Open to Internships" },
  { emoji: "🌐", label: "Remote Available" },
];

function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto px-6 py-24"
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
            I'm a Computer Science student at FAST-NUCES driven by a deep passion for
            software engineering, systems design, and building products that solve real
            problems.
          </p>
          <p className="mt-4 text-[#94a3b8] leading-relaxed">
            Currently studying core CS subjects including Operating Systems, Database
            Systems, Software Engineering, Computer Architecture, and Compiler
            Construction. I focus on strong conceptual foundations first, followed by
            practical implementation.
          </p>

          {/* 2x2 stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-[#1e293b] rounded-xl p-3 text-sm text-[#f1f5f9]"
              >
                <span className="mr-2">{s.emoji}</span>
                {s.label}
              </div>
            ))}
          </div>

          {/* Download CV */}
          <a
            href="/resume.pdf"
            download
            className="border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 px-6 py-2.5 rounded-xl font-semibold mt-6 inline-block transition"
          >
            Download CV
          </a>
        </div>
      </div>
    </motion.section>
  );
}

export default About;
