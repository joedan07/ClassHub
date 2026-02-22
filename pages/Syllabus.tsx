import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { Book, User, Award, Plus, Trash2, Save, Edit3, Loader2, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';

const Syllabus: React.FC = () => {
  const { classCode, userRole } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [syllabusData, setSyllabusData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newUnitTitle, setNewUnitTitle] = useState('');

  const isLeader = ['ADMIN', 'CR', 'PROFESSOR'].includes(userRole);

  useEffect(() => { fetchSyllabus(); }, [classCode]);

  const fetchSyllabus = async () => {
    // Fetch subjects AND their units in one go using a join
    const { data } = await supabase
      .from('syllabus')
      .select('*, syllabus_units(*)')
      .eq('class_code', classCode)
      .order('created_at', { ascending: false });
    
    if (data) setSyllabusData(data);
    setLoading(false);
  };

  const handleToggleUnit = async (unitId: string, currentState: boolean) => {
    const { error } = await supabase
      .from('syllabus_units')
      .update({ is_completed: !currentState })
      .eq('id', unitId);
    if (!error) fetchSyllabus();
  };

  const handleAddUnit = async (syllabusId: string) => {
    if (!newUnitTitle.trim()) return;
    const { error } = await supabase
      .from('syllabus_units')
      .insert([{ syllabus_id: syllabusId, title: newUnitTitle }]);
    
    if (!error) {
      setNewUnitTitle('');
      fetchSyllabus();
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    await supabase.from('syllabus_units').delete().eq('id', unitId);
    fetchSyllabus();
  };

  const handleSaveSubject = async (item: any) => {
    const { error } = await supabase.from('syllabus').upsert({ 
        id: item.id, 
        subject_name: item.subject_name, 
        faculty_name: item.faculty_name,
        class_code: classCode 
    });
    if (!error) { setEditingId(null); fetchSyllabus(); }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8"> {/* animate-in fade-in duration-300 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Curriculum</h1>
          <p className="text-gray-500 font-medium italic">Class Workspace: {classCode}</p>
        </div>
        {isLeader && (
          <button onClick={() => {
            const id = crypto.randomUUID();
            setSyllabusData([{ id, subject_name: 'New Subject', faculty_name: 'TBD', syllabus_units: [] }, ...syllabusData]);
            setEditingId(id);
          }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" /> Add Subject
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {syllabusData.map((subject) => (
          <div key={subject.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="p-6">
              {editingId === subject.id ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input className="p-3 border rounded-xl font-bold bg-gray-50" value={subject.subject_name} onChange={(e) => setSyllabusData(syllabusData.map(s => s.id === subject.id ? {...s, subject_name: e.target.value} : s))} />
                  <input className="p-3 border rounded-xl bg-gray-50" value={subject.faculty_name} onChange={(e) => setSyllabusData(syllabusData.map(s => s.id === subject.id ? {...s, faculty_name: e.target.value} : s))} />
                  <button onClick={() => handleSaveSubject(subject)} className="bg-green-600 text-white rounded-xl font-bold py-3">Save Subject</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner"><Book className="w-7 h-7" /></div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{subject.subject_name}</h3>
                      <p className="text-gray-500 font-bold text-sm flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-indigo-400" /> {subject.faculty_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isLeader && (
                      <button onClick={() => setEditingId(subject.id)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Edit3 className="w-5 h-5"/></button>
                    )}
                    <button onClick={() => setExpandedId(expandedId === subject.id ? null : subject.id)} className="p-2 bg-gray-50 rounded-xl text-gray-500">
                      {expandedId === subject.id ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {expandedId === subject.id && (
              <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/50 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Units & Progress</h4>
                  {subject.syllabus_units?.map((unit: any) => (
                    <div key={unit.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 group/unit">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleToggleUnit(unit.id, unit.is_completed)} className="transition-transform active:scale-90">
                          {unit.is_completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-gray-300" />}
                        </button>
                        <span className={`font-bold ${unit.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{unit.title}</span>
                      </div>
                      {isLeader && (
                        <button onClick={() => handleDeleteUnit(unit.id)} className="opacity-0 group-hover/unit:opacity-100 p-2 text-red-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}

                  {isLeader && (
                    <div className="flex items-center gap-2 mt-4">
                      <input 
                        className="flex-1 p-3 bg-white border border-dashed border-gray-300 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-colors" 
                        placeholder="Add a new unit (e.g. Unit 1: Introduction)" 
                        value={newUnitTitle}
                        onChange={(e) => setNewUnitTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddUnit(subject.id)}
                      />
                      <button onClick={() => handleAddUnit(subject.id)} className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Syllabus;