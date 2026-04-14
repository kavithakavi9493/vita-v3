import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, FocusInput, ScreenWrapper, BottomBar, Toast } from '../components/UI'
import { C, G } from '../constants/colors'

const INDIAN_STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal']

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  )
}

export default function CheckoutScreen() {
  const navigate  = useNavigate()
  const { state, update } = useApp()
  const { selectedAmount, planType, vitaScore, userName, phone } = state

  const [addr, setAddr] = useState({
    name: userName || '', phone: phone || '',
    line1: '', line2: '', city: '', state: '', pincode: '',
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)

  const setField = (k, v) => setAddr(a => ({ ...a, [k]: v }))

  const validate = () => {
    if (!addr.name || !addr.phone || addr.phone.length < 10 || !addr.line1 || !addr.city || !addr.state || addr.pincode.length < 6) {
      setToast({ msg: 'Please fill all required fields correctly.', type: 'error' })
      return false
    }
    return true
  }

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

  const handlePay = async () => {
    if (!validate()) return
    setLoading(true)
    update({ address: addr })

    const ok = await loadRazorpay()
    if (!ok) { setToast({ msg: 'Payment gateway failed to load. Check your connection.', type: 'error' }); setLoading(false); return }

    const options = {
      key:         import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount:      (selectedAmount || 2999) * 100,
      currency:    'INR',
      name:        'VI — Vita Intelligence',
      description: `${planType || 'VI'} Plan — VitaScore ${vitaScore}`,
      prefill:     { name: addr.name, contact: `+91${addr.phone}` },
      notes:       { planType, vitaScore, address: `${addr.line1}, ${addr.city}` },
      theme:       { color: '#C9962C' },
      handler:     (response) => {
        update({
          hasPurchased:   true,
          orderDate:      new Date().toISOString(),
          paymentId:      response.razorpay_payment_id,
          address:        addr,
        })
        navigate('/success', { replace: true })
      },
      modal: { ondismiss: () => setLoading(false) },
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => navigate('/failure'))
      rzp.open()
    } catch (e) {
      setToast({ msg: 'Payment error. Please try again.', type: 'error' })
      setLoading(false)
    }
  }

  const amt    = selectedAmount || 2999
  const saving = Math.round(amt * 0.33)

  return (
    <ScreenWrapper bg="#F0EAE0">
      {/* Header */}
      <div style={{ background: G.hero, padding: '52px 20px 20px' }}>
        <div style={{ color: 'rgba(255,215,0,.8)', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>SECURE CHECKOUT</div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>Almost there!</div>
        <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, marginTop: 4 }}>Enter delivery details to complete your order</div>
      </div>

      <div style={{ padding: '20px 20px 140px' }}>
        {/* Order summary */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 16, padding: '14px 18px', marginBottom: 20 }}>
          <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🛍️ Order Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: C.muted, fontSize: 13 }}>VI Personalised Kit · VitaScore {vitaScore}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <div>
              <div style={{ color: C.green, fontSize: 12, fontWeight: 600 }}>You save ₹{saving.toLocaleString()}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>🚚 Free home delivery included</div>
            </div>
            <div style={{ color: C.text, fontSize: 22, fontWeight: 900 }}>₹{amt.toLocaleString()}</div>
          </div>
        </div>

        {/* Address form */}
        <div style={{ background: '#fff', borderRadius: 18, padding: 18, border: `1px solid ${C.border}`, marginBottom: 16 }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📦 Delivery Address</div>

          <Field label="Full Name *">
            <FocusInput value={addr.name} onChange={v => setField('name', v)} placeholder="Your full name"/>
          </Field>
          <Field label="Mobile Number *">
            <FocusInput value={addr.phone} onChange={v => setField('phone', v.replace(/\D/g,'').slice(0,10))} placeholder="10-digit mobile" prefix="+91"/>
          </Field>
          <Field label="Address Line 1 *">
            <FocusInput value={addr.line1} onChange={v => setField('line1', v)} placeholder="House / Flat No., Street, Area"/>
          </Field>
          <Field label="Address Line 2">
            <FocusInput value={addr.line2} onChange={v => setField('line2', v)} placeholder="Landmark (optional)"/>
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="City *">
              <FocusInput value={addr.city} onChange={v => setField('city', v)} placeholder="City"/>
            </Field>
            <Field label="Pincode *">
              <FocusInput value={addr.pincode} onChange={v => setField('pincode', v.replace(/\D/g,'').slice(0,6))} placeholder="6-digit"/>
            </Field>
          </div>
          <Field label="State *">
            <div style={{ background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 12, height: 54, overflow: 'hidden' }}>
              <select value={addr.state} onChange={e => setField('state', e.target.value)}
                style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', color: C.text, fontSize: 14, padding: '0 16px', outline: 'none' }}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </Field>
        </div>

        {/* Trust signals */}
        <div style={{ display: 'flex', justifyContent: 'space-around', background: '#fff', borderRadius: 14, padding: '14px 8px', border: `1px solid ${C.border}` }}>
          {['🔒 256-bit SSL', '✅ FSSAI Certified', '🚚 Free Delivery', '↩️ 30-day Policy'].map(t => (
            <div key={t} style={{ color: C.muted, fontSize: 10, textAlign: 'center', fontWeight: 600 }}>{t}</div>
          ))}
        </div>
      </div>

      <BottomBar>
        <GoldBtn onClick={handlePay} disabled={loading} height={58} style={{ fontSize: 17 }}>
          {loading ? '⏳ Opening Payment...' : `🔒 Pay ₹${amt.toLocaleString()} Securely →`}
        </GoldBtn>
        <div style={{ textAlign: 'center', color: C.muted, fontSize: 11, marginTop: 8 }}>Powered by Razorpay · UPI / Cards / Net Banking accepted</div>
      </BottomBar>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
    </ScreenWrapper>
  )
}
