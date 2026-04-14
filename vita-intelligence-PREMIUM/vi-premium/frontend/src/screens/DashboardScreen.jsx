import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { C, G } from '../constants/colors'
import { detectBodyType, getProductCountByScore } from '../utils/recommendationEngine'
import { ALL_PRODUCTS } from '../constants/products'
import { HabitTracker, MilestoneJourney, WeeklyCheckin, useStreak } from '../components/HabitTracker'

const TIPS = [
  { icon:'💧', tip:'Drink 2.5L of water daily. Dehydration reduces testosterone by up to 15%.' },
  { icon:'🌙', tip:'Sleep before 11 PM. 70% of testosterone is produced between 11 PM and 3 AM.' },
  { icon:'🧘', tip:'10 minutes of morning sunlight boosts testosterone and serotonin naturally.' },
  { icon:'🏋️', tip:'Resistance training 3x a week is the most powerful natural testosterone booster.' },
  { icon:'🥜', tip:'Pumpkin seeds, cashews, chickpeas — rich in zinc, critical for testosterone.' },
  { icon:'📵', tip:'Reduce screen time before bed. Blue light suppresses melatonin and hormone repair.' },
]

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function showWeeklyCheckin() {
  const weekKey = `vi_checkin_week_${Math.floor(Date.now() / (7 * 86400000))}`
  return !localStorage.getItem(weekKey)
}

