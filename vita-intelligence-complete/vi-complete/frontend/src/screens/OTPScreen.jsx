import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useApp } from '../context/AppContext'
import { GoldBtn, Toast } from '../components/UI'
import { G } from '../constants/colors'

export default function OTPScreen() {
  const navigate = useNavigate()
  const { state, update } = useApp()
  const [otp, setOtp] = useState(['','','','','',''])
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const refs = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()]

  useEffect(() => {
    if (timer > 0) { const t = setTimeout(() => setTimer(v=>v-1),1000); return ()=>clearTimeout(t) }
    else setCanResend(true)
  }, [timer])

  const handleDigit = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next)
    if (val && i < 5) refs[i+1].current?.focus()
  }
  const handleKey = (i,e) => { if (e.key==='Backspace' && !otp[i] && i>0) refs[i-1].current?.focus() }
  const handlePaste = e => {
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    if (p.length===6) { setOtp(p.split('')); refs[5].current?.focus() }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) return
    setLoading(true)
    try {
      const result = await window.confirmationResult.confirm(code)
      const uid = result.user.uid
      const userRef = doc(db,'users',uid)
      const existing = await getDoc(userRef)
      await setDoc(userRef,{
        name: state.userName||'', phone: state.phone||'', email: state.email||'',
        updatedAt: serverTimestamp(),
        createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
      }, { merge:true })
      const quizSnap = await getDoc(doc(db,'quizResults',uid))
      update({ userId:uid, isLoggedIn:true, hasCompletedQuiz:quizSnap.exists() })
      if (quizSnap.exists()) {
        const d = quizSnap.data()
        update({ vitaScore:d.vitaScore||0, lifestyleScore:d.lifestyleScore||0, physicalScore:d.physicalScore||0, mentalScore:d.mentalScore||0, performanceScore:d.performanceScore||0, ageGroup:d.ageGroup||'', bodyTypeId:d.bodyTypeId||'' })
        navigate('/dashboard', { replace:true })
      } else {
        navigate('/age-group', { replace:true })
      }
    } catch(err) {
      setToast({ msg:'Invalid OTP. Please try again.', type:'error' })
      setOtp(['','','','','','']); refs[0].current?.focus()
    } finally { setLoading(false) }
  }

  const full = otp.every(d => d !== '')

  return (
    <div style={{ width:'100%', height:'100%', background:G.hero, overflowY:'auto' }}>
      <div style={{ padding:'52px 24px 0' }}>
        <button onClick={()=>navigate('/signup')} style={{ background:'rgba(255,255,255,.1)', border:'none', borderRadius:10, width:36, height:36, color:'#fff', fontSize:18, cursor:'pointer' }}>←</button>
      </div>
      <div style={{ padding:'32px 24px', textAlign:'center' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(255,215,0,.15)', border:'2px solid rgba(255,215,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:30 }}>🔒</div>
        <div style={{ color:'#fff', fontSize:22, fontWeight:800, marginBottom:6 }}>OTP Verification</div>
        <div style={{ color:'rgba(255,255,255,.6)', fontSize:14, marginBottom:4 }}>We sent a 6-digit code to</div>
        <div style={{ color:'#FFD700', fontSize:16, fontWeight:700, marginBottom:36 }}>+91 {state.phone}</div>
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:36 }} onPaste={handlePaste}>
          {otp.map((d,i) => (
            <input key={i} ref={refs[i]} type="tel" value={d} maxLength={1}
              onChange={e=>handleDigit(i,e.target.value)} onKeyDown={e=>handleKey(i,e)}
              style={{ width:46, height:58, background:d?'rgba(255,215,0,.12)':'rgba(255,255,255,.07)', border:`2px solid ${d?'#FFD700':'rgba(255,255,255,.2)'}`, borderRadius:14, color:'#fff', fontSize:24, fontWeight:800, textAlign:'center', outline:'none' }}/>
          ))}
        </div>
        <GoldBtn onClick={handleVerify} disabled={!full||loading} height={56}>
          {loading ? '⏳ Verifying...' : 'Verify & Continue →'}
        </GoldBtn>
        <div style={{ marginTop:20, color:'rgba(255,255,255,.55)', fontSize:14 }}>
          {canResend
            ? <span onClick={()=>{setTimer(30);setCanResend(false);navigate('/signup')}} style={{ color:'#FFD700', cursor:'pointer', fontWeight:700 }}>Resend OTP</span>
            : <>Resend code in <span style={{ color:'#FFD700' }}>{timer}s</span></>
          }
        </div>
        <div onClick={()=>navigate('/signup')} style={{ marginTop:12, color:'rgba(255,255,255,.4)', fontSize:13, cursor:'pointer' }}>Wrong number? <span style={{ color:'#FFD700' }}>Change it</span></div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  )
}
