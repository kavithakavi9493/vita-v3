import { useState, useEffect } from 'react'
import { C, G } from '../constants/colors'

export function GoldBtn({ children, onClick, disabled=false, outline=false, height=56, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:'100%', height, borderRadius:14, border: outline ? `2px solid ${disabled?C.subtle:C.gold}` : 'none',
      background: disabled ? C.border : outline ? 'transparent' : G.gold,
      color: disabled ? C.subtle : outline ? C.gold : '#fff',
      fontWeight:700, fontSize:16, transition:'all .2s',
      boxShadow: (!disabled&&!outline) ? '0 4px 18px rgba(185,129,26,.3)' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer', ...style,
    }}>
      {children}
    </button>
  )
}

export function FocusInput({ value, onChange, placeholder, type='text', prefix, style={}, maxLength }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display:'flex', alignItems:'center', background:'#fff', borderRadius:12,
      border:`1.5px solid ${focused?C.gold:C.border}`, height:54, overflow:'hidden',
      boxShadow: focused ? `0 0 0 3px ${C.goldBg}` : 'none', ...style }}>
      {prefix && <div style={{ background:C.goldBg, padding:'0 14px', borderRight:`1px solid ${C.goldBorder}`, height:'100%', display:'flex', alignItems:'center', color:C.gold, fontSize:14, fontWeight:700 }}>{prefix}</div>}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e=>onChange(e.target.value)} maxLength={maxLength}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{ background:'transparent', border:'none', color:C.text, fontSize:15, padding:'0 16px', flex:1 }} />
    </div>
  )
}

export function ScoreRing({ score, size=160 }) {
  const [anim, setAnim] = useState(0)
  const r = (size-16)/2, circ = 2*Math.PI*r, offset = circ-(anim/100)*circ
  useEffect(()=>{
    let cur=0; const step=score/60
    const t = setInterval(()=>{ cur=Math.min(cur+step,score); setAnim(Math.round(cur)); if(cur>=score)clearInterval(t) },16)
    return ()=>clearInterval(t)
  },[score])
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={10}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.gold} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:'stroke-dashoffset .05s'}}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color:C.muted, fontSize:9, fontWeight:700, letterSpacing:2 }}>YOUR SCORE</div>
        <div style={{ color:C.text, fontSize:size*.22, fontWeight:800, lineHeight:1.1 }}>{anim}</div>
        <div style={{ color:C.muted, fontSize:12 }}>/100</div>
      </div>
    </div>
  )
}

export function ScreenWrapper({ children, bg=C.bgMid, style={} }) {
  return (
    <div style={{ width:'100%', height:'100%', background:bg, overflowY:'auto', overflowX:'hidden', ...style }}>
      {children}
    </div>
  )
}

export function BottomBar({ children }) {
  return (
    <div style={{ position:'sticky', bottom:0, padding:'14px 20px 20px',
      background:'rgba(255,255,255,.97)', borderTop:`1px solid ${C.border}`,
      backdropFilter:'blur(12px)', boxShadow:'0 -4px 20px rgba(0,0,0,.08)' }}>
      {children}
    </div>
  )
}

export function Card({ children, gold=false, style={} }) {
  return (
    <div style={{ background: gold?C.goldBg:'#fff', borderRadius:18,
      border:`1px solid ${gold?C.goldBorder:C.border}`, padding:18,
      boxShadow: gold?'0 2px 16px rgba(185,129,26,.1)':'0 2px 12px rgba(0,0,0,.06)', ...style }}>
      {children}
    </div>
  )
}

export function Toast({ msg, type='error', onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3000); return ()=>clearTimeout(t) },[onClose])
  return (
    <div className="fade-up" style={{ position:'fixed', bottom:90, left:'50%', transform:'translateX(-50%)',
      zIndex:999, width:'min(400px,calc(100vw - 32px))',
      background: type==='success'?'#F0FDF4':'#FEF2F2',
      border:`1px solid ${type==='success'?C.green:C.red}`,
      borderRadius:12, padding:'13px 18px',
      color: type==='success'?C.green:C.red,
      fontSize:14, fontWeight:500, boxShadow:'0 4px 20px rgba(0,0,0,.12)' }}>
      {msg}
    </div>
  )
}

export function Spinner({ size=32, color=C.gold }) {
  return <div className="spin" style={{ width:size, height:size, borderRadius:'50%', border:`3px solid ${C.border}`, borderTopColor:color }} />
}

export function VILogo({ size=60 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:G.hero,
      border:`2px solid ${C.goldDeep}`, display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:`0 0 ${size*.35}px rgba(185,129,26,.35)`, flexShrink:0 }}>
      <span style={{ color:'#FFD700', fontWeight:800, fontSize:size*.38, letterSpacing:2 }}>VI</span>
    </div>
  )
}
