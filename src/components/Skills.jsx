import { useState } from "react";
import { motion } from "framer-motion";
import { skillCategories } from "../data/skills";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const pillVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

function Skills() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div>
      {/* Title */}
      <h2 className="text-3xl font-bold text-white">Skills & Technologies</h2>
      <div className="mt-3 mb-10 h-1 w-16 rounded-full bg-[#6366f1]" />

      {/* Category Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {skillCategories.map(({ category, Icon, accent, skills }) => (
          <motion.div
            key={category}
            variants={cardVariant}
            onHoverStart={() => setHoveredCard(category)}
            onHoverEnd={() => setHoveredCard(null)}
            className={`group relative rounded-3xl p-6 overflow-hidden border transition-all duration-500 ease-out ${
              hoveredCard === category
                ? "scale-[1.03] border-opacity-50 shadow-lg"
                : hoveredCard !== null
                ? "opacity-40 scale-[0.97]"
                : "border-[#1e293b]"
            }`}
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderColor:
                hoveredCard === category ? accent : undefined,
              boxShadow:
                hoveredCard === category
                  ? `0 0 30px ${accent}25, 0 8px 32px rgba(0,0,0,0.3)`
                  : "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            {/* Background glow orb */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
              style={{ background: accent }}
            />

            {/* Category Header */}
            <div className="relative z-10 flex items-center gap-3 mb-5">
              <div
                className="p-2.5 rounded-xl transition-all duration-500"
                style={{
                  background: `${accent}15`,
                  color: accent,
                  boxShadow:
                    hoveredCard === category
                      ? `0 0 20px ${accent}30`
                      : "none",
                }}
              >
                <Icon className="text-xl" />
              </div>
              <h3
                className="font-semibold text-sm uppercase tracking-wider transition-colors duration-300"
                style={{
                  color: hoveredCard === category ? accent : "#94a3b8",
                }}
              >
                {category}
              </h3>
            </div>

            {/* Skill Pills */}
            <motion.div
              variants={{ show: { transition: { staggerChildren: 0.04 } } }}
              className="relative z-10 flex flex-wrap gap-2.5"
            >
              {skills.map((skill) => (
                <motion.span
                  key={skill.name}
                  variants={pillVariant}
                  whileHover={{
                    scale: 1.08,
                    transition: { duration: 0.2 },
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium cursor-default transition-all duration-300"
                  style={{
                    background: `${skill.color}12`,
                    border: `1px solid ${skill.color}30`,
                    color: "#e2e8f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${skill.color}90`;
                    e.currentTarget.style.boxShadow = `0 0 15px ${skill.color}25`;
                    e.currentTarget.style.color = skill.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${skill.color}30`;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.color = "#e2e8f0";
                  }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </motion.div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
              style={{
                background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Skills;