export default function DashboardScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { vitaScore, userName, orderDate, hasPurchased } = state

  const bodyType     = detectBodyType(state)
  const productCount = getProductCountByScore(vitaScore || 0)
  const products     = bodyType.productIds.slice(0, productCount).map(id => ALL_PRODUCTS.find(p => p.id === id)).filter(Boolean)
  const daysOnPlan   = orderDate ? Math.max(0, Math.floor((Date.now() - new Date(orderDate)) / 86400000)) : 0
  const { streak, bestStreak } = useStreak()
  const tipOfDay     = TIPS[new Date().getDay() % TIPS.length]
  const needsCheckin = hasPurchased && showWeeklyCheckin() && daysOnPlan >= 7

  if (!hasPurchased) {
    return (
      <div style={{ height:"100%", overflowY:"auto", background:C.bgMid }}>
        <div style={{ background:G.hero, padding:"52px 20px 24px" }}>
          <div style={{ color:"rgba(255,255,255,.6)", fontSize:13 }}>{getGreeting()} 👋</div>
          <div style={{ color:"#fff", fontSize:22, fontWeight:800, marginTop:2 }}>{userName || "Your VI Report"}</div>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <div style={{ background:"rgba(255,215,0,.15)", border:"1px solid rgba(255,215,0,.3)", borderRadius:20, padding:"3px 10px", color:"#FFD700", fontSize:11, fontWeight:600 }}>VitaScore: {vitaScore}</div>
          </div>
        </div>
        <div style={{ padding:"20px 16px" }}>
          <div style={{ background:"#fff", borderRadius:20, padding:20, marginBottom:16, border:`2px solid ${C.goldBorder}`, boxShadow:"0 4px 20px rgba(185,129,26,.12)" }}>
            <div style={{ color:C.gold, fontSize:15, fontWeight:800, marginBottom:8 }}>🎯 Your Kit is Ready</div>
            <div style={{ color:C.muted, fontSize:14, marginBottom:16 }}>Your personalised {productCount}-product VI Kit is waiting. Purchase to activate full tracking.</div>
            <div onClick={() => navigate("/plan")} style={{ background:G.gold, borderRadius:14, padding:"14px 0", textAlign:"center", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer" }}>View My Personalised Kit →</div>
          </div>
          <div style={{ background:"linear-gradient(135deg,#2D7A4F,#1A5C38)", borderRadius:18, padding:18 }}>
            <div style={{ color:"#fff", fontSize:14, fontWeight:700, marginBottom:10 }}>👨‍⚕️ Talk to a VI Expert — Free</div>
            <div onClick={() => window.open("https://wa.me/918000000000", "_blank")} style={{ background:"#25D366", borderRadius:12, padding:"12px 0", textAlign:"center", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>💬 WhatsApp Expert Now</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bgMid, overflow:"hidden" }}>
      <div style={{ background:G.hero, padding:"52px 20px 20px", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ color:"rgba(255,255,255,.6)", fontSize:13 }}>{getGreeting()} 👋</div>
            <div style={{ color:"#fff", fontSize:21, fontWeight:800 }}>{userName || "Champion"}</div>
            <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
              <div style={{ background:"rgba(255,215,0,.15)", border:"1px solid rgba(255,215,0,.3)", borderRadius:20, padding:"3px 10px", color:"#FFD700", fontSize:11, fontWeight:600 }}>VitaScore: {vitaScore}</div>
              <div style={{ background:"rgba(255,165,0,.15)", border:"1px solid rgba(255,165,0,.3)", borderRadius:20, padding:"3px 10px", color:"#FFA500", fontSize:11, fontWeight:600 }}>🔥 {streak} day streak</div>
            </div>
          </div>
          <div style={{ width:46, height:46, borderRadius:"50%", background:G.gold, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18, fontWeight:700 }}>
            {(userName||"U")[0]}
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { label:"VitaScore", value:vitaScore, color:vitaScore>=80?C.green:vitaScore>=50?C.orange:C.red },
            { label:"Day Streak", value:`${streak}🔥`, color:C.orange },
            { label:"Days Active", value:daysOnPlan, color:C.navy },
          ].map(s => (
            <div key={s.label} style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 10px", textAlign:"center" }}>
              <div style={{ color:s.color, fontSize:20, fontWeight:800 }}>{s.value}</div>
              <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {needsCheckin && <WeeklyCheckin/>}
        <HabitTracker products={products}/>
        <MilestoneJourney streak={streak}/>
        <div style={{ background:"linear-gradient(135deg,#2D7A4F,#1A5C38)", borderRadius:18, padding:18, marginBottom:16 }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👨‍⚕️</div>
            <div><div style={{ color:"#fff", fontSize:14, fontWeight:700 }}>Your VI Expert Coach</div><div style={{ color:"rgba(255,255,255,.7)", fontSize:12 }}>Available 9 AM – 9 PM · All 7 days</div></div>
            <div style={{ marginLeft:"auto", background:"#25D366", borderRadius:10, padding:"4px 10px", color:"#fff", fontSize:11, fontWeight:700 }}>Online ●</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <div onClick={() => window.open("https://wa.me/918000000000", "_blank")} style={{ flex:1, background:"#25D366", borderRadius:12, padding:"10px 0", textAlign:"center", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>💬 WhatsApp</div>
            <div onClick={() => window.open("tel:+918000000000", "_self")} style={{ flex:1, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", borderRadius:12, padding:"10px 0", textAlign:"center", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>📞 Call</div>
          </div>
        </div>
        <div style={{ background:C.goldBg, border:`1px solid ${C.goldBorder}`, borderRadius:16, padding:16, marginBottom:16 }}>
          <div style={{ color:C.gold, fontSize:12, fontWeight:700, marginBottom:8 }}>💡 Today's Wellness Tip</div>
          <div style={{ display:"flex", gap:10 }}><span style={{ fontSize:22 }}>{tipOfDay.icon}</span><span style={{ color:C.text, fontSize:13, lineHeight:1.55 }}>{tipOfDay.tip}</span></div>
        </div>
        <div style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:12 }}>Quick Actions</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { icon:"📦", label:"My Kit", desc:"Products & usage", action:() => navigate("/my-kit") },
            { icon:"📊", label:"My Report", desc:"VitaScore + conditions", action:() => navigate("/result") },
            { icon:"🎥", label:"Videos", desc:"Expert Ayurveda content", action:() => navigate("/videos") },
            { icon:"👤", label:"Profile", desc:"Orders & settings", action:() => navigate("/profile") },
          ].map(a => (
            <div key={a.label} onClick={a.action} style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 14px", cursor:"pointer", boxShadow:"0 1px 8px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize:24, marginBottom:6 }}>{a.icon}</div>
              <div style={{ color:C.text, fontSize:13, fontWeight:700 }}>{a.label}</div>
              <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
