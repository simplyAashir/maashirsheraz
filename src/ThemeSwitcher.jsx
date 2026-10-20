import { useEffect, useId, useRef, useState } from "react";
import { FiMoon, FiSun, FiDroplet, FiFeather, FiCheck } from "react-icons/fi";
import "./theme.css";
const THEMES = [
  { id: "dark", label: "Dark", color: "#171715", Icon: FiMoon },
  { id: "light", label: "Light", color: "#fafafa", Icon: FiSun },
  { id: "blue", label: "Blue", color: "#1b58ae", Icon: FiDroplet },
  { id: "green", label: "Green", color: "#28653d", Icon: FiFeather },
];
const valid = (value) => THEMES.some((t) => t.id === value);
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark"),
    [open, setOpen] = useState(false);
  const root = useRef(null),
    trigger = useRef(null),
    panelId = useId();
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(valid(current) ? current : "dark");
    const sync = (event) => {
      if (event.key !== "portfolio-theme") return;
      const next = valid(event.newValue) ? event.newValue : "dark";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!open) return;
    const pointer = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    const key = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  function choose(next) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Themes still work when storage is disabled. */
    }
    setOpen(false);
    trigger.current?.focus();
  }
  const current = THEMES.find((t) => t.id === theme),
    Icon = current.Icon;
  return (
    <div
      className="theme-picker"
      ref={root}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="theme-trigger"
        title="Change color theme"
        ref={trigger}
        type="button"
        aria-label={`Choose color theme, current ${current.label}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <Icon aria-hidden="true" />
        <span className="theme-current">{current.label}</span>
      </button>
      {open && (
        <div
          className="theme-panel"
          id={panelId}
          role="group"
          aria-label="Color theme"
        >
          <p>Choose your palette</p>
          {THEMES.map((item) => (
            <button
              className="theme-option"
              type="button"
              key={item.id}
              aria-pressed={theme === item.id}
              onClick={() => choose(item.id)}
            >
              <span
                className="theme-swatch"
                style={{ background: item.color }}
                aria-hidden="true"
              />
              {item.label}
              {theme === item.id && <FiCheck aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
      <span className="theme-status" role="status" aria-live="polite">
        {current.label} theme selected
      </span>
    </div>
  );
}
