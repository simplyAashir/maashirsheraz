import { Link } from "react-scroll";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const socials = [
  { Icon: FaGithub, href: "https://github.com/maashirsheraz", label: "GitHub" },
  {
    Icon: FaLinkedin,
    href: "https://www.linkedin.com/in/maashirsheraz",
    label: "LinkedIn",
  },
  { Icon: FaEnvelope, href: "mailto:aashirsheraz@gmail.com", label: "Email" },
];

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center text-center px-6"
      style={{
        background:
          "radial-gradient(circle at center, rgba(99,102,241,0.08), #0a0f1e 60%)",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Badge */}
        <motion.span
          variants={item}
          className="font-mono border border-[#6366f1]/50 rounded-full px-4 py-1 text-[#6366f1] text-sm"
        >
          {"< CS Student />"}
        </motion.span>

        {/* H1 */}
        <motion.h1
          variants={item}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mt-6"
        >
          Hi, I'm Muhammad Aashir Sheraz
        </motion.h1>

        {/* Type animation */}
        <motion.div
          variants={item}
          className="text-xl md:text-2xl text-[#6366f1] font-semibold mt-5 h-8"
        >
          <TypeAnimation
            sequence={[
              "Full Stack Developer",
              "",
              "CS Student @ FAST-NUCES",
              "",
              "Problem Solver",
              "",
              "Open Source Enthusiast",
              "",
            ]}
            speed={50}
            deletionSpeed={30}
            repeat={Infinity}
            cursor={true}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p variants={item} className="text-[#94a3b8] text-lg mt-4">
          Passionate about building clean, scalable software.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full sm:w-auto"
        >
          <Link
            to="projects"
            smooth
            duration={500}
            offset={-64}
            className="bg-[#6366f1] hover:bg-[#818cf8] text-white px-8 py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            View Projects
          </Link>
          <a
            href="/resume.pdf"
            download
            className="border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 px-8 py-3 rounded-xl font-semibold transition"
          >
            Download Resume
          </a>
        </motion.div>

        {/* Socials */}
        <motion.div
          variants={item}
          className="flex gap-6 justify-center mt-8 text-2xl text-[#94a3b8]"
        >
          {socials.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="hover:text-[#6366f1] transition"
            >
              <Icon />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Bouncing arrow */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10"
      >
        <Link to="about" smooth duration={500} offset={-64} className="cursor-pointer">
          <FiChevronDown className="text-[#6366f1] text-3xl" />
        </Link>
      </motion.div>
    </section>
  );
}

export default Hero;
