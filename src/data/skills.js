// Skills data — sourced from résumé. Each category maps to a glass card in the
// Skills section; each skill carries a technology-specific accent color used for
// its pill border / glow / text tint.
import { FiCode, FiLayout, FiServer, FiDatabase, FiTool, FiCpu } from "react-icons/fi";

export const skillCategories = [
  {
    category: "Languages",
    Icon: FiCode,
    accent: "#a78bfa",
    skills: [
      { name: "Java", color: "#EA2D2E" },
      { name: "C++", color: "#00599C" },
      { name: "x86 Assembly", color: "#8B95A5" },
      { name: "HTML", color: "#E34F26" },
      { name: "CSS", color: "#1572B6" },
    ],
  },
  {
    category: "Frontend",
    Icon: FiLayout,
    accent: "#60a5fa",
    skills: [
      { name: "JavaFX", color: "#5382A1" },
      { name: "SFML", color: "#8CC445" },
    ],
  },
  {
    category: "Backend",
    Icon: FiServer,
    accent: "#818cf8",
    skills: [
      { name: "PHP", color: "#777BB4" },
      { name: "XAMPP", color: "#FB7A24" },
    ],
  },
  {
    category: "Databases",
    Icon: FiDatabase,
    accent: "#c084fc",
    skills: [
      { name: "SQL Server", color: "#CC2927" },
      { name: "T-SQL", color: "#F89C1E" },
    ],
  },
  {
    category: "Tools & Platforms",
    Icon: FiTool,
    accent: "#38bdf8",
    skills: [
      { name: "IntelliJ IDEA", color: "#FE315D" },
      { name: "Visual Studio", color: "#9B6DD7" },
      { name: "Eclipse", color: "#2C2255" },
      { name: "Unity", color: "#C0C0C0" },
      { name: "draw.io", color: "#F08705" },
      { name: "Cisco Packet Tracer", color: "#1BA0D7" },
      { name: "Git", color: "#F05032" },
      { name: "GitHub", color: "#C9D1D9" },
      { name: "Wireshark", color: "#1679A7" },
    ],
  },
  {
    category: "CS Fundamentals",
    Icon: FiCpu,
    accent: "#a78bfa",
    skills: [
      { name: "OOP", color: "#a78bfa" },
      { name: "Data Structures & Algorithms", color: "#c084fc" },
      { name: "Operating Systems", color: "#818cf8" },
      { name: "Computer Networks", color: "#60a5fa" },
      { name: "Database Design", color: "#38bdf8" },
    ],
  },
];
