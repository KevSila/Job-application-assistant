
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  User, 
  Sparkles,
  ClipboardCheck,
  Target,
  GraduationCap,
  Award,
  Globe,
  Printer,
  FileCode,
  CheckCircle2,
  BookOpen,
  Layout,
  Briefcase,
  History,
  MessageSquareText,
  Send
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
    }
  ],
  skills: [
    'Python', 'JavaScript', 'React', 'Laravel', 'PHP', 'SQL (MySQL)', 'Tailwind CSS',
    'Figma', 'Adobe XD', 'Canva', 'Photoshop', 'WordPress (Divi/Elementor)',
    'ODK', 'Google Forms', 'Microsoft Forms', 'Google AI Studio', 'CrewAI', 'Manus', 'Opal by Google',
    'Trello', 'Google Workspace', 'Microsoft Office Suite', 'Data Transcription',
    'Qualitative Data Analysis', 'Quantitative Data Analysis', 'SEO Strategy', 'Digital Media Strategy'
  ],
  achievements: [
    'Author: Solitude in the Digital Age (Psychology & Social Analysis)',
    'Author: Firelit Wisdom (Culture & Philosophy) - Sold on Amazon/Nuria',
    'Developer: UNEP Staff Portal System (Laravel & MySQL)',
    'Global Peace Foundation Kenya Ambassador (Conflict Resolution & Climate Change)',
    'Successfully led UNAIDS research cluster across 4 counties in Kenya'
  ],
  certifications: [
    'Cisco CCNA (Routing & Switching)', 'IBM Project Management', 'Cisco Cybersecurity Essentials',
    'Google Data Analytics', 'ICDL Profile Certificate', 'TRREE Research Ethics'
  ],
  projects: [
    {
      name: 'UNEP Staff Portal',
      category: 'Web & Digital',
      description: 'Staff management system streamlining data and authentication.',
      tags: ['Laravel', 'MySQL']
    },
    {
      name: 'Maisha Youth Website Strategy',
      category: 'UI/UX & Web',
      description: 'Structured wireframes, prototypes, and SEO strategy for national movement.',
      tags: ['Figma', 'SEO']
    },
    {
      name: 'Firelit Wisdom - Book Cover',
      category: 'Print & Docs',
      description: 'Compelling cover design for a psychology title sold globally.',
      tags: ['Branding', 'Print Design']
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
    const saved = localStorage.getItem('career-profile-kevsila-v8');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) { console.error("Profile load failed", e); }
    } else {
      localStorage.setItem('career-profile-kevsila-v8', JSON.stringify(DEFAULT_PROFILE));
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('career-profile-kevsila-v8', JSON.stringify(newProfile));
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
      setStatusMessage("Extracting transferable skills...");
      const docs = await generateCareerDocuments(profile, jobDescription, info);
      setResults({ cv: docs.cv || "", coverLetter: docs.coverLetter || "", companyResearch: info });
    } catch (e) { setStatusMessage("Generation failed."); }
    finally { setIsGenerating(false); setStatusMessage(""); }
  };

  const handleGenerateQA = async () => {
    if (!appQuestions.trim() || !jobDescription.trim()) return alert("Ensure both Job Description and Questions are provided.");
    setIsGeneratingQA(true);
    setActiveTab('qa');
    try {
      const answers = await answerApplicationQuestions(profile, jobDescription, appQuestions);
      setQaResults(answers);
    } catch (e) { alert("QA Generation failed."); }
    finally { setIsGeneratingQA(false); }
  };

  const copyRich = async (markdown: string) => {
    const html = marked(markdown);
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
    const source = header + marked(content) + "</body></html>";
    const blob = new Blob(['\ufeff', source], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${filename}.doc`; a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (content: string) => {
    const pr = document.getElementById('print-root');
    if (pr) { pr.innerHTML = `<div class="prose-doc p-12">${marked(content)}</div>`; window.print(); }
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
              <button key={t.id} onClick={() => setActiveTab(t.id as TabType)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}>
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
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Name</label><input value={profile.fullName} onChange={e => saveProfile({...profile, fullName: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Email</label><input value={profile.email} onChange={e => saveProfile({...profile, email: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200" /></div>
                <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Summary</label><textarea value={profile.summary} rows={4} onChange={e => saveProfile({...profile, summary: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200" /></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 text-indigo-600"><Layout /> Toolstack</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (<span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-wider">{s}</span>))}
              </div>
            </div>
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
                {isGenerating ? <><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /><span>{statusMessage}</span></> : <><Sparkles className="w-6 h-6" /><span>Generate CV & Cover Letter</span></>}
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
                <textarea value={appQuestions} onChange={e => setAppQuestions(e.target.value)} placeholder="Paste questions here (e.g. 'Why should we hire you?', 'Tell us about a time you solved a technical challenge')..." className="w-full bg-slate-50 p-6 h-40 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-violet-400 text-lg leading-relaxed" />
                <button disabled={!appQuestions.trim() || !jobDescription.trim() || isGeneratingQA} onClick={handleGenerateQA} className="w-full bg-violet-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-violet-700 shadow-xl transition-all">
                  {isGeneratingQA ? <><div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" /><span>Consulting Architect...</span></> : <><Send className="w-5 h-5" /><span>Generate Answers</span></>}
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
                  <div className="prose-doc w-full bg-white p-12 shadow-sm border border-slate-100 min-h-full" dangerouslySetInnerHTML={{ __html: marked(qaResults) }} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && results && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {results.companyResearch && (
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl group">
                <div className="flex items-center gap-3 mb-4"><Globe className="w-5 h-5 text-indigo-400" /><h3 className="font-black uppercase tracking-widest text-xs">Research Intelligence</h3></div>
                <div className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">{results.companyResearch}</div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                { title: 'Tailored CV', content: results.cv, color: 'indigo', icon: <FileText /> },
                { title: 'Cover Letter', content: results.coverLetter, color: 'violet', icon: <FileCode /> }
              ].map((doc, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[900px] overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                      <div className={`bg-${doc.color}-600 p-2 rounded-xl text-white`}>{React.cloneElement(doc.icon as React.ReactElement, { className: 'w-5 h-5' })}</div>
                      <span className="font-black text-slate-800 uppercase tracking-tight">{doc.title}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 bg-slate-50 flex justify-center">
                    <div className="prose-doc w-full bg-white p-12 shadow-sm border border-slate-100 min-h-full" dangerouslySetInnerHTML={{ __html: marked(doc.content) }} />
                  </div>
                  <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button onClick={() => copyRich(doc.content)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-indigo-700 transition-all"><CheckCircle2 className="w-3.5 h-3.5" /> Copy Rich</button>
                    <button onClick={() => downloadWord(doc.content, doc.title)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase hover:bg-black transition-all"><Download className="w-3.5 h-3.5" /> Word Doc</button>
                    <button onClick={() => handlePrint(doc.content)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase hover:bg-blue-100 transition-all"><Printer className="w-3.5 h-3.5" /> Export PDF</button>
                    <button onClick={() => { navigator.clipboard.writeText(doc.content); alert('MD copied!'); }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 transition-all"><ClipboardCheck className="w-3.5 h-3.5" /> Raw MD</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 px-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-600" /><span>Kevsila Architect</span></div>
          <div className="flex gap-4"><a href="https://kevsilaservices.netlify.app" target="_blank" className="hover:text-indigo-600">Portfolio</a><span>© 2026 AI Intel</span></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
