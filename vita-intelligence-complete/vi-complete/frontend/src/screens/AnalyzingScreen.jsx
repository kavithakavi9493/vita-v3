import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { G } from '../constants/colors'

const PHASES = [
  { icon: '🌙', label: 'Lifestyle Pattern Analysed',     color: '#0891B2' },
  { icon: '💪', label: 'Physical Health Profile Mapped',  color: '#15803D' },
  { icon: '🧠', label: 'Mental Wellness Index Complete',  color: '#7C3AED' },
]

export default function AnalyzingScreen() {
  const navigate = useNavigate()
  const [done, setDone]         = useState([])
  const [progress, setProgress] = useState(0)
  const [ready, setReady]       = useState(false)

  useEffect(() => {
    let p = 0
    const pInt = setInterval(() => { p = Math.min(p + 1.2, 76); setProgress(Math.round(p)) }, 40)
    const t1 = setTimeout(() => setDone([0]),       1400)
    const t2 = setTimeout(() => setDone([0, 1]),    2700)
    const t3 = setTimeout(() => { setDone([0,1,2]); setReady(true) }, 3900)
    const go  = setTimeout(() => navigate('/quiz/intimate', { replace: true }), 5300)
    return () => { clearInterval(pInt); [t1,t2,t3,go].forEach(clearTimeout) }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', background: G.hero, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,215,0,.03)' }}/>

      {/* Spinner */}
      <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 32 }}>
        <div className="spin" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(255,215,0,.2)', borderTopColor: '#FFD700' }}/>
        <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', background: 'rgba(255,215,0,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#FFD700', fontSize: 28, fontWeight: 900 }}>VI</span>
        </div>
      </div>

      <div style={{ color: '#FFD700', fontSize: 20, fontWeight: 800, marginBottom: 6, textAlign: 'center' }}>Analysing Your Responses</div>
      <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 13, marginBottom: 28, textAlign: 'center' }}>One final section to complete your VI report</div>

      {/* Progress bar */}
      <div style={{ width: '100%', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>Completion</span>
          <span style={{ color: '#FFD700', fontSize: 12, fontWeight: 700 }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#B8811A,#FFD700)', borderRadius: 3, transition: 'width .1s' }}/>
        </div>
      </div>

      {/* Phase checklist */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PHASES.map((ph, i) => {
          const isDone = done.includes(i)
          return (
            <div key={i} style={{ background: isDone ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.04)', border: `1px solid ${isDone ? 'rgba(255,215,0,.3)' : 'rgba(255,255,255,.08)'}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, transition: 'all .3s' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ph.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{ph.icon}</div>
              <div style={{ flex: 1, color: isDone ? '#fff' : 'rgba(255,255,255,.4)', fontSize: 13, fontWeight: isDone ? 700 : 400 }}>{ph.label}</div>
              <div style={{ color: isDone ? '#4ade80' : 'rgba(255,255,255,.2)', fontSize: 18 }}>{isDone ? '✓' : '○'}</div>
            </div>
          )
        })}
      </div>

      {ready && (
        <div className="fade-up" style={{ marginTop: 24, background: 'rgba(255,215,0,.12)', border: '1px solid rgba(255,215,0,.3)', borderRadius: 12, padding: '12px 20px', color: '#FFD700', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
          ❤️ Last section — Intimate Health. Almost there!
        </div>
      )}
    </div>
  )
}
