import { useState, useEffect } from 'react'
import { C, G } from '../constants/colors'

// ── Milestone definitions ─────────────────────────────────
const MILESTONES = [
  { days:  1, icon: '🌱', title: 'First Step',        reward: 'Journey begins!',         color: '#15803D' },
  { days:  3, icon: '⚡', title: '3-Day Warrior',     reward: 'Consistency building',     color: '#0891B2' },
  { days:  7, icon: '🔥', title: 'Week Champion',     reward: '10% discount on reorder',  color: '#D97706' },
  { days: 14, icon: '💪', title: '2-Week Titan',      reward: 'Free expert consultation', color: '#7C3AED' },
  { days: 21, icon: '🏅', title: '21-Day Habit',      reward: 'Free progress kit review', color: '#DC2626' },
  { days: 30, icon: '🏆', title: 'Month Champion',    reward: '15% off next order',       color: '#B8811A' },
  { days: 60, icon: '👑', title: '60-Day Legend',     reward: 'Free premium consultation',color: '#1E3A5F' },
  { days: 90, icon: '🌟', title: 'Protocol Complete', reward: 'Lifetime 20% discount',   color: '#15803D' },
]

// ── Streak calculator ─────────────────────────────────────
export function useStreak() {
  const [streak, setStreak]     = useState(0)
  const [bestStreak, setBest]   = useState(0)
  const [lastChecked, setLast]  = useState(null)

  useEffect(() => {
    const stored = {
      streak:     parseInt(localStorage.getItem('vi_streak')      || '0', 10),
      best:       parseInt(localStorage.getItem('vi_best_streak') || '0', 10),
      lastDate:   localStorage.getItem('vi_streak_date'),
    }
    const today     = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let newStreak = stored.streak
    if (stored.lastDate === today) {
      newStreak = stored.streak
    } else if (stored.lastDate === yesterday) {
      // Don't auto-increment — only increment when checklist is completed
      newStreak = stored.streak
    } else if (stored.lastDate !== today) {
      // Streak broken
      newStreak = 0
    }

    setStreak(newStreak)
    setBest(stored.best)
    setLast(stored.lastDate)
  }, [])

  const incrementStreak = () => {
    const today = new Date().toDateString()
    const current = parseInt(localStorage.getItem('vi_streak') || '0', 10)
    const lastDate = localStorage.getItem('vi_streak_date')
    if (lastDate === today) return // already counted today

    const newStreak = current + 1
    const best = Math.max(newStreak, parseInt(localStorage.getItem('vi_best_streak') || '0', 10))
    localStorage.setItem('vi_streak', String(newStreak))
    localStorage.setItem('vi_best_streak', String(best))
    localStorage.setItem('vi_streak_date', today)
    setStreak(newStreak)
    setBest(best)
  }

  return { streak, bestStreak, incrementStreak }
}

