import { useState } from "react";
import { motion } from "framer-motion";
import { send } from "@emailjs/browser";
import { FiMail, FiMapPin } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const infoCards = [
  { Icon: FiMail, text: "maashirsheraz@gmail.com", href: "mailto:maashirsheraz@gmail.com" },
  { Icon: FaGithub, text: "github.com/maashirsheraz", href: "https://github.com/maashirsheraz" },
  {
    Icon: FaLinkedin,
    text: "linkedin.com/in/maashirsheraz",
    href: "https://www.linkedin.com/in/maashirsheraz",
  },
  { Icon: FiMapPin, text: "Islamabad, Pakistan", href: null },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass =
  "w-full bg-[#0a0f1e] border border-[#1e293b] focus:border-[#6366f1] rounded-xl px-4 py-3 text-[#f1f5f9] outline-none transition mb-4";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("sending");
      await send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: name, from_email: email, message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title */}
      <h2 className="text-3xl font-bold text-white">Let's Connect</h2>
      <p className="text-[#94a3b8] mt-3 mb-12">
        Currently open to internship opportunities and collaborations.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT — info cards */}
        <div className="flex flex-col gap-3">
          {infoCards.map(({ Icon, text, href }) => {
            const inner = (
              <>
                <Icon className="text-[#6366f1] text-xl flex-shrink-0" />
                <span className="text-[#94a3b8] text-sm break-all">{text}</span>
              </>
            );
            return href ? (
              <a
                key={text}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-4 bg-[#1e293b] rounded-xl p-4 transition-colors hover:bg-[#1e293b]/70"
              >
                {inner}
              </a>
            ) : (
              <div
                key={text}
                className="flex items-center gap-4 bg-[#1e293b] rounded-xl p-4"
              >
                {inner}
              </div>
            );
          })}
        </div>

        {/* RIGHT — form (no <form> tag) */}
        <div>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={update("name")}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
          />
          <textarea
            rows={5}
            placeholder="Message"
            value={form.message}
            onChange={update("message")}
            className={`${inputClass} resize-none`}
          />

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {status === "success" && (
            <div className="bg-green-500/10 text-green-400 rounded-xl px-4 py-3 mb-4 text-sm">
              ✓ Message sent!
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-500/10 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
              ✗ Failed to send. Try again.
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "sending"}
            className="w-full bg-[#6366f1] hover:bg-[#818cf8] text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;
