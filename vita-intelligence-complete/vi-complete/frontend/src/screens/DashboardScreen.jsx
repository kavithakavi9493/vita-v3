import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { C, G } from '../constants/colors'
import { detectBodyType, getProductCountByScore } from '../utils/recommendationEngine'
import { ALL_PRODUCTS } from '../constants/products'

const TIPS = [
  { icon:'💧', tip:'Drink 2.5L of water daily. Dehydration reduces testosterone by up to 15%.' },
  { icon:'🌙', tip:'Sleep before 11 PM. 70% of testosterone is produced between 11 PM–3 AM.' },
  { icon:'🧘', tip:'10 min of morning sunlight boosts testosterone and serotonin naturally.' },
  { icon:'🏋️', tip:'Resistance training 3× a week is the most powerful natural testosterone booster.' },
  { icon:'🥜', tip:'Eat pumpkin seeds, cashews, chickpeas daily — all rich in testosterone-critical zinc.' },
  { icon:'🚫', tip:'Avoid excessive phone use before bed — blue light suppresses melatonin and disrupts hormone repair.' },
]

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function DailyChecklist({ products }) {
  const today = new Date().toDateString()
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`vi_check_${today}`) || '{}') } catch { return {} }
  })
  const toggle = id => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    localStorage.setItem(`vi_check_${today}`, JSON.stringify(next))
  }
  const doneCount = Object.values(checked).filter(Boolean).length
  const pct = products.length ? Math.round((doneCount / products.length) * 100) : 0

  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, overflow:'hidden', marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
      <div style={{ background: G.hero, padding:'14px 18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div style={{ color:'#FFD700', fontSize:14, fontWeight:800 }}>📋 Today's Protocol</div>
          <div style={{ color:'rgba(255,255,255,.7)', fontSize:13 }}>{doneCount}/{products.length} done</div>
        </div>
        <div style={{ height:5, background:'rgba(255,255,255,.15)', borderRadius:3 }}>
          <div style={{ height:'100%', width:`${pct}%`, background: pct===100 ? '#4ade80' : '#FFD700', borderRadius:3, transition:'width .4s' }}/>
        </div>
        {pct===100 && <div style={{ color:'#4ade80', fontSize:12, fontWeight:700, marginTop:6 }}>🎉 Protocol complete for today! Streak maintained!</div>}
      </div>
      {products.map(p => (
        <div key={p.id} onClick={() => toggle(p.id)}
          style={{ padding:'13px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12, cursor:'pointer', background: checked[p.id] ? '#F0FDF4':'#fff', transition:'background .2s' }}>
          <div style={{ width:26, height:26, borderRadius:'50%', border:`2px solid ${checked[p.id]?C.green:C.border}`, background: checked[p.id]?C.green:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {checked[p.id] && <span style={{ color:'#fff', fontSize:11, fontWeight:800 }}>✓</span>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color: checked[p.id]?C.muted:C.text, fontSize:13, fontWeight:500, textDecoration: checked[p.id]?'line-through':'none' }}>{p.icon} {p.brand}</div>
            <div style={{ color:C.subtle, fontSize:11, marginTop:2 }}>{p.timing}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProgressTimeline({ daysOnPlan }) {
  const milestones = [
    { day:1,  label:'Start',   icon:'🌱', done: daysOnPlan>=1  },
    { day:7,  label:'Week 1',  icon:'⚡', done: daysOnPlan>=7  },
    { day:15, label:'Signs',   icon:'💪', done: daysOnPlan>=15 },
    { day:30, label:'Month 1', icon:'🔥', done: daysOnPlan>=30 },
    { day:90, label:'Peak',    icon:'👑', done: daysOnPlan>=90 },
  ]
  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:16, marginBottom:16, boxShadow:'0 2px 10px rgba(0,0,0,.06)' }}>
      <div style={{ color:C.text, fontSize:14, fontWeight:700, marginBottom:16 }}>🗓️ Transformation Journey</div>
      <div style={{ display:'flex', alignItems:'flex-start', position:'relative' }}>
        <div style={{ position:'absolute', top:18, left:18, right:18, height:2, background:C.border, zIndex:0 }}/>
        {milestones.map((m, i) => (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background: m.done ? G.gold : C.bgMid, border:`2px solid ${m.done?C.goldDeep:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, boxShadow: m.done?'0 2px 8px rgba(185,129,26,.3)':'none' }}>{m.icon}</div>
            <div style={{ color: m.done?C.gold:C.subtle, fontSize:9, fontWeight: m.done?700:400, marginTop:4 }}>Day {m.day}</div>
            <div style={{ color: m.done?C.text:C.subtle, fontSize:9, textAlign:'center' }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { vitaScore, userName, orderDate, hasPurchased } = state

  const bodyType     = detectBodyType(state)
  const productCount = getProductCountByScore(vitaScore || 0)
  const products     = bodyType.productIds.slice(0, productCount).map(id => ALL_PRODUCTS.find(p => p.id === id)).filter(Boolean)
  const daysOnPlan   = orderDate ? Math.max(0, Math.floor((Date.now() - new Date(orderDate)) / 86400000)) : 0
  const streak       = parseInt(localStorage.getItem('vi_streak') || '1', 10)
  const tip          = TIPS[Math.floor(Math.random() * TIPS.length)]

  // Pre-purchase state
  if (!hasPurchased) {
    return (
      <div style={{ height:'100%', overflowY:'auto', background:C.bgMid }}>
        <div style={{ background:G.hero, padding:'52px 20px 24px' }}>
          <div style={{ color:'rgba(255,255,255,.6)', fontSize:13 }}>{getGreeting()} 👋</div>
          <div style={{ color:'#fff', fontSize:22, fontWeight:800, marginTop:2 }}>{userName || 'Your VI Report'}</div>
          <div style={{ color:'rgba(255,215,0,.8)', fontSize:13, marginTop:4 }}>VitaScore: {vitaScore}/100</div>
        </div>
        <div style={{ padding:'20px 16px' }}>
          <div style={{ background:'#fff', borderRadius:20, padding:20, marginBottom:16, border:`2px solid ${C.goldBorder}`, boxShadow:'0 4px 20px rgba(185,129,26,.12)' }}>
            <div style={{ color:C.gold, fontSize:15, fontWeight:800, marginBottom:8 }}>🎯 Your Kit is Ready</div>
            <div style={{ color:C.muted, fontSize:14, marginBottom:16 }}>Your personalised {productCount}-product VI Kit is waiting. Complete your purchase to start your transformation.</div>
            <div onClick={() => navigate('/plan')} style={{ background:G.gold, borderRadius:14, padding:'14px 0', textAlign:'center', color:'#fff', fontSize:15, fontWeight:800, cursor:'pointer' }}>View My Personalised Kit →</div>
          </div>
          <div style={{ background:'linear-gradient(135deg,#2D7A4F,#1A5C38)', borderRadius:18, padding:18 }}>
            <div style={{ color:'#fff', fontSize:14, fontWeight:700, marginBottom:10 }}>👨‍⚕️ Talk to a VI Expert — Free</div>
            <div style={{ color:'rgba(255,255,255,.7)', fontSize:13, marginBottom:12 }}>Get answers to all your questions before purchasing. No pressure, fully confidential.</div>
            <div onClick={() => window.open('https://wa.me/918000000000?text=Hi%20VI%2C%20I%20want%20to%20know%20more', '_blank')}
              style={{ background:'#25D366', borderRadius:12, padding:'12px 0', textAlign:'center', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              💬 WhatsApp Expert Now
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:C.bgMid, overflow:'hidden' }}>
      {/* Header */}
      <div style={{ background:G.hero, padding:'52px 20px 20px', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ color:'rgba(255,255,255,.6)', fontSize:13 }}>{getGreeting()} 👋</div>
            <div style={{ color:'#fff', fontSize:22, fontWeight:800 }}>{userName || 'Champion'}</div>
            <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
              <div style={{ background:'rgba(255,215,0,.15)', border:'1px solid rgba(255,215,0,.3)', borderRadius:20, padding:'3px 10px', color:'#FFD700', fontSize:11, fontWeight:600 }}>⚡ VitaScore: {vitaScore}</div>
              <div style={{ background:'rgba(255,165,0,.15)', border:'1px solid rgba(255,165,0,.3)', borderRadius:20, padding:'3px 10px', color:'#FFA500', fontSize:11, fontWeight:600 }}>🔥 {streak} day streak</div>
            </div>
          </div>
          <div style={{ width:46, height:46, borderRadius:'50%', background:G.gold, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18, fontWeight:700 }}>
            {(userName||'U')[0]}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 24px' }}>
        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
          {[
            { label:'VitaScore', value:vitaScore, color: vitaScore>=80?C.green:vitaScore>=50?C.orange:C.red },
            { label:'Day Streak', value:`${streak}🔥`, color:C.orange },
            { label:'Days Active', value:daysOnPlan, color:C.navy },
          ].map(s => (
            <div key={s.label} style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:14, padding:'14px 10px', textAlign:'center', boxShadow:'0 1px 6px rgba(0,0,0,.05)' }}>
              <div style={{ color:s.color, fontSize:20, fontWeight:800 }}>{s.value}</div>
              <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <DailyChecklist products={products}/>
        <ProgressTimeline daysOnPlan={daysOnPlan}/>

        {/* Expert Coach */}
        <div style={{ background:'linear-gradient(135deg,#2D7A4F,#1A5C38)', borderRadius:18, padding:18, marginBottom:16 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,.15)', border:'2px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>👨‍⚕️</div>
            <div>
              <div style={{ color:'#fff', fontSize:14, fontWeight:700 }}>Your VI Expert Coach</div>
              <div style={{ color:'rgba(255,255,255,.7)', fontSize:12 }}>Available 9 AM – 9 PM · All 7 days</div>
            </div>
            <div style={{ marginLeft:'auto', background:'#25D366', borderRadius:10, padding:'4px 10px', color:'#fff', fontSize:11, fontWeight:700 }}>Online ●</div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <div onClick={() => window.open('https://wa.me/918000000000?text=Hi%20VI%20Coach', '_blank')}
              style={{ flex:1, background:'#25D366', borderRadius:12, padding:'10px 0', textAlign:'center', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>💬 WhatsApp</div>
            <div onClick={() => window.open('tel:+918000000000', '_self')}
              style={{ flex:1, background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.3)', borderRadius:12, padding:'10px 0', textAlign:'center', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>📞 Call</div>
          </div>
        </div>

        {/* Daily tip */}
        <div style={{ background:C.goldBg, border:`1px solid ${C.goldBorder}`, borderRadius:16, padding:16, marginBottom:16 }}>
          <div style={{ color:C.gold, fontSize:12, fontWeight:700, marginBottom:8 }}>💡 Today's Wellness Tip</div>
          <div style={{ display:'flex', gap:10 }}>
            <span style={{ fontSize:22 }}>{tip.icon}</span>
            <span style={{ color:C.text, fontSize:13, lineHeight:1.55 }}>{tip.tip}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:12 }}>Quick Actions</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { icon:'📦', label:'My Kit',    desc:'Products & usage guide', action:() => navigate('/my-kit')   },
            { icon:'📊', label:'My Report', desc:'Full VitaScore details',  action:() => navigate('/result')   },
            { icon:'🎥', label:'Videos',    desc:'Expert tips & Ayurveda',  action:() => navigate('/videos')   },
            { icon:'👤', label:'Profile',   desc:'Orders & settings',       action:() => navigate('/profile')  },
          ].map(a => (
            <div key={a.label} onClick={a.action}
              style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, padding:'16px 14px', cursor:'pointer', boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
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