// ── Milestone Card ────────────────────────────────────────
function MilestoneCard({ milestone, streakDays, isNext }) {
  const achieved = streakDays >= milestone.days
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 64 }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: achieved ? G.gold : isNext ? `${milestone.color}20` : C.bgMid, border: `2px solid ${achieved ? C.goldDeep : isNext ? milestone.color : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: achieved ? '0 3px 10px rgba(185,129,26,.35)' : 'none', transition: 'all .3s' }}>
        {achieved ? milestone.icon : isNext ? <span style={{ filter: 'grayscale(50%)' }}>{milestone.icon}</span> : <span style={{ opacity: .35 }}>{milestone.icon}</span>}
      </div>
      <div style={{ color: achieved ? C.gold : isNext ? milestone.color : C.subtle, fontSize: 9, fontWeight: achieved ? 700 : 400, textAlign: 'center', lineHeight: 1.2 }}>Day {milestone.days}</div>
    </div>
  )
}

// ── Full Habit Tracker Component ──────────────────────────
export function HabitTracker({ products, onAllDone }) {
  const today     = new Date().toDateString()
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`vi_habits_${today}`) || '{}') } catch { return {} }
  })
  const [celebrate, setCelebrate] = useState(false)
  const { streak, bestStreak, incrementStreak } = useStreak()

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    localStorage.setItem(`vi_habits_${today}`, JSON.stringify(next))

    // Check if all done
    if (products.every(p => next[p.id])) {
      incrementStreak()
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 3000)
      if (onAllDone) onAllDone()
    }
  }

  const doneCount = Object.values(checked).filter(Boolean).length
  const pct       = products.length ? Math.round((doneCount / products.length) * 100) : 0
  const nextMilestone = MILESTONES.find(m => m.days > streak)

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 14px rgba(0,0,0,.07)' }}>
      {/* Header */}
      <div style={{ background: G.hero, padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ color: '#FFD700', fontSize: 14, fontWeight: 800 }}>📋 Daily Protocol</div>
            <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 11, marginTop: 2 }}>
              {pct === 100 ? '✅ Complete!' : `${doneCount}/${products.length} done today`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFA500', fontSize: 18, fontWeight: 900 }}>{streak}🔥</div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 9 }}>streak</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFD700', fontSize: 18, fontWeight: 900 }}>{bestStreak}🏆</div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 9 }}>best</div>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: 'rgba(255,255,255,.15)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#4ade80' : '#FFD700', borderRadius: 3, transition: 'width .5s ease' }}/>
        </div>

        {/* Celebrate */}
        {celebrate && (
          <div className="fade-up" style={{ marginTop: 10, background: 'rgba(74,222,128,.2)', border: '1px solid rgba(74,222,128,.4)', borderRadius: 10, padding: '8px 12px', color: '#4ade80', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
            🎉 Protocol complete! Streak +1. Keep it up!
          </div>
        )}
      </div>

      {/* Product checklist */}
      {products.map(p => (
        <div key={p.id} onClick={() => toggle(p.id)}
          style={{ padding: '13px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: checked[p.id] ? '#F0FDF4' : '#fff', transition: 'background .2s' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${checked[p.id] ? C.green : C.border}`, background: checked[p.id] ? C.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
            {checked[p.id] && <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>✓</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: checked[p.id] ? C.muted : C.text, fontSize: 13, fontWeight: 500, textDecoration: checked[p.id] ? 'line-through' : 'none' }}>
              {p.timingIcon} {p.brand}
            </div>
            <div style={{ color: C.subtle, fontSize: 11, marginTop: 1 }}>{p.timing} · {p.usage?.split('.')[0]}</div>
          </div>
          {checked[p.id] && <div style={{ color: C.green, fontSize: 18 }}>✓</div>}
        </div>
      ))}

      {/* Next milestone */}
      {nextMilestone && (
        <div style={{ padding: '12px 18px', background: C.goldBg, borderTop: `1px solid ${C.goldBorder}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>{nextMilestone.icon} Next: {nextMilestone.title}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Day {nextMilestone.days} · Reward: {nextMilestone.reward}</div>
            </div>
            <div style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>{nextMilestone.days - streak}d left</div>
          </div>
          <div style={{ height: 4, background: C.border, borderRadius: 2, marginTop: 8 }}>
            <div style={{ height: '100%', width: `${Math.min(100, (streak / nextMilestone.days) * 100)}%`, background: G.gold, borderRadius: 2, transition: 'width .5s' }}/>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Milestone Journey Component ───────────────────────────
export function MilestoneJourney({ streak }) {
  const nextIdx = MILESTONES.findIndex(m => m.days > streak)
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 16 }}>
      <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🏅 Achievement Journey</div>
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 12, position: 'relative', minWidth: MILESTONES.length * 76 }}>
          {/* Progress line */}
          <div style={{ position: 'absolute', top: 23, left: 24, right: 24, height: 2, background: C.border, zIndex: 0 }}/>
          <div style={{ position: 'absolute', top: 23, left: 24, height: 2, width: `${(streak / 90) * 100}%`, background: G.gold, zIndex: 1, transition: 'width 1s ease' }}/>
          {MILESTONES.map((m, i) => (
            <MilestoneCard key={m.days} milestone={m} streakDays={streak} isNext={i === nextIdx}/>
          ))}
        </div>
      </div>
      <div style={{ color: C.muted, fontSize: 12, marginTop: 10, textAlign: 'center' }}>
        🔥 {streak} day{streak !== 1 ? 's' : ''} · Keep the streak to unlock rewards!
      </div>
    </div>
  )
}

// ── Weekly Check-in Component ─────────────────────────────
export function WeeklyCheckin({ onSubmit }) {
  const [ratings, setRatings] = useState({ energy: 0, performance: 0, sleep: 0, mood: 0 })
  const [submitted, setSubmitted] = useState(false)
  const categories = [
    { key: 'energy',      label: 'Energy Level',      icon: '⚡' },
    { key: 'performance', label: 'Performance',        icon: '🔥' },
    { key: 'sleep',       label: 'Sleep Quality',      icon: '🌙' },
    { key: 'mood',        label: 'Mood & Confidence',  icon: '😊' },
  ]

  const handleSubmit = () => {
    if (Object.values(ratings).some(r => r === 0)) return
    const weekKey = `vi_checkin_week_${Math.floor(Date.now() / (7 * 86400000))}`
    localStorage.setItem(weekKey, JSON.stringify({ ...ratings, date: new Date().toISOString() }))
    setSubmitted(true)
    if (onSubmit) onSubmit(ratings)
  }

  if (submitted) {
    return (
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 18, padding: 18, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <div style={{ color: C.green, fontSize: 15, fontWeight: 700 }}>Weekly Check-in Saved!</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Your VI Coach will review your progress. Next check-in in 7 days.</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 16 }}>
      <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>📊 Weekly Progress Check-in</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Rate each area from 1 (very poor) to 5 (excellent)</div>
      {categories.map(cat => (
        <div key={cat.key} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 16 }}>{cat.icon}</span>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{cat.label}</span>
            </div>
            {ratings[cat.key] > 0 && <span style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>{ratings[cat.key]}/5</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3,4,5].map(n => (
              <div key={n} onClick={() => setRatings(r => ({ ...r, [cat.key]: n }))}
                style={{ flex: 1, height: 36, borderRadius: 10, border: `1.5px solid ${ratings[cat.key] >= n ? C.gold : C.border}`, background: ratings[cat.key] >= n ? C.goldBg : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: ratings[cat.key] >= n ? C.gold : C.muted, fontSize: 16, transition: 'all .15s' }}>
                ★
              </div>
            ))}
          </div>
        </div>
      ))}
      <div onClick={handleSubmit}
        style={{ background: Object.values(ratings).every(r=>r>0) ? G.gold : C.border, borderRadius: 12, padding: '12px 0', textAlign: 'center', color: '#fff', fontSize: 14, fontWeight: 700, cursor: Object.values(ratings).every(r=>r>0) ? 'pointer' : 'not-allowed', marginTop: 8, transition: 'all .2s' }}>
        Submit Weekly Check-in →
      </div>
    </div>
  )
}

export default HabitTracker
