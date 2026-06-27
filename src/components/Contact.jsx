import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const socials = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/muhammad-aashir-sheraz",
    Icon: FaLinkedin,
    brandColor: "#0077b5",
  },
  {
    name: "GitHub",
    href: "https://github.com/simplyAashir",
    Icon: FaGithub,
    brandColor: "#f1f5f9",
  },
  {
    name: "Email",
    href: "mailto:aashirsheraz8@gmail.com",
    Icon: FiMail,
    brandColor: "#ea4335",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/simply_aashir",
    Icon: FaInstagram,
    brandColor: "#e1306c",
  },
];

const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center py-6"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Get In Touch</h2>
      <div className="mx-auto mt-2 mb-8 h-0.5 w-12 rounded-full bg-[#6366f1]" />

      {/* Social Dock */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center items-center gap-4"
      >
        {socials.map(({ name, href, Icon, brandColor }) => (
          <motion.a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            variants={itemVariant}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-[#1e293b] text-sm font-medium text-[#94a3b8] hover:text-white transition-all duration-300"
            style={{
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = brandColor + "50";
              e.currentTarget.style.boxShadow = `0 0 20px ${brandColor}20`;
              e.currentTarget.style.background = `linear-gradient(to bottom, ${brandColor}12, ${brandColor}05)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e293b";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.4)";
            }}
          >
            <Icon style={{ color: brandColor }} className="text-xl" />
            <span>{name}</span>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Contact;

