import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, BottomBar, ScreenWrapper } from '../components/UI'
import { C, G } from '../constants/colors'

const GROUPS = [
  { id:'18-25', icon:'🌱', label:'18 – 25', sub:'Young & active — building foundations' },
  { id:'26-35', icon:'⚡', label:'26 – 35', sub:'Peak performance years' },
  { id:'36-45', icon:'💪', label:'36 – 45', sub:'Maintain, strengthen & optimise' },
  { id:'45+',   icon:'👑', label:'45+',     sub:'Restore, revitalise & sustain' },
]

export default function AgeGroupScreen() {
  const navigate = useNavigate()
  const { update } = useApp()
  const [selected, setSelected] = useState(null)

  const go = () => {
    if (!selected) return
    update({ ageGroup: selected })
    navigate('/quiz/lifestyle')
  }

  return (
    <ScreenWrapper bg="#F0EAE0">
      <div style={{ background: G.hero, padding: '52px 20px 28px' }}>
        <div style={{ color: 'rgba(255,215,0,.8)', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>VI ASSESSMENT · STEP 1 OF 5</div>
        <div style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>How old are you?</div>
        <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 14 }}>Age determines your biological baseline and helps VI personalise your protocol precisely.</div>
      </div>

      <div style={{ padding: '20px 20px 140px' }}>
        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {['Age','Lifestyle','Physical','Mental','Intimate'].map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: 3, borderRadius: 2, background: i === 0 ? G.gold : C.border, marginBottom: 4 }}/>
              <div style={{ color: i === 0 ? C.gold : C.subtle, fontSize: 9, fontWeight: i === 0 ? 700 : 400, textAlign: 'center' }}>{s}</div>
            </div>
          ))}
        </div>

        {GROUPS.map(g => (
          <div key={g.id} onClick={() => setSelected(g.id)}
            style={{ background: selected === g.id ? C.goldBg : '#fff', border: `${selected===g.id?2:1.5}px solid ${selected===g.id?C.goldDeep:C.border}`, borderRadius: 18, padding: '18px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', boxShadow: selected===g.id ? '0 4px 18px rgba(185,129,26,.18)' : '0 2px 8px rgba(0,0,0,.06)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: selected===g.id ? G.gold : C.bgMid, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{g.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.text, fontSize: 18, fontWeight: 800 }}>{g.label}</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{g.sub}</div>
            </div>
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${selected===g.id?C.gold:C.border}`, background: selected===g.id ? G.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {selected===g.id && <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>✓</span>}
            </div>
          </div>
        ))}

        <div style={{ background: C.navyBg, borderRadius: 12, padding: '10px 14px', marginTop: 8 }}>
          <div style={{ color: C.navy, fontSize: 12 }}>🔒 <b>100% confidential.</b> Your data is used only to build your personalised VI protocol.</div>
        </div>
      </div>

      <BottomBar>
        <GoldBtn onClick={go} disabled={!selected} height={56}>
          {selected ? `Continue — Age Group ${selected} →` : 'Select Your Age Group'}
        </GoldBtn>
      </BottomBar>
    </ScreenWrapper>
  )
}
