import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { useAppStore } from './stores/useAppStore'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CommandPalette } from './components/ui/CommandPalette'

function App() {
  const hydrateSession = useAppStore((s) => s.hydrateSession)
  const toasts = useAppStore((s) => s.toasts)
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    hydrateSession()
  }, [hydrateSession])

  return (
    <BrowserRouter>
      <div className={theme}>
        <div className="min-h-screen bg-slate-950 text-slate-200 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200 light:bg-slate-50 light:text-slate-900">
          <AppRoutes />
          <CommandPalette />
        </div>
      </div>
      
      {/* Global Toast System */}
      <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 rounded-2xl border px-6 py-3 shadow-2xl backdrop-blur-xl ${
                t.variant === 'success' 
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
                  : t.variant === 'error'
                  ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                  : 'border-white/10 bg-white/5 text-white'
              }`}
            >
              <div className="text-sm font-semibold">{t.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

export default App
