import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { C, G } from '../constants/colors'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

function Row({ icon, label, sub, badge, onClick, danger }) {
  return (
    <div onClick={onClick}
      style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:`1px solid ${C.border}`, cursor: onClick?'pointer':'default' }}>
      <div style={{ width:40, height:40, borderRadius:12, background: danger?'#FEF2F2':C.goldBg, border:`1px solid ${danger?'#FECACA':C.goldBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ color: danger?C.red:C.text, fontSize:14, fontWeight:600 }}>{label}</div>
        {sub && <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{sub}</div>}
      </div>
      {badge && <div style={{ background:C.goldBg, border:`1px solid ${C.goldBorder}`, borderRadius:20, padding:'2px 10px', color:C.gold, fontSize:11, fontWeight:700 }}>{badge}</div>}
      {onClick && !badge && <div style={{ color:C.subtle, fontSize:16 }}>›</div>}
    </div>
  )
}

export default function ProfileScreen() {
  const navigate  = useNavigate()
  const { state, update, reset } = useApp()
  const { userName, phone, email, vitaScore, planType, selectedAmount, orderIds, hasPurchased, orderDate } = state
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return
    setLoggingOut(true)
    try { await signOut(auth) } catch {}
    reset()
    navigate('/', { replace: true })
  }

  const formatDate = iso => iso ? new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'

  return (
    <div style={{ height:'100%', overflowY:'auto', background:C.bgMid }}>
      {/* Header */}
      <div style={{ background:G.hero, padding:'52px 20px 28px' }}>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:G.gold, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:28, fontWeight:800, flexShrink:0, boxShadow:'0 4px 16px rgba(185,129,26,.4)' }}>
            {(userName||'U')[0]}
          </div>
          <div>
            <div style={{ color:'#fff', fontSize:20, fontWeight:800 }}>{userName || 'VI User'}</div>
            <div style={{ color:'rgba(255,255,255,.6)', fontSize:13, marginTop:2 }}>+91 {phone}</div>
            <div style={{ display:'flex', gap:8, marginTop:6 }}>
              <div style={{ background:'rgba(255,215,0,.15)', border:'1px solid rgba(255,215,0,.3)', borderRadius:20, padding:'2px 10px', color:'#FFD700', fontSize:11, fontWeight:600 }}>⚡ VitaScore {vitaScore}</div>
              {hasPurchased && <div style={{ background:'rgba(74,222,128,.15)', border:'1px solid rgba(74,222,128,.3)', borderRadius:20, padding:'2px 10px', color:'#4ade80', fontSize:11, fontWeight:600 }}>✓ Active Plan</div>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:'0 16px 100px' }}>
        {/* My Plan */}
        {hasPurchased && (
          <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:18, margin:'16px 0', boxShadow:'0 2px 10px rgba(0,0,0,.06)' }}>
            <div style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:12 }}>📦 My Active Plan</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Plan Type',    value: (planType||'VI Plan').toUpperCase() },
                { label:'Amount Paid',  value:`₹${(selectedAmount||2999).toLocaleString()}` },
                { label:'Order Date',   value: formatDate(orderDate) },
                { label:'Order ID',     value: (orderIds||[])[0] || '—' },
              ].map(i => (
                <div key={i.label} style={{ background:C.bgMid, borderRadius:12, padding:'10px 12px' }}>
                  <div style={{ color:C.muted, fontSize:11 }}>{i.label}</div>
                  <div style={{ color:C.text, fontSize:13, fontWeight:700, marginTop:2 }}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VitaScore card */}
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:0, boxShadow:'0 2px 10px rgba(0,0,0,.06)' }}>
          <div style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:12 }}>⚡ Your VitaScore</div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:70, height:70, borderRadius:'50%', background:G.hero, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#FFD700', fontSize:24, fontWeight:900 }}>{vitaScore}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:C.text, fontSize:14, fontWeight:700 }}>{vitaScore>=80?'Excellent Foundation':vitaScore>=50?'Moderate — Growing':'Needs Urgent Attention'}</div>
              <div style={{ height:6, background:C.border, borderRadius:3, marginTop:8 }}>
                <div style={{ height:'100%', width:`${vitaScore}%`, background: vitaScore>=80?C.green:vitaScore>=50?C.orange:C.red, borderRadius:3 }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{ color:C.subtle, fontSize:10 }}>0 — Critical</span>
                <span style={{ color:C.subtle, fontSize:10 }}>100 — Peak</span>
              </div>
            </div>
          </div>
          <div onClick={() => navigate('/result')}
            style={{ marginTop:14, background:C.goldBg, border:`1px solid ${C.goldBorder}`, borderRadius:12, padding:'10px 0', textAlign:'center', color:C.gold, fontSize:13, fontWeight:700, cursor:'pointer' }}>
            View Full Report →
          </div>
        </div>

        {/* Actions */}
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:'0 18px', marginTop:16, boxShadow:'0 2px 10px rgba(0,0,0,.06)' }}>
          <Row icon="📦" label="My Kit"          sub="Products, usage & routine"          onClick={() => navigate('/my-kit')}/>
          <Row icon="🎥" label="Expert Videos"   sub="Ayurveda & wellness education"      onClick={() => navigate('/videos')}/>
          <Row icon="📊" label="My VI Report"    sub="Full VitaScore analysis"            onClick={() => navigate('/result')}/>
          <Row icon="💬" label="WhatsApp Coach"  sub="Chat with your VI Expert"           onClick={() => window.open('https://wa.me/918000000000','_blank')}/>
          <Row icon="🔄" label="Retake Assessment" sub="Update your VitaScore"            onClick={() => { update({ hasCompletedQuiz:false, quizAnswers:{} }); navigate('/age-group') }}/>
          <Row icon="🚪" label="Log Out"         sub="Sign out of your VI account"        onClick={handleLogout} danger/>
        </div>

        {/* App info */}
        <div style={{ textAlign:'center', padding:'20px 0', color:C.subtle, fontSize:12 }}>
          <div>VI — Vita Intelligence v1.0</div>
          <div style={{ marginTop:4 }}>Made with ❤️ for men's wellness in India</div>
          <div style={{ marginTop:8, display:'flex', justifyContent:'center', gap:16 }}>
            <span style={{ color:C.gold, cursor:'pointer' }}>Privacy Policy</span>
            <span style={{ color:C.gold, cursor:'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </div>
  )
}
