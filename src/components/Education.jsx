import { motion } from "framer-motion";

const coursework = [
  "Operating Systems",
  "Database Systems",
  "Software Engineering",
  "Computer Architecture",
  "Compiler Construction",
  "Probability & Statistics",
  "Data Structures",
  "Algorithms",
];

function Education() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title */}
      <h2 className="text-3xl font-bold text-white">Education</h2>
      <div className="mt-3 mb-16 h-1 w-16 rounded-full bg-[#6366f1]" />

      {/* Timeline */}
      <div className="relative pl-8 border-l-2 border-[#6366f1]/30">
        <div className="relative">
          {/* Dot */}
          <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-[#6366f1]" />

          {/* Card */}
          <div className="bg-[#1e293b] rounded-xl p-6 border-l-4 border-[#6366f1] ml-4">
            <h3 className="text-xl font-bold text-white">BS Computer Science</h3>
            <p className="text-[#6366f1] font-medium mt-1">FAST-NUCES, Islamabad</p>
            <p className="text-[#94a3b8] text-sm mt-1">2023 – 2027 (Expected)</p>

            <p className="text-[#94a3b8] text-sm mt-3">
              <span className="text-[#f1f5f9] font-medium">Relevant Coursework:</span>{" "}
              {coursework.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Education;
