import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { FileText, Search, Plus, Download, Filter, FolderOpen, ChevronDown, Edit2 } from 'lucide-react';
import { CreateModal } from '../components/Modals';

const Notes: React.FC = () => {
  const context = useContext(AppContext);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  if (!context) return null;
  const { notes, userRole } = context;

  // Security Check
  const canUpload = userRole !== 'STUDENT';

  const subjects = ['All', ...new Set(notes.map((n: any) => n.subject))];

  // 1. FILTERING MATH
  const filteredNotes = notes.filter((n: any) => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = filterSubject === 'All' || n.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  // 2. SORTING MATH
  const sortedAndFiltered = [...filteredNotes].sort((a: any, b: any) => {
    const dateA = new Date(a.uploadDate).getTime();
    const dateB = new Date(b.uploadDate).getTime();
    
    if (sortBy === 'newest') return dateB - dateA;
    if (sortBy === 'oldest') return dateA - dateB;
    if (sortBy === 'a-z') return a.title.localeCompare(b.title);
    return 0;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Study Materials</h1>
          <p className="text-gray-500">Access all shared notes, PDFs, and class resources.</p>
        </div>
        {canUpload && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" /> New Material
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by title or #tag..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm min-w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative shrink-0">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-10 pr-8 py-3 w-full bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer"
            >
              <option value="newest">Upload (Newest First)</option>
              <option value="oldest">Upload (Oldest First)</option>
              <option value="a-z">Title (A - Z)</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar items-center">
          {subjects.map(s => (
            <button
              key={s as string}
              onClick={() => setFilterSubject(s as string)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold transition-all shrink-0 ${
                filterSubject === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {s as string}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {sortedAndFiltered.length > 0 ? (
          sortedAndFiltered.map((note: any) => (
            <div 
              key={note.id} 
              onClick={() => toggleExpand(note.id)}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="bg-indigo-50 p-4 rounded-2xl h-fit shrink-0">
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{note.subject}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{note.uploadDate}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{note.title}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((t: string) => (
                        <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">#{t}</span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {note.fileCount > 0 && (
                        <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg mr-2">
                          📎 {note.fileCount} File{note.fileCount > 1 ? 's' : ''}
                        </span>
                      )}
                      
                      {/* NEW: Edit Pencil Button */}
                      {canUpload && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingItem(note); }} 
                          className="p-1.5 text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          title="Edit Note"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      <div className={`p-1.5 text-gray-400 transition-transform duration-300 ${expandedId === note.id ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {expandedId === note.id && (
                <div className="mt-5 pt-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col gap-2">
                    {note.fileCount && note.fileCount > 0 ? (
                      Array.from({ length: note.fileCount }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px] md:max-w-[300px]">
                              {note.title.replace(/\s+/g, '_').toLowerCase()}_part{i + 1}.pdf
                            </span>
                          </div>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-xs font-bold bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow"
                          >
                            <Download className="w-3.5 h-3.5" /> Get
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-gray-700 truncate">{note.title}.pdf</span>
                          </div>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-xs font-bold bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow"
                          >
                            <Download className="w-3.5 h-3.5" /> Get
                          </button>
                        </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <FolderOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No study materials found for your selection.</p>
          </div>
        )}
      </div>

      {/* Updated Modal Renderer */}
      {(isModalOpen || editingItem) && (
        <CreateModal 
          type="NOTE" 
          initialData={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }} 
        />
      )}
    </div>
  );
};

export default Notes;