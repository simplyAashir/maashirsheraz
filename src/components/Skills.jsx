import { motion } from "framer-motion";
import { skillGroups } from "../data/skills";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-[#0f172a]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        className="max-w-5xl mx-auto"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          Skills & <span className="text-[#6366f1]">Tools</span>
        </motion.h2>
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-3 mb-12 h-1 w-16 rounded-full bg-[#6366f1]"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <motion.div
              key={group.category}
              variants={fadeUp}
              className="rounded-2xl border border-white/5 bg-[#1e293b] p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-5">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map(({ name, icon: Icon }) => (
                  <div
                    key={name}
                    className="group flex items-center gap-2 rounded-lg border border-white/5 bg-[#0a0f1e] px-3 py-2 transition-colors hover:border-[#6366f1]/40"
                  >
                    <Icon className="text-lg text-[#94a3b8] transition-colors group-hover:text-[#6366f1]" />
                    <span className="text-sm text-[#f1f5f9]">{name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Skills;
