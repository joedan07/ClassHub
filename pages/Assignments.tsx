import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { Plus, Filter, Search, CheckCircle2, Circle, Download, Clock, ChevronDown, FileText, Edit2, Upload } from 'lucide-react';
import { CreateModal, SubmissionModal } from '../components/Modals';

const Assignments: React.FC = () => {
  const context = useContext(AppContext);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState<any>(null);
  const [sortBy, setSortBy] = useState('deadline-near');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);

  if (!context) return null;
  const { assignments, userRole, classCode } = context;

  const canEdit = userRole !== 'STUDENT';

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('submissions').select('assignment_id').eq('student_id', user.id);
        if (data) setSubmittedIds(data.map(s => s.assignment_id));
      }
    };
    fetchSubmissions();
  }, [assignments]);

  const subjects = ['All', ...new Set(assignments.map((a: any) => a.subject))];
  
  const filtered = assignments.filter((a: any) => {
    const matchesSubject = filterSubject === 'All' || a.subject === filterSubject;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.subject.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (sortBy === 'filter-completed') matchesStatus = submittedIds.includes(a.id);
    if (sortBy === 'filter-pending') matchesStatus = !submittedIds.includes(a.id);
    return matchesSubject && matchesSearch && matchesStatus;
  });

  const sortedAndFiltered = [...filtered].sort((a: any, b: any) => {
    const dateA = new Date(a.deadlineDate).getTime();
    const dateB = new Date(b.deadlineDate).getTime();
    if (sortBy === 'deadline-near') return dateA - dateB;
    if (sortBy === 'deadline-far') return dateB - dateA;
    return dateA - dateB; 
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div><h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Academic Tasks</h1><p className="text-gray-500 font-medium">Manage and turn in your coursework.</p></div>
        {canEdit && <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"><Plus className="w-5 h-5" /> New Assignment</button>}
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" placeholder="Search tasks..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
          <div className="relative shrink-0"><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-10 pr-8 py-3 w-full bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 outline-none shadow-sm cursor-pointer"><option value="filter-pending">🔥 Pending</option><option value="filter-completed">✅ Completed</option><option value="deadline-near">Near Deadline</option></select><Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5 pointer-events-none" /></div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">{subjects.map(s => <button key={s as string} onClick={() => setFilterSubject(s as string)} className={`whitespace-nowrap px-6 py-2.5 rounded-2xl font-bold transition-all ${filterSubject === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}>{s as string}</button>)}</div>
      </div>

      <div className="grid gap-4">
        {sortedAndFiltered.map((as: any) => {
          const isSubmitted = submittedIds.includes(as.id);
          return (
            <div key={as.id} onClick={() => setExpandedId(expandedId === as.id ? null : as.id)} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer border-l-8 border-l-transparent hover:border-l-indigo-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4">
                  <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center transition-all ${isSubmitted ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-300'}`}>
                    {isSubmitted ? <CheckCircle2 className="w-5 h-5"/> : <Circle className="w-5 h-5"/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">{as.subject}</span><span className="text-xs text-gray-400">• {as.professor}</span></div>
                    <h3 className={`text-xl font-bold ${isSubmitted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{as.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-red-500 font-black bg-red-50 px-2 py-1 rounded uppercase tracking-wider"><Clock className="w-3 h-3"/> Deadline: {new Date(as.deadline_date || as.deadlineDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {userRole === 'STUDENT' && !isSubmitted && (
                    <button onClick={(e) => { e.stopPropagation(); setSubmittingAssignment(as); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md"><Upload className="w-4 h-4" /> Submit</button>
                  )}
                  {isSubmitted && <span className="text-emerald-600 text-xs font-black uppercase bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">Submitted</span>}
                  
                  {canEdit && <button onClick={(e) => { e.stopPropagation(); setEditingItem(as); }} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Edit2 className="w-5 h-5" /></button>}
                  <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${expandedId === as.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expandedId === as.id && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{as.description || "No description."}</p>
                  {as.submission_link && (
                    <a href={as.submission_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 w-fit px-4 py-2 rounded-xl hover:bg-indigo-100">
                      <FileText className="w-4 h-4"/> View Reference Material
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(isModalOpen || editingItem) && <CreateModal type="ASSIGNMENT" initialData={editingItem} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} />}
      {submittingAssignment && <SubmissionModal assignment={submittingAssignment} onClose={() => setSubmittingAssignment(null)} />}
    </div>
  );
};

export default Assignments;