import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, CircleCheck, ArrowRight, Github, 
  Shield, Brain, Database, Calendar, Clock, Users, Linkedin 
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
             <Zap className="w-6 h-6 text-indigo-600 fill-indigo-600" /> ClassHub
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors uppercase tracking-widest">Features</a>
            <a href="#tech" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors uppercase tracking-widest">Tech Stack</a>
            <a href="#developer" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors uppercase tracking-widest">Developer</a>
          </div>
          <button 
            onClick={() => navigate('/auth')} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-3 font-bold shadow-lg shadow-indigo-600/30 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Enter Dashboard
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="mb-8 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-50 border border-indigo-100 mb-8 shadow-sm">
              <Zap className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 font-black text-sm tracking-widest uppercase">Built for Modern Universities</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-6">
              Your entire degree,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">synchronized.</span>
            </h1>
          </div>
          
          <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto mb-12 leading-relaxed animate-in slide-in-from-bottom-10 duration-1000 delay-150">
            Stop losing PDFs in crowded WhatsApp groups. ClassHub is the ultimate command center for tracking assignments, downloading study materials, and managing your syllabus.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-in slide-in-from-bottom-12 duration-1000 delay-300">
            <button 
              onClick={() => navigate('/auth')}
              className="group bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-5 rounded-full font-bold shadow-2xl shadow-gray-900/30 transition-all hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              Launch Workspace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="https://github.com/joedan07" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <button className="bg-white hover:bg-gray-50 text-gray-900 text-lg px-8 py-5 rounded-full font-bold border-2 border-gray-200 hover:border-gray-900 transition-all hover:scale-105 flex items-center gap-3 w-full justify-center">
                <Github className="w-5 h-5" /> View GitHub Repo
              </button>
            </a>
          </div>

          {/* FLOATING GLASS CARD */}
          <div className="relative mx-auto max-w-md animate-bounce hover:animate-none">
            <div className="p-8 rounded-[2rem] backdrop-blur-xl bg-white/60 border border-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                    <CircleCheck className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Status</p>
                    <p className="text-2xl font-black text-gray-900">All Clear!</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="text-left">
                  <p className="text-4xl font-black text-emerald-600 mb-1">0</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-indigo-600 mb-1">12</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BENTO BOX */}
      <section id="features" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">Built Different</h2>
            <p className="text-xl font-medium text-gray-500">Enterprise-grade architecture without the enterprise headache.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-10 rounded-[2.5rem] border border-gray-200 hover:border-indigo-500 bg-white transition-all duration-300 hover:shadow-2xl group cursor-default">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="p-5 rounded-3xl bg-indigo-50 group-hover:bg-indigo-600 transition-colors duration-300 shrink-0">
                  <Zap className="w-8 h-8 text-indigo-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Real-Time WebSockets</h3>
                  <p className="text-lg text-gray-500 font-medium leading-relaxed mb-6">No more refreshing. Get class updates and deadline alerts instantly. Built on a strict WebSocket architecture for live, bidirectional data flow.</p>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">Live Connection Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[2.5rem] border border-gray-200 hover:border-emerald-500 bg-white transition-all duration-300 hover:shadow-2xl group cursor-default">
              <div className="p-5 rounded-3xl bg-emerald-50 group-hover:bg-emerald-500 transition-colors duration-300 inline-block mb-8">
                <Shield className="w-8 h-8 text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">RBAC Security</h3>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">Strict separation between Faculty, CRs, and Students via PostgreSQL Row Level Security (RLS).</p>
            </div>

            <div className="p-10 rounded-[2.5rem] border border-gray-200 hover:border-purple-500 bg-white transition-all duration-300 hover:shadow-2xl group cursor-default">
              <div className="p-5 rounded-3xl bg-purple-50 group-hover:bg-purple-500 transition-colors duration-300 inline-block mb-8">
                <Brain className="w-8 h-8 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">AI Timetable Parsing</h3>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">Powered by Google Gemini Pro to turn raw images into structured relational database entries instantly.</p>
            </div>

            <div className="lg:col-span-2 p-10 rounded-[2.5rem] border border-gray-200 hover:border-amber-500 bg-white transition-all duration-300 hover:shadow-2xl group cursor-default">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="p-5 rounded-3xl bg-amber-50 group-hover:bg-amber-500 transition-colors duration-300 shrink-0">
                  <Database className="w-8 h-8 text-amber-600 group-hover:text-white" />
                </div>
                <div className="w-full">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Smart Cloud Storage</h3>
                  <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">Live cloud tracking to ensure infrastructure limits are respected. Integrated directly with Supabase storage buckets.</p>
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[34%] transition-all duration-1000"></div>
                    </div>
                    <span className="text-sm font-black text-gray-900 tracking-widest">34% USED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADAPTIVE INTERFACES */}
      <section id="tech" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">Adaptive UI</h2>
            <p className="text-xl font-medium text-gray-500">The entire interface shifts dynamically based on your role.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-12 rounded-[3rem] bg-indigo-50/50 border-2 border-indigo-100 hover:shadow-2xl transition-all">
              <div className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black tracking-widest uppercase mb-8">Student Mode</div>
              <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Pure Focus.</h3>
              <p className="text-lg text-gray-600 font-medium mb-10 leading-relaxed">Students see only what matters: assignments, deadlines, and class schedules. No admin noise.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-lg font-bold text-gray-900"><Calendar className="w-6 h-6 text-indigo-500" /> Live Schedule</div>
                <div className="flex items-center gap-4 text-lg font-bold text-gray-900"><Clock className="w-6 h-6 text-indigo-500" /> Assignment Dropboxes</div>
                <div className="flex items-center gap-4 text-lg font-bold text-gray-900"><CircleCheck className="w-6 h-6 text-indigo-500" /> Submission Status</div>
              </div>
            </div>

            <div className="p-12 rounded-[3rem] bg-emerald-50/50 border-2 border-emerald-100 hover:shadow-2xl transition-all">
              <div className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black tracking-widest uppercase mb-8">Admin Mode</div>
              <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Complete Control.</h3>
              <p className="text-lg text-gray-600 font-medium mb-10 leading-relaxed">Faculty and CRs get full visibility: storage metrics, user analytics, and system-wide controls.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-lg font-bold text-gray-900"><Database className="w-6 h-6 text-emerald-500" /> Storage Analytics</div>
                <div className="flex items-center gap-4 text-lg font-bold text-gray-900"><Users className="w-6 h-6 text-emerald-500" /> Class Roster Management</div>
                <div className="flex items-center gap-4 text-lg font-bold text-gray-900"><Shield className="w-6 h-6 text-emerald-500" /> Authoring Permissions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="developer" className="py-16 bg-gray-900 border-t border-gray-800 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-white font-black text-2xl mb-2 tracking-tight">Engineered by Joe Daniel</p>
              <p className="text-gray-400 font-medium tracking-wide">Next-gen LMS. Built with precision.</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/joedan07" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-gray-800 border border-gray-700 hover:bg-white hover:text-gray-900 transition-all text-white">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/joe-daniel-527b0b36a/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-gray-800 border border-gray-700 hover:bg-[#0A66C2] transition-all text-white hover:border-[#0A66C2]">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;