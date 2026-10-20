import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

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
          © 2026 maashirsheraz. All rights reserved.
        </p>
        <a href="/admin" className="inline-block mt-4 text-xs text-[#94a3b8] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Owner sign-in</a>
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
