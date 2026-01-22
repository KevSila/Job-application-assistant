
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, GenerationResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are the "Kevsila Career Architect," an elite AI Career Coach and ATS Specialist. 
Your mission is to help Kevin Yumbya Sila secure high-impact roles in Tech and Digital Media.

STRATEGIC DIRECTIVES:
1. TRANSFERABLE SKILLS: Kevin has a diverse background (Mathematics, CS, Research, Leadership, Tutoring). ALWAYS find transferable skills across his entire history.
2. TOOLSET MASTERY: Emphasize ODK, Google/Microsoft Forms, Google AI Studio, CrewAI, Manus, Opal by Google, Trello, and transcription skills.
3. CONTEXTUAL ANSWERS: When answering application questions, align answers with the specific Job Description (JD) while staying 100% truthful to Kevin's profile.
4. FORMATTING: Use Markdown. Bold (**) for emphasis, lists (-) for clarity.
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

    CV REQS: Standard sections + REFERENCES (Available upon request). Highlight AI tools (CrewAI, ODK, etc.).
    COVER LETTER REQS: Start with ${currentDate}. Reference portfolio: Https://kevsilaservices.netlify.app.
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
    - Use specific examples from the candidate's history (e.g., UNAIDS Cluster Lead role, Equavo Ltd management, Maisha Youth IT lead).
    - Mention technical skills like ODK, Laravel, SQL, and AI workflow tools.
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
