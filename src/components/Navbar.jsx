import { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { to: "home", label: "Home" },
  { to: "about", label: "About" },
  { to: "education", label: "Education" },
  { to: "projects", label: "Projects" },
  { to: "skills", label: "Skills" },
  { to: "contact", label: "Contact" },
];

const linkProps = {
  spy: true,
  smooth: true,
  duration: 500,
  offset: -64,
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0f1e]/90 backdrop-blur border-b border-[#6366f1]/15"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-center relative">
        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                {...linkProps}
                activeClass="text-[#f1f5f9] after:scale-x-100"
                className="relative cursor-pointer text-[#94a3b8] hover:text-[#f1f5f9] transition-colors text-sm font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#6366f1] after:scale-x-0 after:origin-left after:transition-transform after:duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden absolute right-6 text-2xl text-[#f1f5f9]"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[#0a0f1e]/95 backdrop-blur border-b border-[#6366f1]/15"
          >
            {navLinks.map((link) => (
              <li key={link.to} className="border-t border-white/5 first:border-t-0">
                <Link
                  to={link.to}
                  {...linkProps}
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-4 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
