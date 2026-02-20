
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  User, 
  Sparkles,
  ClipboardCheck,
  Target,
  Globe,
  Printer,
  FileCode,
  CheckCircle2,
  BookOpen,
  Layout,
  Briefcase,
  History,
  MessageSquareText,
  Send,
  Loader2,
  Github,
  Palette,
  Book
} from 'lucide-react';
import { marked } from 'marked';
import { UserProfile, GenerationResult, Project } from './types';
import { researchCompany, generateCareerDocuments, answerApplicationQuestions } from './services/geminiService';

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Kevin Yumbya Sila',
  email: 'kevinsila100@gmail.com',
  phone: '+254 717-578394',
  location: 'Nairobi, Kenya',
  linkedin: 'https://linkedin.com/in/kevin-sila-9143b618a',
  summary: 'A Nairobi-based developer and media strategist with 5+ years of experience transforming complex data into seamless digital experiences. With a dual background in Mathematics and Computer Science, I bridge the gap between logical architecture and creative storytelling. Expert in building scalable systems (React, Laravel), UI/UX (Figma), and AI-integrated workflows. Proven leader in community initiatives and large-scale data collection projects.',
  experiences: [
    {
      title: 'Freelance Developer & Strategist',
      company: 'K-Sila Services',
      location: 'Nairobi, Kenya',
      startDate: 'January 2024',
      endDate: 'Present',
      description: 'Automating Kenyan SMEs through AI integration and high-performance digital sales machines. Developing conversion-optimized websites and automated WhatsApp sales funnels. Implementing National SEO strategies across all 47 counties.'
    },
    {
      title: 'Website & Digital Platform Assistant',
      company: 'Christine Campbell Rapin',
      location: 'Remote',
      startDate: 'May 2025',
      endDate: 'July 2025',
      description: 'Managed WordPress using Divi theme builder. Integrated marketing funnels via GoHighLevel (Actionera). Performed SEO audits and mobile responsiveness optimizations.'
    },
    {
      title: 'Information Technology Lead',
      company: 'Maisha Youth Movement',
      location: 'Nairobi, Kenya',
      startDate: 'March 2022',
      endDate: 'May 2025',
      description: 'Led digital media strategies and designed prototype website in Figma. Spearheaded Google Cloud adoption for 47 chapters. Managed nationwide qualitative/quantitative survey data using Google Forms and Microsoft Forms. Experience in data transcription and complex workflow automation.'
    },
    {
      title: 'Assistant Manager & I.T Associate',
      company: 'Equavo Limited',
      location: 'Athi River, Machakos, Kenya',
      startDate: 'January 2024',
      endDate: 'January 2025',
      description: 'Managed warehouse operations and finances for crude avocado oil production. Integrated IT data management systems using Excel and SQL for inventory and production tracking (FFA, Dry Matter analysis).'
    },
    {
      title: 'Fellow - President’s Fellowship Program',
      company: 'Global Peace Foundation Kenya',
      location: 'Machakos, Kenya',
      startDate: 'March 2024',
      endDate: 'December 2024',
      description: 'Machakos County representative. Acquired skills in conflict resolution, peace-building, and strategic communication. Championed Peace and Climate Change initiatives.'
    },
    {
      title: 'Research Assistant & Cluster Team Lead',
      company: 'UNAIDS Community Rights Survey',
      location: 'Nairobi/Central Kenya',
      startDate: 'February 2024',
      endDate: 'March 2024',
      description: 'Led Cluster 2 data collection using ODK. Facilitated FGDs and administered questionnaires for gender rights assessments in the HIV response. Managed data quality and ethical compliance.'
    },
    {
      title: 'Chairperson - Machakos County Chapter',
      company: 'Maisha Youth Movement',
      location: 'Machakos, Kenya',
      startDate: 'December 2020',
      endDate: 'May 2025',
      description: 'Led community health awareness initiatives. Authored concept notes and proposals that secured project funding. Mentored members in leadership and project planning.'
    },
    {
      title: 'Online Academic Tutor',
      company: 'Course Hero',
      location: 'Remote',
      startDate: 'January 2020',
      endDate: 'December 2022',
      description: 'Tutored Math, CS, and English. Created a global library of educational resources. Maintained a 4.8/5 satisfaction rating.'
    },
    {
      title: 'Enumerator',
      company: 'Kenya National Housing Census',
      location: 'Machakos County',
      startDate: 'August 2019',
      endDate: 'August 2019',
      description: 'Conducted structured household interviews for national census data collection.'
    }
  ],
  education: [
    {
      degree: 'B.Sc. in Mathematics and Computer Science',
      institution: 'Kenyatta University',
      location: 'Nairobi, Kenya',
      graduationDate: 'July 2023',
      details: 'Second Class Honors. Expert in algorithmic logic and database architecture.'
    },
    {
      degree: 'Secondary Education (KCSE)',
      institution: 'Murang\'a High School',
      location: 'Murang\'a, Kenya',
      graduationDate: 'December 2015',
      details: 'Grade: A-'
    }
  ],
  skills: [
    'Python', 'JavaScript', 'React', 'Laravel', 'PHP', 'SQL (MySQL)', 'Tailwind CSS',
    'Figma', 'Adobe XD', 'Canva', 'Photoshop', 'WordPress (Divi/Elementor)', 'Wix', 'Google Sites',
    'ODK', 'Google Forms', 'Microsoft Forms', 'Google AI Studio', 'CrewAI', 'Manus', 'Opal by Google',
    'Trello', 'Google Workspace', 'Microsoft Office Suite', 'Data Transcription',
    'Qualitative Data Analysis', 'Quantitative Data Analysis', 'SEO Strategy', 'Digital Media Strategy',
    'Tableau', 'Looker Studio', 'Power BI', 'WhatsApp Sales Funnels', 'Technical Writing'
  ],
  achievements: [
    'Author: Attention by Design (Psychology & Social Analysis)',
    'Author: The Firelit Mind (Culture & Philosophy) - Available at kevsilabooks.netlify.app',
    'Developer: Staff Portal Project (Laravel & MySQL) - Personal Project',
    'Global Peace Foundation Kenya Ambassador (Conflict Resolution & Climate Change)',
    'Successfully led UNAIDS research cluster across 4 counties in Kenya'
  ],
  certifications: [
    'Cisco CCNA (Routing & Switching) - 2019', 
    'IBM Project Management Fundamentals - 2022', 
    'Cisco Cybersecurity Essentials - 2020',
    'Google Data Analytics (Coursera) - 2023', 
    'ICDL Profile Certificate - 2016', 
    'TRREE Research Ethics - 2024',
    'IBM Artificial Intelligence V2 - 2020',
    'LinkedIn Learning: Business Analysis Foundations - 2022',
    'LinkedIn Learning: Agile Requirements Foundations - 2022'
  ],
  projects: [
    {
      name: 'AI Job Application Assistant',
      category: 'AI & Productivity',
      description: 'Elite AI-powered career optimization suite built with React and Google Gemini. Automates ATS-optimized CVs.',
      tags: ['React', 'Gemini API', 'TypeScript', 'Tailwind']
    },
    {
      name: 'AI Audio Generator',
      category: 'AI & Multimedia',
      description: 'Transforms text into natural-sounding speech using Google Gemini AI and Web Audio API.',
      tags: ['TypeScript', 'Gemini AI', 'Web Audio API']
    },
    {
      name: 'Staff Portal Project',
      category: 'System Development',
      description: 'Full-stack staff management system developed independently to streamline data and authentication workflows.',
      tags: ['Laravel', 'MySQL', 'Bootstrap']
    }
  ],
  languages: ['English (Fluent)', 'Kiswahili (Fluent)', 'Kamba (Fluent)'],
  references: [
    {
      name: 'Dr. Fridah Muinde',
      title: 'Head, Research Department',
      organization: 'National Syndemic Diseases Control Council',
      email: 'Fmuinde@nsdcc.go.ke',
      phone: '+254 722 609647'
    },
    {
      name: 'Catherine Wanza',
      title: 'Regional HIV/AIDS Coordinator',
      organization: 'National Syndemic Diseases Control Council',
      email: 'cmutuku@nsdcc.go.ke',
      phone: '0722427608'
    },
    {
      name: 'Shedrack Musyoka',
      title: 'Director',
      organization: 'Equavo Limited',
      email: 'shedrackm360@gmail.com',
      phone: '0721731443'
    }
  ]
};

