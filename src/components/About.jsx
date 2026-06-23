import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stats = [
  { value: "5+", label: "Projects Built" },
  { value: "3+", label: "Years Coding" },
  { value: "10+", label: "Technologies" },
];

function About() {
  return (
    <section id="about" className="py-24 px-6 bg-[#0a0f1e]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        className="max-w-5xl mx-auto"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          About <span className="text-[#6366f1]">Me</span>
        </motion.h2>
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-3 mb-12 h-1 w-16 rounded-full bg-[#6366f1]"
        />

        <div className="grid md:grid-cols-5 gap-10 items-center">
          {/* Avatar */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-2 flex justify-center"
          >
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-2xl blur-2xl"
                style={{ background: "rgba(99,102,241,0.15)" }}
              />
              <img
                src="/profile.jpg"
                alt="Muhammad Aashir Sheraz"
                className="relative w-56 h-56 object-cover rounded-2xl border border-[#6366f1]/30 bg-[#1e293b]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </motion.div>

          {/* Text */}
          <div className="md:col-span-3">
            <motion.p variants={fadeUp} className="text-[#94a3b8] text-lg leading-relaxed">
              I'm a Computer Science student at{" "}
              <span className="text-[#f1f5f9] font-medium">FAST-NUCES, Islamabad</span>,
              with a deep interest in full-stack development and software engineering. I
              love turning ideas into clean, reliable products and learning the
              fundamentals that make great software.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-[#94a3b8] text-lg leading-relaxed mt-4"
            >
              When I'm not in class, you'll find me building side projects, exploring
              open-source codebases, and sharpening my problem-solving on competitive
              programming platforms.
            </motion.p>

            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mt-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/5 bg-[#1e293b] px-4 py-5 text-center"
                >
                  <div className="text-2xl font-bold text-[#6366f1]">{s.value}</div>
                  <div className="text-xs text-[#94a3b8] mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default About;
