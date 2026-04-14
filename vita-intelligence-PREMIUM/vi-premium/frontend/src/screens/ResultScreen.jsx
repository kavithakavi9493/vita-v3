import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ScreenWrapper } from '../components/UI'
import { C, G } from '../constants/colors'
import { runDiagnosis, getPersonalisedInsight, CONDITION_META } from '../utils/quizEngine'

function AnimatedScore({ target }) {
  const [cur, setCur] = useState(0)
  useEffect(() => {
    let v = 0; const step = target / 80
    const t = setInterval(() => { v = Math.min(v + step, target); setCur(Math.floor(v)); if (v >= target) clearInterval(t) }, 20)
    return () => clearInterval(t)
  }, [target])
  return <span>{cur}</span>
}

function ScoreArc({ score }) {
  const [anim, setAnim] = useState(0)
  const size = 190, sw = 13, r = (size - sw) / 2
  const circ = 2 * Math.PI * r, arc = circ * 0.75, start = circ * 0.125, fill = arc * (anim / 100)
  const col = score < 40 ? '#DC2626' : score < 60 ? '#D97706' : score < 80 ? '#0891B2' : '#15803D'
  useEffect(() => { const t = setTimeout(() => { let v = 0; const i = setInterval(() => { v = Math.min(v+1, score); setAnim(v); if(v>=score)clearInterval(i) }, 18); return () => clearInterval(i) }, 400); return () => clearTimeout(t) }, [score])
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(135deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={sw} strokeDasharray={`${arc} ${circ}`} strokeDashoffset={-start} strokeLinecap="round"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={`${fill} ${circ}`} strokeDashoffset={-start} strokeLinecap="round" style={{ filter:`drop-shadow(0 0 8px ${col}80)` }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color:'rgba(255,255,255,.5)', fontSize:10, fontWeight:700, letterSpacing:2 }}>VITASCORE</div>
        <div style={{ color:'#fff', fontSize:46, fontWeight:900, lineHeight:1 }}><AnimatedScore target={score}/></div>
        <div style={{ color:'rgba(255,255,255,.45)', fontSize:12 }}>/100</div>
      </div>
    </div>
  )
}

function ConditionCard({ condition, score, severity, index }) {
  const [vis, setVis] = useState(false)
  const meta = CONDITION_META[condition]; if (!meta) return null
  useEffect(() => { const t = setTimeout(() => setVis(true), index * 180 + 500); return () => clearTimeout(t) }, [])
  const cfgs = { CRITICAL:{ label:'🔴 Critical', bg:'#FEF2F2', border:'#FECACA', bar:'#DC2626' }, HIGH:{ label:'🟠 High', bg:'#FFFBEB', border:'#FDE68A', bar:'#D97706' }, MODERATE:{ label:'🟡 Moderate', bg:'#EFF6FF', border:'#BFDBFE', bar:'#0891B2' } }
  const cfg = cfgs[severity] || cfgs.MODERATE
  return (
    <div style={{ background:cfg.bg, border:`1.5px solid ${cfg.border}`, borderRadius:18, padding:16, marginBottom:12, borderLeft:`4px solid ${meta.color}`, opacity:vis?1:0, transform:vis?'translateY(0)':'translateY(20px)', transition:'all .4s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:`${meta.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{meta.icon}</div>
          <div>
            <div style={{ color:meta.color, fontSize:10, fontWeight:700, letterSpacing:.8 }}>DETECTED CONDITION</div>
            <div style={{ color:C.text, fontSize:14, fontWeight:800 }}>{meta.label}</div>
          </div>
        </div>
        <div style={{ background:meta.color, borderRadius:20, padding:'3px 10px', color:'#fff', fontSize:10, fontWeight:700, flexShrink:0 }}>{cfg.label}</div>
      </div>
      <div style={{ height:5, background:'rgba(0,0,0,.08)', borderRadius:3, marginBottom:10 }}><div style={{ height:'100%', width:`${score}%`, background:cfg.bar, borderRadius:3, transition:'width 1s ease .5s' }}/></div>
      <div style={{ color:C.muted, fontSize:12, lineHeight:1.6, marginBottom:10 }}>{meta.description}</div>
      <div style={{ background:`${meta.color}10`, border:`1px solid ${meta.color}25`, borderRadius:10, padding:'8px 12px' }}>
        <div style={{ color:meta.color, fontSize:11, fontWeight:700 }}>🔬 Clinical Note</div>
        <div style={{ color:C.text, fontSize:11, marginTop:3, lineHeight:1.5 }}>{meta.clinicalNote}</div>
      </div>
      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:10 }}>
        {meta.affectedSystems.map(s => <div key={s} style={{ background:'#fff', border:`1px solid ${meta.color}30`, borderRadius:20, padding:'2px 8px', color:meta.color, fontSize:10, fontWeight:600 }}>{s}</div>)}
      </div>
    </div>
  )
}

