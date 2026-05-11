import { Panel } from '../../components/animations/Panel'
import { card } from '../../lib/ui'
import { useAppStore } from '../../stores/useAppStore'
import { Check, X, Search, Clock, ShieldCheck, AlertCircle, IndianRupee } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function AdminFees({ db }) {
  const toast = useAppStore((s) => s.toast)
  const [filter, setFilter] = useState('')

  const filteredFees = (db.fees || []).filter(f => 
    f.studentId.toLowerCase().includes(filter.toLowerCase()) ||
    f.term.toLowerCase().includes(filter.toLowerCase())
  )

  const totalExpected = (db.fees || []).reduce((acc, f) => acc + (f.amount || 0), 0)
  const totalCollected = (db.fees || []).reduce((acc, f) => acc + (f.paid || 0), 0)

  return (
    <Panel>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className={`${card} border-l-4 border-indigo-500`}>
          <p className="text-sm text-slate-400">Total Expected</p>
          <h3 className="text-2xl font-bold text-white">₹{totalExpected.toLocaleString()}</h3>
        </div>
        <div className={`${card} border-l-4 border-emerald-500`}>
          <p className="text-sm text-slate-400">Total Collected</p>
          <h3 className="text-2xl font-bold text-emerald-400">₹{totalCollected.toLocaleString()}</h3>
        </div>
        <div className={`${card} border-l-4 border-rose-500`}>
          <p className="text-sm text-slate-400">Total Outstanding</p>
          <h3 className="text-2xl font-bold text-rose-400">₹{(totalExpected - totalCollected).toLocaleString()}</h3>
        </div>
      </div>

      <div className={card}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-white">Financial Ledger</h3>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by Student ID..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-400">
                <th className="pb-4 font-medium px-2">Student</th>
                <th className="pb-4 font-medium px-2">Term</th>
                <th className="pb-4 font-medium text-right px-2">Fees (₹)</th>
                <th className="pb-4 font-medium text-right px-2">Paid (₹)</th>
                <th className="pb-4 font-medium text-center px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {filteredFees.map((f) => (
                  <tr key={f.id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="py-4 px-2 font-medium text-white">
                       <div className="font-bold">{f.student?.user?.name || 'Unknown'}</div>
                       <div className="text-[10px] text-slate-500 font-mono uppercase">{f.studentId}</div>
                    </td>
                    <td className="py-4 px-2 text-slate-300">{f.term}</td>
                    <td className="py-4 px-2 text-right font-mono text-slate-300">{(f.amount || 0).toLocaleString()}</td>
                    <td className="py-4 px-2 text-right font-mono font-semibold text-emerald-400">{(f.paid || 0).toLocaleString()}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        f.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        f.status === 'Partial' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {filteredFees.length === 0 && (
            <div className="text-center py-12 text-slate-600 italic">No matching fee records found.</div>
          )}
        </div>
      </div>
    </Panel>
  )
}
