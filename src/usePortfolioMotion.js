import { useEffect } from "react";
// Content is visible by default. Motion only enhances elements as they arrive.
export default function usePortfolioMotion() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      typeof Element.prototype.animate !== "function"
    )
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set();
    let keyboard = false;
    const onKey = () => {
        keyboard = true;
      },
      onPointer = () => {
        keyboard = false;
      };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches || keyboard || document.hidden) continue;
          const animation = entry.target.animate(
            [
              { transform: "translateY(14px)", opacity: 0.65 },
              { transform: "translateY(0)", opacity: 1 },
            ],
            { duration: 560, easing: "cubic-bezier(0.23,1,0.32,1)" },
          );
          animations.add(animation);
          animation.finished
            .catch(() => {})
            .finally(() => animations.delete(animation));
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    document
      .querySelectorAll(
        ".portfolio .project-entry,.portfolio .experience-entry,.portfolio .credential,.portfolio .skill-group",
      )
      .forEach((element) => observer.observe(element));
    const changed = () => {
      if (preference.matches)
        for (const animation of animations) animation.cancel();
    };
    preference.addEventListener("change", changed);
    return () => {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
      preference.removeEventListener("change", changed);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);
}