const TESTIMONIALS = [
  { name:'Rahul M.', age:34, city:'Mumbai', score:'42→81', quote:'I had the same conditions detected. After 60 days on VI, my wife noticed the change before I did.' },
  { name:'Vikram S.', age:38, city:'Bangalore', score:'38→74', quote:'The cortisol pattern was me exactly. 3 weeks in and I was sleeping differently, feeling different.' },
  { name:'Arjun K.', age:29, city:'Delhi', score:'51→85', quote:'The quiz told me things my doctor never mentioned. Results speak for themselves.' },
]

function UrgencyBanner() {
  const [secs, setSecs] = useState(23*60+47)
  useEffect(() => { const t = setInterval(() => setSecs(s => Math.max(0,s-1)), 1000); return () => clearInterval(t) }, [])
  const mm = String(Math.floor(secs/60)).padStart(2,'0'), ss = String(secs%60).padStart(2,'0')
  return (
    <div style={{ background:'linear-gradient(135deg,#DC2626,#B91C1C)', borderRadius:14, padding:'12px 16px', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div><div style={{ color:'#fff', fontSize:13, fontWeight:700 }}>🔥 Only 12 kits left at this price</div><div style={{ color:'rgba(255,255,255,.7)', fontSize:11, marginTop:2 }}>Price resets in</div></div>
      <div style={{ background:'rgba(0,0,0,.3)', borderRadius:10, padding:'6px 14px', color:'#FFD700', fontSize:22, fontWeight:900, fontVariantNumeric:'tabular-nums' }}>{mm}:{ss}</div>
    </div>
  )
}

export default function ResultScreen() {
  const navigate = useNavigate()
  const { state, update } = useApp()
  const { userName, vitaScore, lifestyleScore, physicalScore, mentalScore, performanceScore, quizAnswers, ageGroup } = state
  const [showAll, setShowAll] = useState(false)
  const [tIdx, setTIdx] = useState(0)

  const diagnosis = runDiagnosis(quizAnswers || {}, ageGroup)
  const insight   = getPersonalisedInsight(diagnosis.conditions, userName)

  useEffect(() => {
    update({ vitaScore: diagnosis.vitaScore || vitaScore || 0, lifestyleScore: diagnosis.lifestyleScore || lifestyleScore || 0, physicalScore: diagnosis.physicalScore || physicalScore || 0, mentalScore: diagnosis.mentalScore || mentalScore || 0, performanceScore: diagnosis.performanceScore || performanceScore || 0, detectedConditions: diagnosis.conditions.map(c => c.condition), diagnosisSeverity: diagnosis.severity })
  }, [])

  useEffect(() => { const t = setInterval(() => setTIdx(i => (i+1)%TESTIMONIALS.length), 4000); return () => clearInterval(t) }, [])

  const score = diagnosis.vitaScore || vitaScore || 0
  const conditions = diagnosis.conditions || []
  const visibleConds = showAll ? conditions : conditions.slice(0,2)
  const scoreLbl = score>=80?{text:'Excellent Foundation',color:C.green}:score>=60?{text:'Moderate — Room to Grow',color:C.orange}:score>=40?{text:'Needs Attention',color:C.orange}:{text:'Urgent Action Required',color:C.red}
  const t = TESTIMONIALS[tIdx]

  return (
    <ScreenWrapper bg={C.bgMid}>
      {/* Hero */}
      <div style={{ background:G.hero, padding:'52px 20px 28px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:'rgba(255,215,0,.04)' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div><div style={{ color:'rgba(255,255,255,.55)', fontSize:13 }}>Hi {userName||'there'} 👋</div><div style={{ color:'#fff', fontSize:20, fontWeight:800, marginTop:2 }}>Your VI Diagnosis Report</div></div>
          <div style={{ width:44, height:44, borderRadius:'50%', background:G.gold, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18, fontWeight:700 }}>{(userName||'U')[0]}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <ScoreArc score={score}/>
          <div style={{ flex:1 }}>
            <div style={{ color:scoreLbl.color, fontSize:14, fontWeight:800, marginBottom:6 }}>{scoreLbl.text}</div>
            <div style={{ color:'rgba(255,255,255,.6)', fontSize:11, marginBottom:6 }}>{conditions.length} condition{conditions.length!==1?'s':''} detected</div>
            {conditions.slice(0,3).map(c => <div key={c.condition} style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}><div style={{ width:6, height:6, borderRadius:'50%', background:CONDITION_META[c.condition]?.color||C.gold, flexShrink:0 }}/><span style={{ color:'rgba(255,255,255,.75)', fontSize:12 }}>{CONDITION_META[c.condition]?.shortLabel||c.condition}</span></div>)}
            <div style={{ background:'rgba(255,215,0,.15)', border:'1px solid rgba(255,215,0,.3)', borderRadius:20, padding:'3px 12px', display:'inline-flex', color:'#FFD700', fontSize:11, fontWeight:700, marginTop:4 }}>
              {diagnosis.severity==='CRITICAL'?'🔴 Critical Priority':diagnosis.severity==='HIGH'?'🟠 High Priority':'🟡 Moderate'}
            </div>
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:14, padding:'12px 14px', marginTop:18 }}>
          <div style={{ color:'rgba(255,215,0,.9)', fontSize:12, marginBottom:4 }}>🤖 VI Intelligence Says</div>
          <div style={{ color:'rgba(255,255,255,.8)', fontSize:13, lineHeight:1.6 }}>{insight}</div>
        </div>
      </div>

      <div style={{ padding:'16px 16px 130px' }}>
        <UrgencyBanner/>

        {/* Conditions */}
        {conditions.length > 0 && <>
          <div style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:12 }}>🔍 Conditions Detected ({conditions.length})</div>
          {visibleConds.map((c,i) => <ConditionCard key={c.condition} {...c} index={i}/>)}
          {conditions.length > 2 && <div onClick={()=>setShowAll(s=>!s)} style={{ textAlign:'center', color:C.gold, fontSize:13, fontWeight:700, cursor:'pointer', padding:'8px 0', marginBottom:8 }}>{showAll?'▲ Show Less':`▼ Show ${conditions.length-2} More Conditions`}</div>}
        </>}

        {/* Score breakdown */}
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:16 }}>
          <div style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:4 }}>Score Breakdown</div>
          <div style={{ color:C.gold, fontSize:11, fontStyle:'italic', marginBottom:14 }}>VI Intelligence Diagnostic Report</div>
          {[{icon:'🌙',label:'Lifestyle',score:diagnosis.lifestyleScore||lifestyleScore||0,max:25},{icon:'💪',label:'Physical Health',score:diagnosis.physicalScore||physicalScore||0,max:25},{icon:'🧠',label:'Mental Wellness',score:diagnosis.mentalScore||mentalScore||0,max:25},{icon:'❤️',label:'Intimate Health',score:diagnosis.performanceScore||performanceScore||0,max:25}].map(b => {
            const pct=(b.score/b.max)*100, col=pct<40?C.red:pct<65?C.orange:C.green
            return <div key={b.label} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><div style={{ display:'flex', gap:8, alignItems:'center' }}><span>{b.icon}</span><span style={{ color:C.text, fontSize:14 }}>{b.label}</span></div><span style={{ color:col, fontWeight:700 }}>{b.score}<span style={{ color:C.muted, fontWeight:400 }}>/{b.max}</span></span></div>
              <div style={{ height:6, background:C.border, borderRadius:3 }}><div style={{ height:'100%', width:`${pct}%`, background:col, borderRadius:3, transition:'width 1.2s ease' }}/></div>
            </div>
          })}
        </div>

        {/* Before/After */}
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:16 }}>
          <div style={{ color:C.text, fontSize:15, fontWeight:700, marginBottom:14 }}>📊 Where You Are vs Where You'll Be</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:14, padding:12 }}>
              <div style={{ color:C.red, fontSize:11, fontWeight:700, marginBottom:8 }}>❌ RIGHT NOW</div>
              {['Low energy daily','Performance anxiety','Confidence drop','Poor recovery'].map((i,idx)=><div key={idx} style={{ color:C.muted, fontSize:12, marginBottom:5 }}>• {i}</div>)}
            </div>
            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:14, padding:12 }}>
              <div style={{ color:C.green, fontSize:11, fontWeight:700, marginBottom:8 }}>✅ AFTER VI PROTOCOL</div>
              {['Peak daily energy','Confident performance','Strong drive daily','Deep recovery sleep'].map((o,idx)=><div key={idx} style={{ color:C.text, fontSize:12, marginBottom:5, fontWeight:500 }}>• {o}</div>)}
            </div>
          </div>
        </div>

        {/* Testimonial carousel */}
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ display:'flex' }}>{'ABCDE'.split('').map((l,i)=><div key={i} style={{ width:30,height:30,borderRadius:'50%',background:G.gold,border:'2px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:700,marginLeft:i>0?-8:0,zIndex:5-i }}>{l}</div>)}<div style={{ width:30,height:30,borderRadius:'50%',background:C.goldBg,border:`2px solid ${C.goldBorder}`,display:'flex',alignItems:'center',justifyContent:'center',color:C.gold,fontSize:8,fontWeight:700,marginLeft:-8 }}>+10K</div></div>
            <div><div style={{ color:C.text, fontSize:13, fontWeight:700 }}>10,000+ Men Reversed This</div><div style={{ color:C.gold, fontSize:11 }}>⭐⭐⭐⭐⭐ 4.9 · 3,241 reviews</div></div>
          </div>
          <div style={{ background:C.goldBg, border:`1px solid ${C.goldBorder}`, borderRadius:14, padding:14 }}>
            <div style={{ color:C.gold, fontSize:12, marginBottom:6 }}>⭐⭐⭐⭐⭐</div>
            <div style={{ color:C.text, fontSize:13, fontStyle:'italic', lineHeight:1.6, marginBottom:10 }}>"{t.quote}"</div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ width:34,height:34,borderRadius:'50%',background:G.gold,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700 }}>{t.name[0]}</div>
              <div><div style={{ color:C.text, fontSize:13, fontWeight:600 }}>{t.name}</div><div style={{ color:C.muted, fontSize:11 }}>{t.city} · Age {t.age} · VitaScore {t.score}</div></div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:12 }}>
            {TESTIMONIALS.map((_,i)=><div key={i} onClick={()=>setTIdx(i)} style={{ width:i===tIdx?20:6, height:6, borderRadius:3, background:i===tIdx?C.gold:C.border, cursor:'pointer', transition:'all .3s' }}/>)}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', justifyContent:'space-around', background:'#fff', borderRadius:16, padding:'16px 8px', marginBottom:16, border:`1px solid ${C.border}` }}>
          {[{v:'10,000+',l:'Men Helped'},{v:'94%',l:'Success Rate'},{v:'4.9★',l:'Avg Rating'},{v:'30-day',l:'Results'}].map(s=><div key={s.l} style={{ textAlign:'center' }}><div style={{ color:C.gold, fontSize:15, fontWeight:800 }}>{s.v}</div><div style={{ color:C.muted, fontSize:10 }}>{s.l}</div></div>)}
        </div>

        {/* CTA */}
        <div style={{ background:G.hero, borderRadius:20, padding:20, marginBottom:12 }}>
          <div style={{ color:'rgba(255,215,0,.8)', fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:8 }}>🎯 VI RECOMMENDATION</div>
          <div style={{ color:'#fff', fontSize:17, fontWeight:800, marginBottom:4 }}>{conditions.length>0?`${conditions.length}-Condition Protocol Required`:'Precision Optimisation Protocol'}</div>
          <div style={{ color:'rgba(255,255,255,.6)', fontSize:13, marginBottom:14 }}>Based on your VitaScore {score} and {conditions.length} detected conditions</div>
          <GoldBtn onClick={() => navigate('/root-cause')} height={52}>See Your Personalised Kit →</GoldBtn>
        </div>
        <div onClick={() => navigate('/plan')} style={{ textAlign:'center', color:C.muted, fontSize:13, cursor:'pointer', padding:8 }}>Skip directly to my kit →</div>
      </div>
    </ScreenWrapper>
  )
}
