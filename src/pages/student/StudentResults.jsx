import { Award, BookOpen, Download } from 'lucide-react'
import { Panel } from '../../components/animations/Panel'
import { card, button } from '../../lib/ui'

export function StudentResults({ myResults = [] }) {
  return (
    <Panel>
      <div className={`${card} border-l-4 border-emerald-500 mb-6 bg-emerald-500/5`}>
         <div className="flex items-center gap-4">
            <div className="rounded-full bg-emerald-500/20 p-4 text-emerald-400">
               <Award size={32} />
            </div>
            <div>
               <h3 className="text-xl font-bold">Academic Performance</h3>
               <p className="text-sm text-slate-400">View your grades and subject-wise scorecards.</p>
            </div>
         </div>
      </div>

      <div className="grid gap-4">
        {myResults.map((r) => (
          <div key={r.id} className={`${card} flex items-center justify-between group hover:bg-slate-800/40 transition-all`}>
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 rounded-xl bg-slate-900 grid place-items-center font-bold text-indigo-400 border border-slate-700">
                  {r.subject?.name?.charAt(0) || 'S'}
               </div>
               <div>
                  <div className="font-bold text-slate-100">{r.subject?.name || 'Academic Subject'}</div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">{r.term}</div>
               </div>
            </div>
            
            <div className="flex items-center gap-8">
               <div className="text-right">
                  <div className="text-xl font-black text-slate-100">{r.marks} <span className="text-sm text-slate-500 font-normal">/ {r.total}</span></div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Score</div>
               </div>
               <div className="text-center w-12">
                  <div className={`text-2xl font-black ${r.grade === 'A+' ? 'text-emerald-400' : 'text-indigo-400'}`}>{r.grade}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Grade</div>
               </div>
               <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                  <Download size={18} />
               </button>
            </div>
          </div>
        ))}
        {myResults.length === 0 && (
          <div className={`${card} text-center py-20 text-slate-600`}>
             <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
             <p className="font-medium italic">No results have been published for your profile yet.</p>
          </div>
        )}
      </div>
    </Panel>
  )
}
