import { motion } from "framer-motion";
import { FiBookOpen } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const timeline = [
  {
    period: "2022 — 2026 (Expected)",
    title: "BS Computer Science",
    org: "FAST-NUCES, Islamabad",
    detail:
      "Coursework in Data Structures, Algorithms, Operating Systems, Databases, Computer Networks, and Software Engineering. Active in the university's computing society.",
  },
  {
    period: "2020 — 2022",
    title: "Pre-Engineering (Intermediate)",
    org: "Higher Secondary School",
    detail:
      "Built a strong foundation in mathematics and physics, which sparked my interest in computing and logical problem-solving.",
  },
];

function Education() {
  return (
    <section id="education" className="py-24 px-6 bg-[#0f172a]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        className="max-w-4xl mx-auto"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          <span className="text-[#6366f1]">Education</span>
        </motion.h2>
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-3 mb-12 h-1 w-16 rounded-full bg-[#6366f1]"
        />

        <div className="relative border-l border-[#6366f1]/30 ml-3 md:ml-6">
          {timeline.map((entry) => (
            <motion.div
              key={entry.title}
              variants={fadeUp}
              className="relative pl-8 md:pl-10 pb-10 last:pb-0"
            >
              <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#6366f1] ring-4 ring-[#0f172a]">
                <FiBookOpen className="text-[8px] text-white" />
              </span>
              <div className="rounded-xl border border-white/5 bg-[#1e293b] p-6">
                <p className="text-sm text-[#6366f1] font-medium">{entry.period}</p>
                <h3 className="text-xl font-semibold text-white mt-1">{entry.title}</h3>
                <p className="text-[#94a3b8] font-medium">{entry.org}</p>
                <p className="text-[#94a3b8] mt-3 leading-relaxed">{entry.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Education;
