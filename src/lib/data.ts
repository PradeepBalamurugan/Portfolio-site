import { Experience, Project, SkillGroup } from "@/types";

export const siteConfig = {
  name: "Pradeep Balamurugan",
  role: "Full Stack Developer",
  tagline: "Engineering scalable systems that bridge the gap between business logic and beautiful user experiences.",
  email: "pradeepbalamurugan22@gmail.com",
  // phone is intentionally omitted — never rendered and should not ship in the client bundle
  linkedin: "https://linkedin.com/in/pradeepbalamurugan",
  github: "https://github.com/pradeepbalamurugan",
  location: "India • Open to relocate",
  // Points to the secure server-side route handler using a strict allowlist
  resumeUrl: "/api/download?file=resume.pdf",
  siteUrl: "https://pradeepbalamurugan.com",
};

export const aboutText = [
  "I'm a Full Stack Developer with a strong foundation in Computer Science Engineering and a passion for building systems that scale. My expertise spans across the entire development lifecycle — from designing robust backend architectures with Node.js, Java, and Apache Kafka, to crafting pixel-perfect frontends with React and Next.js.",
  "Over the past three years at Trika Technologies, I've engineered enterprise-grade e-commerce middleware platforms, led CMS integrations for composable storefronts, and built internal tools that streamlined resource management across teams. I thrive at the intersection of performance engineering and developer experience.",
  "I believe great software is invisible to the user — it just works. That's the standard I build to.",
];

export const experiences: Experience[] = [
  {
    company: "Trika Technologies",
    role: "Full Stack Developer",
    location: "Coimbatore",
    period: "April 2023 — February 2026",
    achievements: [
      "Architected and shipped cQube, a high-performance e-commerce middleware processing real-time order, pricing, and inventory synchronization across multiple channels.",
      "Integrated Apache Kafka for event-driven streaming and MongoDB Atlas for high-availability data storage, reducing data latency by 40%.",
      "Built real-time system health monitoring dashboards with Grafana and custom job schedulers, increasing system uptime to 99.5%.",
      "Led the technical implementation of Builder.io for Kibo's composable storefront, establishing the architectural CMS page structure.",
      "Developed and shipped a Go-To-Market platform using Next.js and Strapi CMS that drove enterprise client acquisition.",
      "Designed Trika FAM — an internal portal with Next.js and Prisma ORM for employee profiles, skill tracking, and project allocation based on real-time skill-gap analysis.",
    ],
  },
  {
    company: "Zoho Corporation",
    role: "Software Developer Intern",
    location: "Chennai",
    period: "September 2022 — February 2023",
    achievements: [
      "Developed backend log management systems using Java, MySQL, and JDBC, handling high-efficiency data processing at scale.",
      "Engineered advanced data retrieval features including custom sorting algorithms, date-range querying, and intelligent string-matching.",
      "Completed intensive training in data structures, algorithms, and backend operations — strengthening core engineering foundations.",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    icon: "monitor",
    skills: ["React.js", "Next.js", "Tailwind CSS", "Builder.io", "HTML5", "CSS3"],
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    category: "Backend",
    icon: "server",
    skills: ["Node.js", "Java", "Prisma ORM", "Strapi", "Next.js API Routes", "JDBC"],
    gradient: "from-violet-500 to-purple-400",
  },
  {
    category: "Databases & Cloud",
    icon: "database",
    skills: ["MongoDB Atlas", "MySQL", "Apache Kafka", "AWS S3", "Grafana"],
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    category: "Developer Tools",
    icon: "wrench",
    skills: ["Git", "GitHub", "VS Code", "Eclipse IDE", "RESTful APIs", "TypeScript"],
    gradient: "from-orange-500 to-amber-400",
  },
];

export const projects: Project[] = [
  {
    title: "cQube",
    subtitle: "Enterprise E-commerce Middleware Platform",
    problem:
      "E-commerce businesses managing multiple sales channels faced fragmented order management, inconsistent pricing, and inventory synchronization failures — leading to revenue leakage and poor customer experience.",
    solution:
      "Built a high-performance middleware platform using Node.js and Next.js that acts as a centralized orchestration layer. Integrated Apache Kafka for real-time event streaming, MongoDB Atlas for scalable data persistence, AWS S3 for asset management, and Grafana for system health monitoring.",
    techStack: ["Node.js", "Next.js", "Apache Kafka", "MongoDB Atlas", "AWS S3", "Grafana", "Strapi"],
    impact:
      "Reduced data synchronization latency by 40%, achieved 99.5% system uptime, and enabled seamless multi-channel commerce for enterprise clients.",
    gradient: "from-blue-600 via-indigo-500 to-violet-600",
  },
  {
    title: "Kibo Storefront",
    subtitle: "Composable Commerce & CMS Integration",
    problem:
      "The existing storefront lacked content flexibility and required developer intervention for every page change. Marketing and content teams needed autonomy to build and iterate on pages without touching code.",
    solution:
      "Led the integration of Builder.io as a headless CMS into Kibo's composable storefront. Designed the architectural page structure, built a library of modular, reusable React components with Tailwind CSS, and mentored junior developers on headless CMS workflows.",
    techStack: ["React.js", "Builder.io", "Tailwind CSS", "JavaScript", "Next.js"],
    impact:
      "Empowered non-technical teams to launch pages independently, reducing page deployment time by 60% and accelerating the content pipeline across the organization.",
    gradient: "from-emerald-600 via-teal-500 to-cyan-600",
  },
  {
    title: "Trika FAM",
    subtitle: "Internal Resource Management Platform",
    problem:
      "Project managers had no centralized system to evaluate developer skills, track project allocations, or identify skill gaps — resulting in suboptimal team composition and missed deadlines.",
    solution:
      "Designed and deployed a full-stack internal portal using Next.js and Prisma ORM. Built an administrative dashboard featuring employee profiles, technical skill inventories, project tracking, and real-time skill-gap analysis for intelligent developer allocation.",
    techStack: ["Next.js", "Prisma ORM", "TypeScript", "Tailwind CSS", "MySQL"],
    impact:
      "Enabled data-driven project staffing decisions, improved resource utilization by 35%, and reduced project onboarding time for new team members.",
    gradient: "from-rose-600 via-pink-500 to-fuchsia-600",
  },
];

export const certifications = [
  "Certified Java Developer — Infosys Certification, 2022",
  "Advanced Programming Training — Zoho Corporation",
];

export const education = {
  degree: "Bachelor of Engineering in Computer Science",
  institution: "Dr. N.G.P. Institute of Technology",
  location: "Coimbatore",
  period: "2019 — 2023",
  cgpa: "7.71",
};

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];
