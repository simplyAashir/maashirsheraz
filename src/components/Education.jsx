import { useState } from "react";
import { motion } from "framer-motion";

const educations = [
  {
    id: "bs",
    degree: "BS Computer Science",
    institution: "FAST-NUCES, Islamabad",
    duration: "2023 – 2027 (Expected)",
    percent: null,
    isPrimary: true,
  },
  {
    id: "fsc",
    degree: "FSc Pre-Engineering",
    institution: "Superior College Bhera",
    duration: "2021 – 2023",
    percent: "82.1%",
    isPrimary: false,
  },
  {
    id: "matric",
    degree: "Matric (Computer Science)",
    institution: "Govt. A.I Model High School",
    duration: "2019 – 2021",
    percent: "98.5%",
    isPrimary: false,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariantLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const cardVariantRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function Education() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12"
    >
      {/* Title */}
      <h2 className="text-3xl font-bold text-white">Education</h2>
      <div className="mt-3 mb-10 h-1 w-16 rounded-full bg-[#6366f1]" />

      {/* Bento Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative"
      >
        {/* LEFT HUGE HERO CARD (Spans 7 columns on LG) */}
        <motion.div
          variants={cardVariantLeft}
          onHoverStart={() => setHoveredId("bs")}
          onHoverEnd={() => setHoveredId(null)}
          className={`lg:col-span-7 relative bg-[#0f172a] rounded-3xl p-8 md:p-12 overflow-hidden border border-[#1e293b] transition-all duration-500 ease-out z-10 flex flex-col ${
            hoveredId === "bs"
              ? "scale-[1.02] border-[#6366f1]/50 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
              : hoveredId !== null
              ? "opacity-40 scale-[0.98]"
              : ""
          }`}
        >
          {/* Animated Background Blob */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#6366f1]/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          
          <div className="relative z-10 flex-1 flex flex-col justify-center items-start">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6366f1]/10 text-[#818cf8] text-sm font-semibold mb-5 border border-[#6366f1]/20">
              Current Focus
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
              BS Computer Science
            </h3>
          </div>
          
          <div className="relative z-10 mt-10 pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold text-lg">FAST-NUCES, Islamabad</p>
              <p className="text-[#6366f1] mt-1">2023 – 2027 (Expected)</p>
            </div>
            {/* Optional abstract icon or mini visual */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
              <span className="text-white text-xl font-bold">{"</>"}</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN STACK (Spans 5 columns on LG) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {educations.slice(1).map((edu) => (
            <motion.div
              key={edu.id}
              variants={cardVariantRight}
              onHoverStart={() => setHoveredId(edu.id)}
              onHoverEnd={() => setHoveredId(null)}
              className={`group relative bg-[#0f172a] rounded-3xl p-6 md:p-8 flex-1 flex flex-col justify-center border border-[#1e293b] transition-all duration-500 ease-out z-10 overflow-hidden ${
                hoveredId === edu.id
                  ? "scale-[1.03] border-[#6366f1]/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                  : hoveredId !== null
                  ? "opacity-40 scale-[0.98]"
                  : ""
              }`}
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
              
              <div className="relative z-10 flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                    {edu.degree}
                  </h3>
                  <p className="text-[#94a3b8] mt-2">{edu.institution}</p>
                  <p className="text-[#6366f1] text-sm mt-1">{edu.duration}</p>
                </div>
                
                {edu.percent && (
                  <div className="shrink-0 flex items-center justify-center bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#818cf8] font-bold px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                    {edu.percent}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Education;
