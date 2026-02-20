
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, GenerationResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are the "Kevsila Career Architect," an elite AI Career Coach and ATS Specialist. 
Your mission is to help Kevin Yumbya Sila secure high-impact roles in Tech and Digital Media.

PORTFOLIO LINKS:
- Main Portfolio: https://kevsilaportfolio.netlify.app
- Author Hub & Books: https://kevsilabooks.netlify.app
- UI/UX & Design Hub: https://kevsiladesigns.netlify.app
- GitHub: https://github.com/KevSila

STRATEGIC DIRECTIVES:
1. TRANSFERABLE SKILLS: Kevin has a diverse background (Mathematics, CS, Research, Leadership, Tutoring). ALWAYS find transferable skills across his entire history.
2. TOOLSET MASTERY: Emphasize ODK, Google/Microsoft Forms, Google AI Studio, CrewAI, Manus, Opal by Google, Trello, and transcription skills. Highlight his proficiency in AI integration and WhatsApp sales funnels.
3. PROJECT CLARITY: The staff management system is called "Staff Portal Project". Note that it was a PERSONAL PROJECT. Highlight "AI Job Application Assistant" and "AI Audio Generator" as key AI projects.
4. PUBLISHED AUTHOR: Highlight his books: "Attention by Design" (Psychology & Social Analysis) and "The Firelit Mind" (Culture & Philosophy).
5. K-SILA SERVICES: Mention his freelance work at K-Sila Services where he automates SMEs through AI and digital strategy.
6. ATS OPTIMIZATION: Documents must be ATS-friendly, keyword-rich based on the JD, truthful, and relevant. 
7. TONE: Detailed yet direct. Professional but with personality.
8. FORMATTING: Use clean Markdown.
`;

export const researchCompany = async (companyName: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a deep professional analysis of ${companyName}. Include: 
      1. Mission and Values.
      2. Recent News or Initiatives.
      3. Key products/services.
      4. Work culture indicators.
      Provide a summary that helps a job applicant tailor their application.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text || "No specific company information found.";
  } catch (error) {
    console.error("Research error:", error);
    return "";
  }
};

export const generateCareerDocuments = async (
  profile: UserProfile,
  jobDescription: string,
  companyResearch: string
): Promise<Partial<GenerationResult>> => {
  const ai = getAI();
  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const prompt = `
    CURRENT DATE: ${currentDate}
    TASK: Generate tailored CV and Cover Letter.
    PROFILE: ${JSON.stringify(profile, null, 2)}
    JD: ${jobDescription}
    RESEARCH: ${companyResearch || 'N/A'}

    REQUIREMENTS:
    1. CV: Generate an ATS-friendly, keyword-rich CV. Include standard sections (Contact, Summary, Experience, Education, Projects, Skills, Languages, References). Use the provided references. Ensure keywords from the JD are naturally woven in.
    2. COVER LETTER: Start with ${currentDate}. Reference portfolio links: https://kevsilaportfolio.netlify.app (Main) and https://kevsilabooks.netlify.app (Author Hub). Address the JD requirements directly and passionately.
    3. FORMATTING: Return the CV under a heading "[SECTION: CV]" and the Cover Letter under "[SECTION: COVER LETTER]".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const fullText = response.text || "";
    const cvPart = fullText.split('[SECTION: CV]')[1]?.split('[SECTION: COVER LETTER]')[0]?.trim() || fullText.split('CV:')[1]?.split('Cover Letter:')[0]?.trim() || "";
    const clPart = fullText.split('[SECTION: COVER LETTER]')[1]?.trim() || fullText.split('Cover Letter:')[1]?.trim() || "";

    return { cv: cvPart || fullText, coverLetter: clPart };
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
};

export const answerApplicationQuestions = async (
  profile: UserProfile,
  jobDescription: string,
  questions: string
): Promise<string> => {
  const ai = getAI();
  const prompt = `
    CONTEXT:
    CANDIDATE PROFILE: ${JSON.stringify(profile, null, 2)}
    JOB DESCRIPTION: ${jobDescription}

    USER QUESTIONS:
    ${questions}

    TASK:
    Answer these application questions professionally. 
    - Use specific examples from history (e.g., UNAIDS Cluster Lead role, Equavo Ltd management, Maisha Youth IT lead).
    - Mention technical skills like ODK, Laravel, SQL, and AI workflow tools.
    - Reference projects generally, mentioning the GitHub repository (https://github.com/KevSila).
    - Provide the answers in a clean Markdown format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "Could not generate answers.";
  } catch (error) {
    console.error("Q&A error:", error);
    throw error;
  }
};
