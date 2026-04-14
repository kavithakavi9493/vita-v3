import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn } from '../components/UI'
import { C, G } from '../constants/colors'

export function SuccessScreen() {
  const navigate = useNavigate()
  const { state, update } = useApp()
  const { userName } = state
  const orderId = `VI${Date.now().toString().slice(-8)}`

  useEffect(() => {
    update({ hasPurchased:true, orderDate:new Date().toISOString(), orderIds:[...(state.orderIds||[]), orderId] })
    localStorage.setItem('vi_streak', String(parseInt(localStorage.getItem('vi_streak')||'0',10)+1))
    localStorage.setItem('vi_streak_date', new Date().toDateString())
  }, [])

  return (
    <div style={{ width:'100%', height:'100%', background:C.bgMid, overflowY:'auto' }}>
      <div style={{ background:G.hero, padding:'52px 20px 32px', textAlign:'center' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <div style={{ color:'#FFD700', fontSize:26, fontWeight:900, marginBottom:6 }}>Order Placed!</div>
        <div style={{ color:'rgba(255,255,255,.7)', fontSize:14 }}>Welcome to the VI family, {userName||'Champion'}!</div>
        <div style={{ display:'inline-flex', gap:8, background:'rgba(255,215,0,.12)', border:'1px solid rgba(255,215,0,.3)', borderRadius:20, padding:'6px 16px', marginTop:12 }}>
          <span style={{ color:'#FFD700', fontSize:13, fontWeight:700 }}>Order #{orderId}</span>
        </div>
      </div>
      <div style={{ padding:'20px 20px 40px' }}>
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:16, boxShadow:'0 2px 10px rgba(0,0,0,.06)' }}>
          <div style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:14 }}>What happens next?</div>
          {[
            { icon:'📞', text:'Your VI Expert Coach will call within 24 hours to guide you through your protocol' },
            { icon:'📦', text:'Your kit will be packed and shipped within 1–2 business days' },
            { icon:'🚚', text:'Delivery in 4–6 days with WhatsApp tracking updates' },
            { icon:'📱', text:'Access your dashboard now to prepare for your transformation' },
          ].map((s,i) => (
            <div key={i} style={{ display:'flex', gap:12, marginBottom:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:C.goldBg, border:`1px solid ${C.goldBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{s.icon}</div>
              <div style={{ color:C.text, fontSize:13, lineHeight:1.5, paddingTop:6 }}>{s.text}</div>
            </div>
          ))}
        </div>
        <div style={{ background:C.goldBg, border:`1px solid ${C.goldBorder}`, borderRadius:16, padding:16, marginBottom:20 }}>
          <div style={{ color:C.gold, fontSize:14, fontWeight:700, marginBottom:10 }}>📈 Results Timeline</div>
          {[['Day 15','First noticeable energy improvements'],['Day 30','Visible performance & confidence boost'],['Day 90','Complete transformation']].map(([day,label]) => (
            <div key={day} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
              <div style={{ background:G.gold, borderRadius:20, padding:'2px 10px', color:'#fff', fontSize:10, fontWeight:700, flexShrink:0 }}>{day}</div>
              <div style={{ color:C.text, fontSize:13 }}>{label}</div>
            </div>
          ))}
        </div>
        <GoldBtn onClick={() => navigate('/dashboard', { replace:true })} height={56}>Go to My VI Dashboard →</GoldBtn>
        <div onClick={() => window.open(`https://wa.me/918000000000?text=Hi VI! Order ${orderId}`, '_blank')}
          style={{ marginTop:12, textAlign:'center', color:'#25D366', fontSize:14, fontWeight:600, cursor:'pointer' }}>
          💬 WhatsApp Us Your Order ID
        </div>
      </div>
    </div>
  )
}

export function FailureScreen() {
  const navigate = useNavigate()
  return (
    <div style={{ width:'100%', height:'100%', background:C.bgMid, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>😔</div>
      <div style={{ color:C.text, fontSize:22, fontWeight:800, marginBottom:8 }}>Payment Failed</div>
      <div style={{ color:C.muted, fontSize:14, marginBottom:28, lineHeight:1.6 }}>No money was deducted. Please try again or contact support.</div>
      <div style={{ width:'100%' }}><GoldBtn onClick={() => navigate('/checkout')} height={52}>Try Again →</GoldBtn></div>
      <div onClick={() => window.open('https://wa.me/918000000000?text=Hi VI, payment failed', '_blank')}
        style={{ marginTop:16, color:'#25D366', fontSize:14, fontWeight:600, cursor:'pointer' }}>💬 Get Help on WhatsApp</div>
    </div>
  )
}
