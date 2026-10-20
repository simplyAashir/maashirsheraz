// Shared field definitions keep the owner editor and server validation in sync.
const f = (key, label, type = "text", max = 240, required = false) => ({
  key,
  label,
  type,
  max,
  required,
});
export const groups = {
  profile: {
    label: "Introduction & About",
    fields: [
      f("name", "Full name", "text", 100, true),
      f("displayName", "Short name", "text", 60, true),
      f("headline", "Professional focus", "text", 160, true),
      f("summary", "Introduction", "textarea", 600, true),
      f("about", "About you", "textarea", 2000, true),
      f("location", "Location", "text", 120),
      f("availability", "Opportunities you are seeking", "text", 160),
      f("photo", "Profile photo", "image"),
      f("resume", "Résumé", "document"),
    ],
  },
  sections: {
    label: "Section headings",
    fields: [
      f("projects", "Projects heading", "text", 100, true),
      f("experience", "Experience heading", "text", 100, true),
      f("about", "About heading", "text", 100, true),
      f("skills", "Skills heading", "text", 100, true),
      f("education", "Education heading", "text", 100, true),
      f("certifications", "Credentials heading", "text", 100, true),
      f("contact", "Contact heading", "text", 100, true),
      f("contactText", "Contact introduction", "textarea", 500),
    ],
  },
  contact: {
    label: "Contact & social links",
    fields: [
      f("email", "Public email", "email", 254, true),
      f("github", "GitHub", "url"),
      f("linkedin", "LinkedIn", "url"),
      f("instagram", "Instagram (optional)", "url"),
    ],
  },
  seo: {
    label: "Search & sharing",
    fields: [
      f("title", "Page title", "text", 160, true),
      f("description", "Search description", "textarea", 500, true),
      f("canonical", "Public website URL", "url", 2048, true),
      f("image", "Social preview image", "image"),
    ],
  },
  footer: {
    label: "Footer",
    fields: [
      f("credit", "Credit", "text", 180, true),
      f("copyright", "Copyright", "text", 180, true),
    ],
  },
};
export const lists = {
  experience: {
    label: "Experience",
    singular: "experience",
    fields: [
      f("title", "Role", "text", 120, true),
      f("organization", "Organization", "text", 120, true),
      f("dates", "Dates", "text", 100, true),
      f("summary", "Overview", "textarea", 1000, true),
      f("highlights", "Contributions / learning (one per line)", "lines", 500),
      f("technologies", "Technologies (one per line)", "lines", 60),
      f("certificate", "Certificate", "document"),
    ],
  },
  skills: {
    label: "Skills",
    singular: "skill group",
    fields: [
      f("title", "Group name", "text", 100, true),
      f("description", "Experience level / context", "textarea", 400),
      f("items", "Skills (one per line)", "lines", 80, true),
    ],
  },
  education: {
    label: "Education",
    singular: "education",
    fields: [
      f("degree", "Degree / qualification", "text", 120, true),
      f("institution", "Institution", "text", 160, true),
      f("dates", "Dates", "text", 100, true),
      f("detail", "Additional detail", "textarea", 500),
    ],
  },
  certifications: {
    label: "Certificates & courses",
    singular: "credential",
    fields: [
      f("title", "Credential title", "text", 160, true),
      f("issuer", "Issued by", "text", 120, true),
      f("date", "Completion date (optional)", "text", 100),
      f("kind", "Type (course, internship, etc.)", "text", 100, true),
      f("summary", "Description", "textarea", 600),
      f("image", "Certificate / badge preview", "image"),
      f("credential", "Certificate file or verification URL", "document"),
    ],
  },
};
export const projectFields = [
  f("title", "Project title", "text", 120, true),
  f("year", "Year", "text", 4, true),
  f("summary", "Problem and overview", "textarea", 700),
  f("role", "Your role / team contribution", "textarea", 400),
  f("tags", "Technologies (one per line)", "lines", 50, true),
  f("features", "Implementation highlights (one per line)", "lines", 500, true),
  f("challenge", "Technical challenge / decision", "textarea", 700),
  f("result", "Result (only supported claims)", "textarea", 700),
  f("image", "Project screenshot", "image"),
  f("imageAlt", "Screenshot description", "text", 180),
  f("github", "Code / repository URL", "url"),
  f("demo", "Live website / demo URL", "url"),
  f("video", "Video walkthrough URL", "url"),
];
