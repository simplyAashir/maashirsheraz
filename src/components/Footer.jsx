import { Link } from "react-scroll";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const socials = [
  { Icon: FaGithub, href: "https://github.com/maashirsheraz", label: "GitHub" },
  {
    Icon: FaLinkedin,
    href: "https://www.linkedin.com/in/maashirsheraz",
    label: "LinkedIn",
  },
  { Icon: FaEnvelope, href: "mailto:aashirsheraz@gmail.com", label: "Email" },
];

function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-white/5 bg-[#0a0f1e] px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <Link
          to="home"
          smooth
          duration={500}
          offset={-64}
          className="text-lg font-bold text-[#6366f1] cursor-pointer"
          style={{ textShadow: "0 0 18px rgba(99,102,241,0.6)" }}
        >
          maashirsheraz
        </Link>

        <div className="flex gap-6 text-xl text-[#94a3b8]">
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
        </div>

        <p className="text-sm text-[#94a3b8] text-center">
          © {year} Muhammad Aashir Sheraz. Built with React & Tailwind.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
