import { useState } from 'react'
import { Panel } from '../../components/animations/Panel'
import { card, button } from '../../lib/ui'
import { Plus, BookOpen, Users, Hash } from 'lucide-react'

export function AdminClasses({ db, toast }) {
  const [name, setName] = useState('B.Tech CSE')
  const [year, setYear] = useState('2nd Year')
  const [section, setSection] = useState('C')
  const [loading, setLoading] = useState(false)

  const addClass = async () => {
    setLoading(true)
    try {
      const { api } = await import('../../services/api')
      await api.post('/classes', { name, year, section })
      toast('New class created successfully!', 'success')
    } catch (err) {
      toast('Failed to create class', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Panel>
      <div className={`${card} grid gap-4 md:grid-cols-4 border-l-4 border-indigo-500`}>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Program Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Academic Year</label>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Section</label>
          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:border-indigo-500 outline-none"
            placeholder="e.g. A"
          />
        </div>
        <div className="flex items-end">
          <button 
            disabled={loading}
            type="button" 
            onClick={addClass} 
            className={`${button} bg-indigo-600 hover:bg-indigo-500 w-full flex items-center justify-center gap-2`}
          >
            {loading ? 'Saving...' : <><Plus size={18} /> Add Class</>}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 font-bold text-slate-300 flex items-center gap-2">
           <BookOpen size={20} /> Active Departments & Sections
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {db.classes.map((c) => (
            <div key={c.id} className={`${card} group hover:border-indigo-500/50 transition-colors`}>
              <div className="flex justify-between items-start mb-3">
                 <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 grid place-items-center">
                    <Hash size={20} />
                 </div>
                 <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
              </div>
              <p className="font-black text-slate-100 text-lg">
                {c.name}
              </p>
              <p className="text-slate-400 text-sm font-medium">{c.year} · Section {c.section}</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500 font-bold uppercase">
                 <Users size={14} className="text-indigo-500" /> {c._count?.students || 0} Students Enrolled
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}
