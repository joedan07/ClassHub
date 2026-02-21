import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ShieldAlert, Users, Settings, Trash2, AlertOctagon, Lock, ShieldCheck, Key, Check, X, BookOpen, Plus, ChevronDown, Loader2, Dices, Edit3, UserMinus, Image as ImageIcon, UploadCloud, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  // Tabs & Settings State
  const [activeTab, setActiveTab] = useState<'users' | 'classes' | 'subjects' | 'system'>('users');
  const [confirmWipe, setConfirmWipe] = useState(false);

  // Real Data State
  const [roleRequests, setRoleRequests] = useState<any[]>([]);
  const [classCodes, setClassCodes] = useState<any[]>([]);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [classRosters, setClassRosters] = useState<Record<string, any[]>>({});
  
  // Workspace Creation & Edit State
  const [showClassForm, setShowClassForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [editClassName, setEditClassName] = useState('');

  // Subject Management State
  const [classSubjects, setClassSubjects] = useState<Record<string, string[]>>({});
  const [selectedClassForSubjects, setSelectedClassForSubjects] = useState('');
  const [newSubject, setNewSubject] = useState('');

  // NEW: AI Parsing State
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState<string | null>(null);

  if (!context) return null;
  const { userRole, setUserRole, setPendingRole } = context;

  // 🛑 THE BOUNCER
  if (userRole === 'STUDENT') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-red-100">
          <Lock className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Access Denied</h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md text-center">
          You do not have the required security clearance to view this sector.
        </p>
        <button onClick={() => navigate('/dashboard')} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
          Return to Safety
        </button>
      </div>
    );
  }

  // --- 1. FETCH REAL DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      const { data: requests } = await supabase.from('profiles').select('*').not('pending_role', 'is', null);
      if (requests) setRoleRequests(requests);

      const { data: classes } = await supabase.from('classes').select('*').order('created_at', { ascending: false });
      if (classes) {
        setClassCodes(classes);
        if (classes.length > 0) setSelectedClassForSubjects(classes[0].code);
      }

      const { data: subjects } = await supabase.from('subjects').select('*');
      if (subjects) {
        const grouped: Record<string, string[]> = {};
        subjects.forEach((s: any) => {
          if (!grouped[s.class_code]) grouped[s.class_code] = [];
          grouped[s.class_code].push(s.name);
        });
        setClassSubjects(grouped);
      }
    };
    fetchData();
  }, []);

  const fetchRoster = async (code: string) => {
    if (classRosters[code]) return; 
    const { data } = await supabase.from('profiles').select('*').eq('class_code', code);
    if (data) setClassRosters(prev => ({ ...prev, [code]: data }));
  };

  const handleExpandClass = (code: string) => {
    const isExpanding = expandedCode !== code;
    setExpandedCode(isExpanding ? code : null);
    if (isExpanding) {
      fetchRoster(code);
      setParseStatus(null); // Reset parser status
    }
  };

  // --- ADMIN ACTIONS ---
  const handleApprove = async (id: string, requestedRole: string) => {
    const { error } = await supabase.from('profiles').update({ role: requestedRole, pending_role: null }).eq('id', id);
    if (!error) {
      setRoleRequests(prev => prev.filter(req => req.id !== id));
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id === id) {
        setUserRole(requestedRole);
        setPendingRole(null);
        alert(`Access Granted. You are now a ${requestedRole}.`);
      }
    }
  };

  const handleDeny = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ pending_role: null }).eq('id', id);
    if (!error) setRoleRequests(prev => prev.filter(req => req.id !== id));
  };

  // --- WORKSPACE CREATION, EDITING, & DELETION ---
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const finalCode = newClassCode.trim().toUpperCase() || `CLASS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const finalName = newClassName.trim();

    const { error } = await supabase.from('classes').insert([{ code: finalCode, name: finalName }]);

    if (!error) {
      setClassCodes(prev => [{ code: finalCode, name: finalName, created_at: new Date() }, ...prev]);
      setClassSubjects(prev => ({ ...prev, [finalCode]: [] }));
      setShowClassForm(false);
      setNewClassName('');
      setNewClassCode('');
    } else {
      alert("Error creating workspace. That code might already be in use!");
    }
  };

  const startEditingClass = (code: string, currentName: string) => {
    setEditingClass(code);
    setEditClassName(currentName);
  };

  const saveEditClass = async (code: string) => {
    if (!editClassName.trim()) return;
    const { error } = await supabase.from('classes').update({ name: editClassName.trim() }).eq('code', code);
    if (!error) {
      setClassCodes(prev => prev.map(c => c.code === code ? { ...c, name: editClassName.trim() } : c));
      setEditingClass(null);
    }
  };

  const handleDeleteClass = async (code: string) => {
    if (!window.confirm(`Are you sure you want to delete ${code}? All data will be permanently lost.`)) return;
    await supabase.from('profiles').update({ class_code: null, role: 'STUDENT' }).eq('class_code', code);
    const { error } = await supabase.from('classes').delete().eq('code', code);
    if (!error) setClassCodes(prev => prev.filter(c => c.code !== code));
  };

  const handleRemoveUserFromClass = async (userId: string, classCode: string) => {
    if (!window.confirm('Remove this user from the workspace?')) return;
    const { error } = await supabase.from('profiles').update({ class_code: null, role: 'STUDENT' }).eq('id', userId);
    if (!error) {
      setClassRosters(prev => ({
        ...prev,
        [classCode]: prev[classCode].filter(u => u.id !== userId)
      }));
    }
  };

  const handleExportCSV = (classCode: string) => {
    const roster = classRosters[classCode];
    if (!roster || roster.length === 0) return alert("No data to export!");

    // Create CSV content
    const headers = "Name,Email,Role\n";
    const csvData = roster.map((u: any) => `"${u.full_name || 'Unknown'}","${u.email}","${u.role}"`).join("\n");
    const fullCsv = headers + csvData;

    // Trigger download
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${classCode}_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateRandomCode = () => setNewClassCode(`CLASS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);

  // --- AI TIMETABLE PARSER ENGINE ---
  const handleTimetableUpload = async (e: React.ChangeEvent<HTMLInputElement>, classCode: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseStatus('Initializing AI Vision Model...');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        setParseStatus('Extracting tabular data from image...');

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY in .env file! Did you restart the server?");
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
          You are a strict data extraction tool. Analyze this timetable image.
          Extract every scheduled class into a JSON array of objects.
          You MUST use this exact schema:
          [
            {
              "day_of_week": "Monday",
              "start_time": "09:00:00",
              "end_time": "10:30:00",
              "subject_name": "Name of the course",
              "faculty_name": "Name of professor (or null if missing)",
              "room_no": "Room string (or null if missing)"
            }
          ]
          Infer the day of the week if it's a grid. Standardize all times to 24-hour HH:MM:SS format.
          Return ONLY valid JSON. Do NOT wrap it in markdown block quotes (\`\`\`json). Just the raw array.
        `;

        const imageParts = [{ inlineData: { data: base64String, mimeType: file.type } }];
        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();
        
        setParseStatus('Validating and compiling JSON...');
        
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanJson);

        setParseStatus('Pushing records to Supabase...');

        await supabase.from('timetables').delete().eq('class_code', classCode);

        const insertData = parsedData.map((row: any) => ({ ...row, class_code: classCode }));
        const { error } = await supabase.from('timetables').insert(insertData);

        if (error) throw error;

        setIsParsing(false);
        setParseStatus('✅ Timetable synced successfully!');
        setTimeout(() => setParseStatus(null), 3000);
      } catch (err: any) {
        console.error("AI Parser Error:", err);
        setIsParsing(false);
        setParseStatus(`❌ AI Error: ${err.message || 'Failed to parse image'}`);
      }
    };
  };

  // --- SUBJECTS & SYSTEM ACTIONS ---
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !selectedClassForSubjects) return;
    const { error } = await supabase.from('subjects').insert([{ class_code: selectedClassForSubjects, name: newSubject.trim() }]);
    if (!error) {
      const currentList = classSubjects[selectedClassForSubjects] || [];
      setClassSubjects({ ...classSubjects, [selectedClassForSubjects]: [...currentList, newSubject.trim()] });
      setNewSubject('');
    }
  };

  const handleRemoveSubject = async (subName: string) => {
    const { error } = await supabase.from('subjects').delete().match({ class_code: selectedClassForSubjects, name: subName });
    if (!error) {
      const currentList = classSubjects[selectedClassForSubjects] || [];
      setClassSubjects({ ...classSubjects, [selectedClassForSubjects]: currentList.filter(s => s !== subName) });
    }
  };

  const handleFactoryReset = async () => {
    if (confirmWipe) {
      await supabase.from('assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('notes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('updates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      setConfirmWipe(false);
      alert("System Purged. All content has been wiped.");
    } else {
      setConfirmWipe(true);
      setTimeout(() => setConfirmWipe(false), 5000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CLASSIFIED HEADER */}
      <div className="bg-gray-900 rounded-3xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-gray-800 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">System Administration</h1>
            <p className="text-gray-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Server Status: Operational
            </p>
          </div>
        </div>
        <div className="relative z-10 bg-gray-800 border border-gray-700 px-6 py-3 rounded-xl text-sm font-bold text-gray-300">
          Clearance Level: <span className="text-blue-400 uppercase tracking-widest ml-1">{userRole}</span>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-gray-200 pb-px">
        {[
          { id: 'users', icon: Users, label: 'Directory & Approvals' },
          { id: 'classes', icon: Key, label: 'Workspace Codes' },
          { id: 'subjects', icon: BookOpen, label: 'Subject Manager' },
          { id: 'system', icon: Settings, label: 'System Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: USERS & APPROVALS */}
      {activeTab === 'users' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-amber-50/30 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">Pending Role Approvals</h2>
              <span className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-0.5 rounded-full">{roleRequests.length}</span>
            </div>
            {roleRequests.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {roleRequests.map(req => (
                  <div key={req.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{req.full_name || 'Unknown User'}</div>
                      <div className="text-sm text-gray-500">{req.email}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-500">
                        Requested: <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase text-xs">{req.pending_role}</span>
                        <span className="ml-2 font-bold text-gray-400 text-xs">for {req.class_code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleApprove(req.id, req.pending_role)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg font-bold flex items-center gap-1 text-sm transition-colors border border-green-200"><Check className="w-4 h-4" /> Approve</button>
                        <button onClick={() => handleDeny(req.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg font-bold flex items-center gap-1 text-sm transition-colors border border-red-200"><X className="w-4 h-4" /> Deny</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400 font-medium flex flex-col items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-gray-200 mb-3" />
                No pending requests at this time.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CLASS CODES, UPLOAD & ROSTERS */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Key className="w-5 h-5 text-indigo-500" /> Workspace Management</h2>
              <p className="text-gray-500 text-sm mt-1">Manage existing workspaces or create new specific access codes.</p>
            </div>
            
            {!showClassForm && (
              <button onClick={() => setShowClassForm(true)} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md">
                <Plus className="w-4 h-4" /> Create Workspace
              </button>
            )}
          </div>

          {showClassForm && (
            <div className="p-6 md:p-8 bg-indigo-50/50 border-b border-gray-100 animate-in slide-in-from-top-2">
              <form onSubmit={handleCreateClass} className="max-w-3xl space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Workspace Name</label>
                  <input required autoFocus type="text" placeholder="e.g., Computer Science Sem 4" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Access Code <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Leave blank to auto-generate" value={newClassCode} onChange={(e) => setNewClassCode(e.target.value.toUpperCase())} className="flex-1 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-black uppercase tracking-widest text-indigo-700" />
                    <button type="button" onClick={generateRandomCode} className="px-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                      <Dices className="w-5 h-5" /> Random
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">Save Workspace</button>
                  <button type="button" onClick={() => setShowClassForm(false)} className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="divide-y divide-gray-50">
            {classCodes.map((cls) => (
              <div key={cls.code} className="flex flex-col group">
                <div onClick={() => handleExpandClass(cls.code)} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-lg text-indigo-600 tracking-widest uppercase bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 shadow-sm">{cls.code}</span>
                      <span className="text-xs font-bold text-gray-400">{new Date(cls.created_at).toLocaleDateString()}</span>
                    </div>
                    {editingClass === cls.code ? (
                      <input type="text" autoFocus value={editClassName} onChange={(e) => setEditClassName(e.target.value)} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Enter') saveEditClass(cls.code); if (e.key === 'Escape') setEditingClass(null); }} className="font-bold text-gray-900 border-b-2 border-indigo-500 outline-none bg-transparent" />
                    ) : (
                      <h3 className="font-bold text-gray-900">{cls.name}</h3>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {editingClass === cls.code ? (
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); saveEditClass(cls.code); }} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check className="w-5 h-5"/></button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingClass(null); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X className="w-5 h-5"/></button>
                      </div>
                    ) : (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); startEditingClass(cls.code, cls.name); }} className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors" title="Rename Workspace"><Edit3 className="w-5 h-5"/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.code); }} className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Delete Workspace"><Trash2 className="w-5 h-5"/></button>
                      </div>
                    )}
                    <div className={`p-2 text-gray-400 transition-transform duration-300 ${expandedCode === cls.code ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* EXPANDED SECTION: AI UPLOAD & ROSTER */}
                {expandedCode === cls.code && (
                  <div className="bg-gray-50 p-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 space-y-8">
                    
                    {/* TIMETABLE AI UPLOAD ZONE */}
                    <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> AI Timetable Sync</h4>
                          <p className="text-xs text-gray-500 mt-1">Upload a schedule image to auto-extract to the database.</p>
                        </div>
                      </div>
                      
                      <div className="relative border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-indigo-50 transition-colors group cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => handleTimetableUpload(e, cls.code)}
                          disabled={isParsing}
                        />
                        {isParsing ? (
                          <>
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                            <p className="text-sm font-bold text-indigo-700">{parseStatus}</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 text-indigo-400 group-hover:text-indigo-600 transition-colors mb-3" />
                            <p className="text-sm font-bold text-indigo-600">Click to upload or drag image here</p>
                            <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG up to 5MB</p>
                          </>
                        )}
                      </div>
                      
                      {/* Success/Error Banner */}
                      {parseStatus && !isParsing && (
                        <div className={`mt-3 p-3 rounded-lg text-sm font-bold ${parseStatus.includes('Error') || parseStatus.includes('❌') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                          {parseStatus}
                        </div>
                      )}
                    </div>

                    {/* CLASS ROSTER */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Class Roster</h4>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-gray-500">{classRosters[cls.code]?.length || 0} Members Enrolled</span>
                          {/* CSV EXPORT BUTTON */}
                          {classRosters[cls.code]?.length > 0 && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleExportCSV(cls.code); }} 
                              className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5" /> Export CSV
                            </button>
                          )}
                        </div>
                      </div>

                      {/* SKELETON LOADER */}
                      {!classRosters[cls.code] ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-16 bg-gray-200 rounded-xl border border-gray-100"></div>
                          ))}
                        </div>
                      ) : classRosters[cls.code].length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                          <p className="text-gray-500 text-sm font-medium">No users are currently enrolled in this workspace.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {classRosters[cls.code].map((user: any) => (
                            <div key={user.id} className="group/user flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-200 transition-colors">
                              <div className="flex items-center gap-3">
                                
                                {/* DICEBEAR AVATAR GENERATION */}
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden shrink-0 border border-indigo-200 bg-indigo-50">
                                  <img 
                                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user.full_name || 'User'}&backgroundColor=e0e7ff,c7d2fe,a5b4fc`} 
                                    alt={`${user.full_name || 'User'} Avatar`} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="overflow-hidden">
                                  <div className="text-sm font-bold text-gray-900 truncate">{user.full_name || 'Unknown User'}</div>
                                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md shrink-0 ${
                                  user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 
                                  user.role === 'CR' ? 'bg-purple-100 text-purple-700' : 
                                  user.role === 'PROFESSOR' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                }`}>{user.role}</span>
                                <button onClick={() => handleRemoveUserFromClass(user.id, cls.code)} className="opacity-0 group-hover/user:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Remove User"><UserMinus className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">
          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Subject Database
              </h2>
              <div className="relative">
                <select value={selectedClassForSubjects} onChange={(e) => setSelectedClassForSubjects(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-black text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer uppercase tracking-wider text-sm">
                  {classCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(classSubjects[selectedClassForSubjects] || []).map(sub => (
                <div key={sub} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 group hover:bg-white hover:border-indigo-200 transition-all shadow-sm hover:shadow">
                  <span className="font-bold text-gray-700">{sub}</span>
                  <button onClick={() => handleRemoveSubject(sub)} className="text-gray-300 hover:text-red-500 transition-colors" title="Remove Subject"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {(classSubjects[selectedClassForSubjects] || []).length === 0 && (
                <div className="col-span-full text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No subjects found for {selectedClassForSubjects}.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm p-6 md:p-8 h-fit">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">Add Subject</h2>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <input required type="text" placeholder="e.g. Data Structures" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full p-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-sm" />
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">Add Subject</button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SYSTEM */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
           <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-gray-500" /> Global Security Policies</h2>
            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">Require Admin Approval</div>
                  <div className="text-xs text-gray-500">For new study materials</div>
                </div>
                <div className="w-10 h-6 bg-indigo-600 rounded-full relative shadow-inner"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
              </label>
              <hr className="border-gray-100" />
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">Allow Late Submissions</div>
                  <div className="text-xs text-gray-500">Accept files after deadlines</div>
                </div>
                <div className="w-10 h-6 bg-gray-200 rounded-full relative shadow-inner"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
              </label>
            </div>
          </div>

          <div className="bg-red-50 p-6 md:p-8 rounded-3xl border border-red-100 shadow-sm">
            <h2 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2"><AlertOctagon className="w-5 h-5" /> Danger Zone</h2>
            <p className="text-sm text-red-600/80 mb-8 font-medium leading-relaxed">These actions are permanent and cannot be undone. Proceed with extreme caution.</p>
            <button onClick={handleFactoryReset} className={`w-full py-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 border shadow-sm ${
                confirmWipe ? 'bg-red-600 text-white border-red-700 animate-pulse hover:bg-red-700' : 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
              }`}><Trash2 className="w-5 h-5" /> {confirmWipe ? 'CLICK AGAIN TO CONFIRM PURGE' : 'Factory Reset App Data'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;