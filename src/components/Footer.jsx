import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";

const socials = [
  { Icon: FaGithub, href: "https://github.com/maashirsheraz", label: "GitHub" },
  {
    Icon: FaLinkedin,
    href: "https://www.linkedin.com/in/maashirsheraz",
    label: "LinkedIn",
  },
  { Icon: FaEnvelope, href: "mailto:maashirsheraz@gmail.com", label: "Email" },
];

function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer className="bg-[#0a0f1e] border-t border-[#1e293b] py-8 px-6 text-center">
        <p className="text-[#94a3b8] text-sm">
          Designed &amp; Built by Muhammad Aashir Sheraz
        </p>
        <p className="text-[#94a3b8] text-xs mt-1">
          © 2025 maashirsheraz. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-4 text-xl text-[#94a3b8]">
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
      </footer>

      {/* Back to top */}
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 bg-[#6366f1] hover:bg-[#818cf8] p-3 rounded-full shadow-lg transition"
        >
          <FiArrowUp className="text-white text-xl" />
        </button>
      )}
    </>
  );
}

export default Footer;
