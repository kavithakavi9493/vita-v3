import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { G, C } from '../constants/colors'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700)
    const t2 = setTimeout(() => setPhase(2), 1500)
    const t3 = setTimeout(() => {
      if (state.isLoggedIn && state.hasCompletedQuiz) navigate("/dashboard")
      else if (state.isLoggedIn) navigate("/age-group")
      else navigate("/onboarding")
    }, 2800)
    return () => [t1,t2,t3].forEach(clearTimeout)
  }, [])
  return (
    <div style={{ height:"100%", background:G.hero, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-100, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(255,215,0,.04)" }}/>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", opacity:phase>=0?1:0, transition:"all .6s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ width:90, height:90, borderRadius:28, background:G.gold, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, boxShadow:"0 8px 32px rgba(185,129,26,.5)" }}>
          <span style={{ fontSize:44 }}>⚡</span>
        </div>
        <div style={{ color:"#fff", fontSize:38, fontWeight:900 }}>VI</div>
        <div style={{ color:"rgba(255,215,0,.8)", fontSize:12, fontWeight:700, letterSpacing:4, marginTop:4 }}>VITA INTELLIGENCE</div>
      </div>
      <div style={{ marginTop:32, opacity:phase>=1?1:0, transform:phase>=1?"translateY(0)":"translateY(20px)", transition:"all .5s ease .2s", textAlign:"center", padding:"0 32px" }}>
        <div style={{ color:"rgba(255,255,255,.6)", fontSize:15 }}>Ancient Ayurveda · Modern AI</div>
        <div style={{ color:"rgba(255,255,255,.35)", fontSize:12, marginTop:4 }}>India's First Sexual Wellness Intelligence Platform</div>
      </div>
      <div style={{ position:"absolute", bottom:60, opacity:phase>=2?1:0, transition:"opacity .4s", display:"flex", gap:6 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"rgba(255,215,0,.6)", animation:`bounce-dot 1s infinite ${i*.15}s` }}/>)}
      </div>
    </div>
  )
}
