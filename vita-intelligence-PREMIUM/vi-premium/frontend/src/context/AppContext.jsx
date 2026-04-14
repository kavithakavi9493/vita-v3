import { createContext, useContext, useState, useEffect } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const Ctx = createContext(null)

const DEFAULT = {
  // Auth
  userId:null, userName:'', phone:'', email:'',
  isLoggedIn:false, hasCompletedQuiz:false, hasPurchased:false,
  // Quiz
  ageGroup:'', quizAnswers:{},
  // Derived
  stressLevel:'', anxietyLevel:'', focusLevel:'',
  libidoLevel:'', timingControl:'', erectionQuality:'', fatigueLevel:'',
  // Scores
  lifestyleScore:0, physicalScore:0, mentalScore:0, performanceScore:0, vitaScore:0,
  // Body type
  bodyTypeId:'', recommendedPlan:'',
  // Purchase
  planType:'advanced', selectedAmount:2999,
  orderDate:null, orderIds:[],
  // Address
  address:{ name:'', phone:'', line1:'', line2:'', city:'', state:'', pincode:'' },
}

async function fsSet(path, data) {
  try { await setDoc(doc(db, ...path.split('/')), { ...data, updatedAt:serverTimestamp() }, { merge:true }) }
  catch(e) { console.warn('Firestore skipped:', e.message) }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const s = localStorage.getItem('vi_state')
      return s ? { ...DEFAULT, ...JSON.parse(s) } : DEFAULT
    } catch { return DEFAULT }
  })

  useEffect(() => {
    try { localStorage.setItem('vi_state', JSON.stringify(state)) } catch {}
  }, [state])

  const update = (patch) => {
    setState(prev => {
      const next = { ...prev, ...patch }
      // Persist quiz completion
      if (next.userId && patch.vitaScore !== undefined) {
        fsSet(`quizResults/${next.userId}`, {
          userId:next.userId, vitaScore:next.vitaScore,
          lifestyleScore:next.lifestyleScore, physicalScore:next.physicalScore,
          mentalScore:next.mentalScore, performanceScore:next.performanceScore,
          ageGroup:next.ageGroup, bodyTypeId:next.bodyTypeId,
          hasCompletedQuiz:true,
        })
      }
      // Persist order
      if (next.userId && patch.hasPurchased === true) {
        const orderId = `VI${Date.now()}`
        const ids = [...(prev.orderIds||[]), orderId]
        fsSet(`orders/${orderId}`, {
          userId:next.userId, orderId, planType:next.planType,
          amount:next.selectedAmount, vitaScore:next.vitaScore,
          address:next.address, status:'placed',
        })
        fsSet(`users/${next.userId}`, { hasPurchased:true, lastOrderId:orderId })
        return { ...next, orderIds:ids }
      }
      return next
    })
  }

  const reset = () => {
    localStorage.removeItem('vi_state')
    setState(DEFAULT)
  }

  return <Ctx.Provider value={{ state, update, reset }}>{children}</Ctx.Provider>
}

export const useApp = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp outside AppProvider')
  return c
}
