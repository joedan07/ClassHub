import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { Bell, Calendar, CheckCircle, Clock, ArrowRight, BookOpen, MapPin, X, Database, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  const [timetable, setTimetable] = useState<any[]>([]);
  const [nextClass, setNextClass] = useState<any>(null);
  const [showFullTimetable, setShowFullTimetable] = useState(false);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [storageUsage, setStorageUsage] = useState<number>(0);

  if (!context) return null;
  const { userRole, userName, classCode, assignments, updates } = context;

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: subs } = await supabase.from('submissions').select('assignment_id').eq('student_id', user.id);
        if (subs) setSubmittedIds(subs.map(s => s.assignment_id));
      }
    
      if (classCode) {
        const { data } = await supabase.from('timetables').select('*').eq('class_code', classCode);
        if (data && data.length > 0) {
          setTimetable(data);
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const today = days[new Date().getDay()];
          const now = new Date();
          const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':00';
          const todaysClasses = data.filter(c => c.day_of_week === today);
          const upcoming = todaysClasses.filter(c => c.start_time && c.start_time >= currentTime).sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
          setNextClass(upcoming.length > 0 ? upcoming[0] : null);
        }
      }

      const { data: usage, error: usageError } = await supabase.rpc('get_storage_usage', { 
        bucket_name_input: 'submissions' 
      });
      if (!usageError) setStorageUsage(usage);
    };
    fetchData();
  }, [classCode]);

  const pendingAssignments = assignments.filter((a: any) => 
    !submittedIds.includes(a.id) && new Date(a.deadline_date) >= new Date()
  ).length;

  const usagePercent = Math.min((storageUsage / 1024) * 100, 100);

  // (ii) FIXED: Change time from 24-hour to 12-hour format
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    try {
      const [h, m] = timeStr.split(':');
      const d = new Date(); d.setHours(parseInt(h), parseInt(m));
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) { return timeStr; }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome back, {userName} 👋</h1>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {userRole} Mode • {classCode || 'No Workspace'}
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-bold text-gray-600 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><Clock className="w-6 h-6 text-white" /></div>
              <span className="bg-indigo-500 border border-indigo-400 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">LMS Active</span>
            </div>
            <div className="text-4xl font-black mb-1">{pendingAssignments}</div>
            <div className="text-indigo-200 font-medium">Pending Tasks</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-3 rounded-2xl ${pendingAssignments === 0 ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <CheckCircle className={`w-6 h-6 ${pendingAssignments === 0 ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
          </div>
          <div className="font-bold text-gray-900 text-lg mb-1">Status</div>
          <div className="text-gray-500 text-sm">
            {pendingAssignments === 0 ? "You're caught up!" : `${pendingAssignments} pending tasks.`}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
               <Database className="w-6 h-6" />
             </div>
             <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded">1GB Limit</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xl font-black text-gray-900">{storageUsage.toFixed(1)} <span className="text-xs">MB</span></span>
            <span className="text-[10px] font-bold text-gray-400">Used</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${usagePercent > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} 
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
        </div>

        <div onClick={() => setShowFullTimetable(true)} className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl border border-gray-800 cursor-pointer hover:border-indigo-500 transition-colors group">
          <div className="flex justify-between items-start mb-2">
            <Calendar className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase tracking-widest bg-gray-800 px-2 py-1 rounded-md font-bold text-gray-300 tracking-wider">Schedule ↗</span>
          </div>
          {/* (i) FIXED: Next class card now shows all info properly */}
          {nextClass ? (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Next Class</div>
              <div className="text-lg font-black text-white mb-1 line-clamp-1 leading-tight">{nextClass.subject_name}</div>
              <div className="text-xs font-medium text-gray-400 flex items-center gap-2 mt-1">
                <Clock className="w-3.5 h-3.5" /> {formatTime(nextClass.start_time)}
                <span className="text-gray-700">|</span>
                <MapPin className="w-3.5 h-3.5" /> {nextClass.room_no || 'TBA'}
              </div>
            </div>
          ) : <div className="mt-4 text-sm font-bold">No more classes! 🎉</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Upcoming Deadlines</h2>
            <button onClick={() => navigate('/assignments')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            {assignments.filter(a => !submittedIds.includes(a.id)).slice(0, 3).map((a: any) => (
              <div key={a.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${new Date(a.deadline_date) < new Date() ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{new Date(a.deadline_date).getDate()}</div>
                  <div><h3 className="font-bold text-gray-900">{a.title}</h3><p className="text-xs text-gray-500 font-bold uppercase">{a.subject}</p></div>
                </div>
              </div>
            ))}
            {assignments.filter(a => !submittedIds.includes(a.id)).length === 0 && (
              <div className="bg-gray-50 rounded-3xl p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"><CheckCircle className="w-8 h-8 text-emerald-500" /></div>
                <h3 className="text-lg font-black text-gray-900 mb-1">All clear!</h3>
                <p className="text-gray-500 text-sm">No pending submissions found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" /> Class Updates</h2>
            <button onClick={() => navigate('/updates')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2">
            {updates.length > 0 ? updates.slice(0, 3).map((u: any) => (
              <div key={u.id} className="p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${u.importance === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'}`}>{u.importance || 'NOTICE'}</span>
                  <span className="text-xs text-gray-400 font-medium">{new Date(u.timestamp || u.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium line-clamp-2 leading-relaxed">{u.content}</p>
                <div className="mt-2 text-xs font-bold text-gray-400 flex items-center gap-1">
                  <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${u.author || 'User'}&backgroundColor=e0e7ff,c7d2fe`} alt="" className="w-4 h-4 rounded-full" /> {u.author}
                </div>
              </div>
            )) : <div className="p-8 text-center text-gray-400 text-sm">No recent announcements.</div>}
          </div>
        </div>
      </div>

      {/* (iii) FIXED: Full-screen tint using fixed inset-0 and high z-index */}
      {showFullTimetable && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div><h2 className="text-2xl font-black text-gray-900">Weekly Schedule</h2><p className="text-sm text-gray-500 font-bold tracking-widest uppercase mt-1">Workspace: {classCode}</p></div>
              <button onClick={() => setShowFullTimetable(false)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 border border-gray-200 shadow-sm"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 no-scrollbar">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                const dayClasses = timetable.filter(c => c.day_of_week === day).sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
                if (dayClasses.length === 0) return null;
                return (
                  <div key={day} className="mb-10 last:mb-0">
                    <h3 className="text-lg font-black text-gray-900 border-b-2 border-indigo-100 pb-2 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500"/> {day}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {dayClasses.map(c => (
                        <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                          <div className="text-xs font-black text-indigo-600 mb-2">{formatTime(c.start_time)} - {formatTime(c.end_time)}</div>
                          <div className="font-bold text-gray-900 text-lg leading-tight mb-3">{c.subject_name}</div>
                          <div className="text-xs text-gray-500 font-bold flex items-center gap-2 mb-1"><UserCheck className="w-3.5 h-3.5 text-indigo-400"/> {c.faculty_name || 'TBA'}</div>
                          <div className="text-xs text-gray-500 font-bold mt-1 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-indigo-400"/> {c.room_no || 'TBA'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {timetable.length === 0 && <div className="text-center py-12 text-gray-500 font-medium">No timetable found.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;