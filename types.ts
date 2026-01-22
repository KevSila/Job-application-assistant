
export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  details: string;
}

export interface Project {
  name: string;
  category: string;
  description: string;
  tags: string[];
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  achievements: string[];
  certifications: string[];
  projects: Project[];
}

export interface GenerationResult {
  cv: string;
  coverLetter: string;
  companyResearch?: string;
}
