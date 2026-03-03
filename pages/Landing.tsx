import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, ArrowRight, Github, 
  Shield, Brain, Database, Calendar, Clock, Users, Linkedin, CircleCheck, Moon, Sun, Bell, FileText
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // PREMIUM BUTTERY SMOOTH SCROLL LOGIC
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80; // -80px to account for the sticky navbar
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 second duration for the glide
    let start: number | null = null;

    // Cubic easing function for that "Apple" feel
    const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    };

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'} selection:bg-indigo-500/30 selection:text-indigo-400`}>
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-500 ${isDarkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200/50'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className={`text-xl font-black tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
             <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" /> ClassHub
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className={`text-sm font-bold hover:text-indigo-500 transition-colors uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Features</a>
            <a href="#tech" onClick={(e) => scrollToSection(e, 'tech')} className={`text-sm font-bold hover:text-indigo-500 transition-colors uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tech Stack</a>
            <a href="#developer" onClick={(e) => scrollToSection(e, 'developer')} className={`text-sm font-bold hover:text-indigo-500 transition-colors uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Developer</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-indigo-600'}`}
            >
              {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <button 
              onClick={() => navigate('/auth')} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 py-2 text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Scaled Down */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="mb-6 animate-in slide-in-from-bottom-8 duration-1000">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border mb-6 shadow-sm ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <Zap className="w-4 h-4 text-indigo-500" />
              <span className="text-indigo-500 font-black text-xs tracking-widest uppercase">Built for Modern Universities</span>
            </div>
            
            <h1 className={`text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[1.05] mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Smarter scheduling.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-400">Zero missed deadlines.</span>
            </h1>
          </div>
          
          <p className={`text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed animate-in slide-in-from-bottom-10 duration-1000 delay-150 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Stop losing PDFs in crowded WhatsApp groups. ClassHub is the ultimate command center for tracking assignments, downloading study materials, and managing your syllabus.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-12 duration-1000 delay-300">
            <button 
              onClick={() => navigate('/auth')}
              className={`group text-white text-base px-8 py-4 rounded-full font-bold shadow-2xl transition-all hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50' : 'bg-gray-900 hover:bg-gray-800 shadow-gray-900/30'}`}
            >
              Launch Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="https://github.com/joedan07" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <button className={`text-base px-8 py-4 rounded-full font-bold border-2 transition-all hover:scale-105 flex items-center gap-3 w-full justify-center ${isDarkMode ? 'bg-transparent hover:bg-gray-800 text-white border-gray-700 hover:border-gray-500' : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-900'}`}>
                <Github className="w-4 h-4" /> View GitHub Repo
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES BENTO BOX - Padding & Typography Scaled */}
      <section id="features" className={`py-24 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Built Different</h2>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enterprise-grade architecture without the enterprise headache.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className={`lg:col-span-2 p-8 lg:p-10 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl group cursor-default ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-indigo-500/50' : 'bg-white border-gray-200 hover:border-indigo-500'}`}>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className={`p-4 rounded-2xl transition-colors duration-300 shrink-0 ${isDarkMode ? 'bg-indigo-500/10 group-hover:bg-indigo-500' : 'bg-indigo-50 group-hover:bg-indigo-600'}`}>
                  <Zap className="w-7 h-7 text-indigo-500 group-hover:text-white" />
                </div>
                <div>
                  <h3 className={`text-2xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Real-Time WebSockets</h3>
                  <p className={`text-base font-medium leading-relaxed mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No more refreshing. Get class updates and deadline alerts instantly. Built on a strict WebSocket architecture for live, bidirectional data flow.</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Live Connection Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-8 lg:p-10 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl group cursor-default ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-emerald-500/50' : 'bg-white border-gray-200 hover:border-emerald-500'}`}>
              <div className={`p-4 rounded-2xl transition-colors duration-300 inline-block mb-6 ${isDarkMode ? 'bg-emerald-500/10 group-hover:bg-emerald-500' : 'bg-emerald-50 group-hover:bg-emerald-500'}`}>
                <Shield className="w-7 h-7 text-emerald-500 group-hover:text-white" />
              </div>
              <h3 className={`text-2xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>RBAC Security</h3>
              <p className={`text-base font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Strict separation between Faculty, CRs, and Students via PostgreSQL Row Level Security (RLS).</p>
            </div>

            <div className={`p-8 lg:p-10 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl group cursor-default ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-purple-500/50' : 'bg-white border-gray-200 hover:border-purple-500'}`}>
              <div className={`p-4 rounded-2xl transition-colors duration-300 inline-block mb-6 ${isDarkMode ? 'bg-purple-500/10 group-hover:bg-purple-500' : 'bg-purple-50 group-hover:bg-purple-500'}`}>
                <Brain className="w-7 h-7 text-purple-500 group-hover:text-white" />
              </div>
              <h3 className={`text-2xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Timetable Parsing</h3>
              <p className={`text-base font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Powered by Google Gemini Pro to turn raw images into structured relational database entries instantly.</p>
            </div>

            <div className={`lg:col-span-2 p-8 lg:p-10 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl group cursor-default ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-amber-500/50' : 'bg-white border-gray-200 hover:border-amber-500'}`}>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className={`p-4 rounded-2xl transition-colors duration-300 shrink-0 ${isDarkMode ? 'bg-amber-500/10 group-hover:bg-amber-500' : 'bg-amber-50 group-hover:bg-amber-500'}`}>
                  <Database className="w-7 h-7 text-amber-500 group-hover:text-white" />
                </div>
                <div className="w-full">
                  <h3 className={`text-2xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Smart Cloud Storage</h3>
                  <p className={`text-base font-medium leading-relaxed mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Live cloud tracking to ensure infrastructure limits are respected. Integrated directly with Supabase storage buckets.</p>
                  <div className="flex items-center gap-4 w-full">
                    <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="h-full bg-amber-500 rounded-full w-[34%] transition-all duration-1000"></div>
                    </div>
                    <span className={`text-xs font-black tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>34% USED</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ADAPTIVE INTERFACES - Scaled Down */}
      <section id="tech" className="py-24">
        <div className="max-w-[85rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Adaptive UI</h2>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>The entire interface shifts dynamically based on your role.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className={`p-8 lg:p-10 rounded-[2.5rem] border-2 hover:shadow-2xl transition-all ${isDarkMode ? 'bg-indigo-950/20 border-indigo-900/50' : 'bg-indigo-50/50 border-indigo-100'}`}>
              <div className="inline-block px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase mb-6">Student Mode</div>
              <h3 className={`text-3xl font-black mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pure Focus.</h3>
              <p className={`text-base font-medium mb-8 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Students see only what matters: assignments, deadlines, and class schedules. No admin noise.</p>
              <div className="space-y-4">
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><Calendar className="w-5 h-5 text-indigo-500" /> Live Schedule</div>
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><Clock className="w-5 h-5 text-indigo-500" /> Assignment Dropboxes</div>
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><CircleCheck className="w-5 h-5 text-indigo-500" /> Submission Status</div>
              </div>
            </div>

            <div className={`p-8 lg:p-10 rounded-[2.5rem] border-2 hover:shadow-2xl transition-all ${isDarkMode ? 'bg-purple-950/20 border-purple-900/50' : 'bg-purple-50/50 border-purple-100'}`}>
              <div className="inline-block px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[10px] font-black tracking-widest uppercase mb-6">CR Mode</div>
              <h3 className={`text-3xl font-black mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>The Bridge.</h3>
              <p className={`text-base font-medium mb-8 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Class Reps manage internal deadlines, broadcast urgent updates, and act as the liaison.</p>
              <div className="space-y-4">
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><Bell className="w-5 h-5 text-purple-500" /> Class Announcements</div>
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><FileText className="w-5 h-5 text-purple-500" /> Internal Assignments</div>
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><Users className="w-5 h-5 text-purple-500" /> Peer Management</div>
              </div>
            </div>

            <div className={`p-8 lg:p-10 rounded-[2.5rem] border-2 hover:shadow-2xl transition-all ${isDarkMode ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-emerald-50/50 border-emerald-100'}`}>
              <div className="inline-block px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black tracking-widest uppercase mb-6">Admin Mode</div>
              <h3 className={`text-3xl font-black mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Full Control.</h3>
              <p className={`text-base font-medium mb-8 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Faculty get full visibility: live storage metrics, user analytics, and system-wide controls.</p>
              <div className="space-y-4">
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><Database className="w-5 h-5 text-emerald-500" /> Storage Analytics</div>
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><Users className="w-5 h-5 text-emerald-500" /> Class Roster Management</div>
                <div className={`flex items-center gap-3 text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}><Shield className="w-5 h-5 text-emerald-500" /> Authoring Permissions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="developer" className="py-12 bg-gray-950 border-t border-gray-900 rounded-t-[2.5rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-white font-black text-xl mb-1 tracking-tight">Engineered by Joe Daniel</p>
              <p className="text-gray-400 text-sm font-medium tracking-wide">Next-gen LMS. Built with precision.</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/joedan07" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-900 border border-gray-800 hover:bg-white hover:text-gray-900 transition-all text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/joe-daniel-527b0b36a/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-900 border border-gray-800 hover:bg-[#0A66C2] transition-all text-white hover:border-[#0A66C2]">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;