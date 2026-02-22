import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { supabase } from '../supabase'; 
import { LayoutDashboard, BookOpen, FileText, Bell, GraduationCap, LogOut, ShieldAlert, ChevronDown, FolderOpen, Inbox } from 'lucide-react';

const Sidebar: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [adminClasses, setAdminClasses] = useState<any[]>([]);

  if (!context) return null;
  const { userRole, classCode, setIsAuthenticated, setUserRole, setClassCode, userName, refreshData } = context;

  useEffect(() => {
    if (userRole === 'ADMIN') {
      const fetchClasses = async () => {
        const { data } = await supabase.from('classes').select('code');
        if (data) setAdminClasses(data);
      };
      fetchClasses();
    }
  }, [userRole]);

  const handleAdminClassSwitch = async (newCode: string) => {
    setClassCode(newCode);
    refreshData(newCode);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').update({ class_code: newCode }).eq('id', session.user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserRole('STUDENT');
    setClassCode('');
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Assignments', path: '/assignments' },
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: Bell, label: 'Updates', path: '/updates' },
    { icon: GraduationCap, label: 'Syllabus', path: '/syllabus' },
  ];

  return (
    <aside className="w-64 bg-indigo-900 text-white flex flex-col h-full shrink-0 transition-all duration-300 hidden md:flex shadow-2xl">
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">ClassHub</h1>
        {userRole === 'ADMIN' ? (
          <div className="relative mt-2">
            <select value={classCode} onChange={(e) => handleAdminClassSwitch(e.target.value)} className="w-full bg-indigo-800 text-indigo-100 text-xs font-bold uppercase tracking-widest p-2 rounded-lg outline-none cursor-pointer appearance-none border border-indigo-700">
              <option value="" disabled>Select Workspace...</option>
              {adminClasses.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300 pointer-events-none" />
          </div>
        ) : <p className="text-indigo-300 text-[10px] font-black tracking-[0.2em] mt-2 uppercase opacity-60">{classCode || "NO CLASS LINKED"}</p>}
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-100 hover:bg-white/10'}`}>
            <item.icon className="w-5 h-5" /><span>{item.label}</span>
          </NavLink>
        ))}

        {/* NEW: MY FILES (For Students) */}
        {userRole === 'STUDENT' && (
          <NavLink to="/my-files" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-indigo-100 hover:bg-white/10'}`}>
            <FolderOpen className="w-5 h-5" /><span>My Files</span>
          </NavLink>
        )}

        {/* NEW: SUBMISSIONS TRACKER (For CRs and Faculty) */}
        {(userRole === 'PROFESSOR' || userRole === 'CR') && (
          <NavLink to="/submissions" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-indigo-100 hover:bg-white/10'}`}>
            <Inbox className="w-5 h-5" /><span>Submissions</span>
          </NavLink>
        )}

        {userRole === 'ADMIN' && (
          <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold mt-6 ${isActive ? 'bg-amber-400 text-amber-900 shadow-lg' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}>
            <ShieldAlert className="w-5 h-5" /><span>Admin Settings</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-indigo-800/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden shrink-0 border-2 border-indigo-400">
            <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${userName || 'User'}&backgroundColor=e0e7ff,c7d2fe,a5b4fc`} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden"><div className="text-sm font-bold truncate">{userName || 'User'}</div><div className="text-[10px] uppercase tracking-wider font-semibold text-indigo-300 bg-indigo-800/50 px-1.5 py-0.5 rounded w-fit mt-0.5">{userRole}</div></div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-indigo-950 hover:bg-indigo-800 text-indigo-200 py-3 rounded-xl font-bold transition-all text-sm"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>
    </aside>
  );
};

export default Sidebar;