type TabType = 'profile' | 'build' | 'documents' | 'qa';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [jobDescription, setJobDescription] = useState('');
  const [appQuestions, setAppQuestions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQA, setIsGeneratingQA] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [qaResults, setQaResults] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('career-profile-KevSila-v11');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) { console.error("Profile load failed", e); }
    } else {
      localStorage.setItem('career-profile-KevSila-v11', JSON.stringify(DEFAULT_PROFILE));
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('career-profile-KevSila-v11', JSON.stringify(newProfile));
  };

  const handleGenerateDocs = async () => {
    if (!jobDescription.trim()) return alert("Paste Job Description first.");
    setIsGenerating(true);
    setResults(null);
    setActiveTab('documents');
    try {
      const match = jobDescription.match(/(?:company|at):\s*([^\n,.]+)/i);
      const company = match ? match[1].trim() : '';
      let info = "";
      if (company) {
        setStatusMessage(`Researching ${company}...`);
        info = await researchCompany(company);
      }
      setStatusMessage("Engine starting: Crafting ATS-optimized documents...");
      const docs = await generateCareerDocuments(profile, jobDescription, info);
      setResults({ 
        cv: docs.cv || "", 
        coverLetter: docs.coverLetter || "", 
        companyResearch: info 
      });
    } catch (e) { 
      console.error(e);
      setStatusMessage("Generation failed. Check API Key permissions."); 
      alert("Failed to call the Gemini API: permission denied. Ensure API_KEY is set in your environment variables.");
    } finally { 
      setIsGenerating(false); 
      setStatusMessage(""); 
    }
  };

  const handleGenerateQA = async () => {
    if (!appQuestions.trim() || !jobDescription.trim()) return alert("Ensure both Job Description and Questions are provided.");
    setIsGeneratingQA(true);
    setActiveTab('qa');
    try {
      const answers = await answerApplicationQuestions(profile, jobDescription, appQuestions);
      setQaResults(answers);
    } catch (e) { 
      console.error(e);
      alert("QA Generation failed. Check API Key permissions."); 
    } finally { 
      setIsGeneratingQA(false); 
    }
  };

  const copyRich = async (markdown: string) => {
    const html = marked.parse(markdown, { async: false }) as string;
    const blob = new Blob([html], { type: 'text/html' });
    try {
      const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([markdown], { type: 'text/plain' }) })];
      await navigator.clipboard.write(data);
      alert("Rich text copied! Paste directly into Word/Docs.");
    } catch (e) {
      navigator.clipboard.writeText(markdown);
      alert("Raw text copied.");
    }
  };

  const downloadWord = (content: string, filename: string) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>body{font-family:'Times New Roman', serif; line-height:1.4; padding:1in;} h1{text-align:center; border-bottom:2px solid #000;} h2{border-bottom:1px solid #999; text-transform:uppercase;} ul{margin-left:20px;}</style></head><body>";
    const source = header + (marked.parse(content, { async: false }) as string) + "</body></html>";
    const blob = new Blob(['\ufeff', source], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = `${filename}.doc`; 
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (content: string) => {
    const pr = document.getElementById('print-root');
    if (pr) { 
      pr.innerHTML = `<div class="prose-doc p-12">${marked.parse(content, { async: false }) as string}</div>`; 
      window.print(); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg"><Sparkles className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Kevsila Architect</h1></div>
          </div>
          <nav className="flex items-center gap-1">
            {[
              { id: 'profile', icon: <User />, label: 'Profile' },
              { id: 'build', icon: <Target />, label: 'Build' },
              { id: 'documents', icon: <FileText />, label: 'Documents' },
              { id: 'qa', icon: <MessageSquareText />, label: 'Q&A' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as TabType)} 
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {React.cloneElement(t.icon as React.ReactElement, { className: 'w-4 h-4' })}
                <span className="hidden md:inline">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 no-print">
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600"><User /> Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Name</label><input value={profile.fullName} onChange={e => saveProfile({...profile, fullName: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Email</label><input value={profile.email} onChange={e => saveProfile({...profile, email: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none" /></div>
                <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Summary</label><textarea value={profile.summary} rows={4} onChange={e => saveProfile({...profile, summary: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none" /></div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600"><History /> Professional History</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {profile.experiences.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800">{exp.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600">{exp.company}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 text-indigo-600"><Layout /> Digital Ecosystem</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <a href="https://github.com/KevSila" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all group">
                   <div className="p-2 bg-slate-900 text-white rounded-lg"><Github className="w-5 h-5" /></div>
                   <div><p className="text-xs font-black uppercase text-slate-400">GitHub</p><p className="text-sm font-bold text-slate-700">github.com/KevSila</p></div>
                 </a>
                 <a href="https://kevsilaportfolio.netlify.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all">
                   <div className="p-2 bg-indigo-600 text-white rounded-lg"><Globe className="w-5 h-5" /></div>
                   <div><p className="text-xs font-black uppercase text-slate-400">Portfolio</p><p className="text-sm font-bold text-slate-700">kevsilaportfolio.netlify.app</p></div>
                 </a>
                 <a href="https://kevsilabooks.netlify.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all">
                   <div className="p-2 bg-amber-600 text-white rounded-lg"><Book className="w-5 h-5" /></div>
                   <div><p className="text-xs font-black uppercase text-slate-400">Author Hub</p><p className="text-sm font-bold text-slate-700">kevsilabooks.netlify.app</p></div>
                 </a>
                 <a href="https://kevsiladesigns.netlify.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all">
                   <div className="p-2 bg-violet-600 text-white rounded-lg"><Palette className="w-5 h-5" /></div>
                   <div><p className="text-xs font-black uppercase text-slate-400">Design Hub</p><p className="text-sm font-bold text-slate-700">kevsiladesigns.netlify.app</p></div>
                 </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600"><BookOpen /> Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{edu.graduationDate}</span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600">{edu.institution}</p>
                    <p className="text-xs text-slate-500 mt-1">{edu.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600"><CheckCircle2 /> Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase border border-indigo-100">{skill}</span>
                ))}
              </div>
            </div>

            {profile.languages && profile.languages.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600"><Globe /> Languages</h2>
                <div className="flex flex-wrap gap-4">
                  {profile.languages.map((lang, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span className="text-sm font-bold text-slate-700">{lang}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.references && profile.references.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600"><User /> Professional References</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.references.map((ref, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <h4 className="font-bold text-slate-800">{ref.name}</h4>
                      <p className="text-xs font-semibold text-indigo-600">{ref.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{ref.organization}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><span className="font-bold">Email:</span> {ref.email}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><span className="font-bold">Phone:</span> {ref.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'build' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 space-y-8">
              <div className="text-center space-y-2">
                <div className="inline-flex p-4 bg-indigo-50 rounded-full mb-4"><Globe className="w-8 h-8 text-indigo-600" /></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Job Engineering</h2>
                <p className="text-slate-500">Paste the JD to initialize strategic document generation.</p>
              </div>
              <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste Job Description..." className="w-full bg-slate-50 p-6 h-60 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-400 text-lg leading-relaxed" />
              <button disabled={!jobDescription.trim() || isGenerating} onClick={handleGenerateDocs} className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl transition-all">
                {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin" /><span>Consulting Gemini AI...</span></> : <><Sparkles className="w-6 h-6" /><span>Generate CV & Cover Letter</span></>}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 p-3 rounded-2xl"><MessageSquareText className="w-6 h-6 text-violet-600" /></div>
                <div><h2 className="text-2xl font-black text-slate-900 leading-none">Application Q&A</h2><p className="text-sm text-slate-500">Answer specific application questions using your profile intelligence.</p></div>
              </div>
              <div className="space-y-4">
                <textarea value={appQuestions} onChange={e => setAppQuestions(e.target.value)} placeholder="Paste questions here..." className="w-full bg-slate-50 p-6 h-40 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-violet-400 text-lg leading-relaxed" />
                <button disabled={!appQuestions.trim() || !jobDescription.trim() || isGeneratingQA} onClick={handleGenerateQA} className="w-full bg-violet-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-violet-700 shadow-xl transition-all">
                  {isGeneratingQA ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Thinking...</span></> : <><Send className="w-5 h-5" /><span>Generate Answers</span></>}
                </button>
              </div>
            </div>

            {qaResults && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-violet-600 p-2 rounded-xl text-white"><CheckCircle2 className="w-5 h-5" /></div>
                    <span className="font-black text-slate-800 uppercase tracking-tight">Generated Answers</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copyRich(qaResults)} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase hover:bg-indigo-100"><ClipboardCheck className="w-4 h-4" /> Copy Rich</button>
                    <button onClick={() => handlePrint(qaResults)} className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase hover:bg-black"><Printer className="w-4 h-4" /> Export PDF</button>
                  </div>
                </div>
                <div className="p-10 bg-slate-50 flex justify-center min-h-[400px]">
                  <div className="prose-doc w-full bg-white p-12 shadow-sm border border-slate-100 min-h-full" dangerouslySetInnerHTML={{ __html: marked.parse(qaResults, { async: false }) as string }} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {isGenerating && (
              <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10 flex items-center gap-6">
                  <div className="bg-white/20 p-4 rounded-full animate-pulse"><Loader2 className="w-10 h-10 animate-spin" /></div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight uppercase">Generating Cover Letter & CV</h3>
                    <p className="text-indigo-100 font-medium">Kevsila Architect is analyzing keywords and mapping transferable skills...</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-progress" />
              </div>
            )}

            {results?.companyResearch && (
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-4"><Globe className="w-5 h-5 text-indigo-400" /><h3 className="font-black uppercase tracking-widest text-xs">Research Intelligence</h3></div>
                <div className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">{results.companyResearch}</div>
              </div>
            )}

            {(results || isGenerating) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[
                  { title: 'Tailored CV', content: results?.cv, color: 'indigo', icon: <FileText className="w-5 h-5" /> },
                  { title: 'Cover Letter', content: results?.coverLetter, color: 'violet', icon: <FileCode className="w-5 h-5" /> }
                ].map((doc, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[900px] overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                      <div className="flex items-center gap-3">
                        <div className={`bg-${doc.color}-600 p-2 rounded-xl text-white`}>{doc.icon}</div>
                        <span className="font-black text-slate-800 uppercase tracking-tight">{doc.title}</span>
                      </div>
                      {isGenerating && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                    </div>
                    <div className="flex-1 overflow-y-auto p-10 bg-slate-50 flex justify-center">
                      {isGenerating ? (
                        <div className="w-full space-y-8 animate-pulse">
                          <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto" />
                          <div className="h-4 bg-slate-200 rounded w-full" />
                          <div className="h-4 bg-slate-200 rounded w-5/6" />
                          <div className="space-y-4 pt-8">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-3 bg-slate-200 rounded w-full" />)}
                          </div>
                        </div>
                      ) : (
                        <div className="prose-doc w-full bg-white p-12 shadow-sm border border-slate-100 min-h-full" dangerouslySetInnerHTML={{ __html: marked.parse(doc.content || '', { async: false }) as string }} />
                      )}
                    </div>
                    {results && !isGenerating && (
                      <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button onClick={() => copyRich(doc.content || '')} className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-indigo-700 transition-all"><CheckCircle2 className="w-3.5 h-3.5" /> Copy Rich</button>
                        <button onClick={() => downloadWord(doc.content || '', doc.title)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase hover:bg-black transition-all"><Download className="w-3.5 h-3.5" /> Word Doc</button>
                        <button onClick={() => handlePrint(doc.content || '')} className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase hover:bg-blue-100 transition-all"><Printer className="w-3.5 h-3.5" /> Export PDF</button>
                        <button onClick={() => { navigator.clipboard.writeText(doc.content || ''); alert('MD copied!'); }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 transition-all"><ClipboardCheck className="w-3.5 h-3.5" /> Raw MD</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {!results && !isGenerating && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No documents generated yet</p>
                <button onClick={() => setActiveTab('build')} className="mt-4 text-indigo-600 font-black text-xs uppercase hover:underline">Start in the Build tab</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 px-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-4">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-600" /><span>Kevsila Architect</span></div>
          <div className="flex gap-6">
            <a href="https://github.com/KevSila" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</a>
            <a href="https://kevsilaportfolio.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 flex items-center gap-1"><Globe className="w-3 h-3" /> Portfolio</a>
            <a href="https://kevsilabooks.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 flex items-center gap-1"><Book className="w-3 h-3" /> Books</a>
          </div>
          <div className="text-slate-300">© 2026 AI INTEL • Nairobi</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
