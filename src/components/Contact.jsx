import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiMail, FiMapPin, FiSend } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus({ state: "error", msg: "Please fill in all fields." });
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus({
        state: "error",
        msg: "Email service isn't configured yet. Reach me directly at aashirsheraz@gmail.com.",
      });
      return;
    }

    try {
      setStatus({ state: "sending", msg: "" });
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        { publicKey: PUBLIC_KEY }
      );
      setStatus({ state: "success", msg: "Thanks! Your message has been sent." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus({
        state: "error",
        msg: "Something went wrong. Please try again later.",
      });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0a0f1e] px-4 py-3 text-[#f1f5f9] placeholder-[#94a3b8]/60 outline-none transition focus:border-[#6366f1]";

  return (
    <section id="contact" className="py-24 px-6 bg-[#0a0f1e]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        className="max-w-5xl mx-auto"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-white text-center"
        >
          Get In <span className="text-[#6366f1]">Touch</span>
        </motion.h2>
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#6366f1]"
        />
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 mb-12 max-w-2xl text-center text-[#94a3b8]"
        >
          Have an opportunity, a question, or just want to say hi? My inbox is always
          open.
        </motion.p>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Info */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <a
              href="mailto:aashirsheraz@gmail.com"
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#1e293b] p-5 transition-colors hover:border-[#6366f1]/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                <FiMail className="text-xl" />
              </span>
              <span>
                <span className="block text-sm text-[#94a3b8]">Email</span>
                <span className="text-[#f1f5f9]">aashirsheraz@gmail.com</span>
              </span>
            </a>

            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#1e293b] p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                <FiMapPin className="text-xl" />
              </span>
              <span>
                <span className="block text-sm text-[#94a3b8]">Location</span>
                <span className="text-[#f1f5f9]">Islamabad, Pakistan</span>
              </span>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/maashirsheraz"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/5 bg-[#1e293b] text-xl text-[#94a3b8] transition-colors hover:text-[#6366f1] hover:border-[#6366f1]/40"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/maashirsheraz"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/5 bg-[#1e293b] text-xl text-[#94a3b8] transition-colors hover:text-[#6366f1] hover:border-[#6366f1]/40"
              >
                <FaLinkedin />
              </a>
            </div>
          </motion.div>

          {/* Message fields (no <form> tag per project rules) */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={update("name")}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={update("email")}
              className={inputClass}
            />
            <textarea
              rows={5}
              placeholder="Your message"
              value={form.message}
              onChange={update("message")}
              className={`${inputClass} resize-none`}
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={status.state === "sending"}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#6366f1] px-6 py-3 font-semibold text-white transition hover:bg-[#818cf8] disabled:opacity-60"
            >
              <FiSend />
              {status.state === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status.msg && (
              <p
                className={`text-sm ${
                  status.state === "success"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {status.msg}
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default Contact;
