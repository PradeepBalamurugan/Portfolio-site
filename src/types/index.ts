export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface Project {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  techStack: string[];
  impact: string;
  gradient: string;
}

export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
  gradient: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
