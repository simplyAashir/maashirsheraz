import { motion } from "framer-motion";
import { skills } from "../data/skills";

const pill = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

function Skills() {
  return (
    <div>
      {/* Title */}
      <h2 className="text-3xl font-bold text-white">Skills &amp; Technologies</h2>
      <div className="mt-3 mb-16 h-1 w-16 rounded-full bg-[#6366f1]" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(skills).map(([group, items]) => (
          <motion.div
            key={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            <h3 className="text-[#6366f1] font-semibold text-sm uppercase tracking-wider mb-3">
              {group}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <motion.span
                  key={item}
                  variants={pill}
                  className="bg-[#0a0f1e] border border-[#6366f1]/30 text-[#f1f5f9] rounded-full px-4 py-1.5 text-sm hover:border-[#6366f1] transition"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Skills;
