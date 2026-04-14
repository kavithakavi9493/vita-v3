import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { C, G } from '../constants/colors'
import { ALL_PRODUCTS } from '../constants/products'
import { detectBodyType, getProductCountByScore } from '../utils/recommendationEngine'

// ── Today's Routine Checklist ─────────────────────────────
function DailyChecklist({ products, onCheck }) {
  const today = new Date().toDateString()
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`vi_checklist_${today}`) || '{}') } catch { return {} }
  })

  const toggle = (pid) => {
    const next = { ...checked, [pid]: !checked[pid] }
    setChecked(next)
    localStorage.setItem(`vi_checklist_${today}`, JSON.stringify(next))
  }

  const doneCount = Object.values(checked).filter(Boolean).length
  const pct = products.length > 0 ? Math.round((doneCount / products.length) * 100) : 0

  return (
    <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ background: G.hero, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ color: '#FFD700', fontSize: 14, fontWeight: 800 }}>📋 Today's Routine</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{doneCount}/{products.length} done</div>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#4ade80' : '#FFD700', borderRadius: 3, transition: 'width 0.5s ease' }} />
        </div>
        {pct === 100 && (
          <div style={{ color: '#4ade80', fontSize: 13, fontWeight: 700, marginTop: 8 }}>🎉 All done for today! Keep it up!</div>
        )}
      </div>

      {/* Items */}
      {products.map(p => (
        <div key={p.id} onClick={() => toggle(p.id)} style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: checked[p.id] ? '#F0FDF4' : '#FFFFFF', transition: 'background 0.2s' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${checked[p.id] ? C.green : C.border}`, background: checked[p.id] ? C.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
            {checked[p.id] && <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>✓</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: checked[p.id] ? C.muted : C.text, fontSize: 14, fontWeight: 600, textDecoration: checked[p.id] ? 'line-through' : 'none' }}>
                {p.timingIcon} {p.brand}
              </div>
              <div style={{ color: C.muted, fontSize: 11, background: C.bgMid, padding: '2px 8px', borderRadius: 20 }}>
                {p.timing}
              </div>
            </div>
            <div style={{ color: C.subtle, fontSize: 12, marginTop: 2 }}>{p.usage}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Product Detail Card ───────────────────────────────────
function ProductDetailCard({ product }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 20, marginBottom: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* Main row */}
      <div onClick={() => setExpanded(e => !e)} style={{ padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: `${product.color}15`, border: `1.5px solid ${product.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
          {product.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{product.brand}</div>
          <div style={{ color: product.color, fontSize: 11, marginTop: 2, fontStyle: 'italic' }}>{product.hindi}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <div style={{ background: `${product.color}15`, borderRadius: 20, padding: '2px 8px', color: product.color, fontSize: 10, fontWeight: 700 }}>
              {product.cat}
            </div>
            <div style={{ background: C.bgMid, borderRadius: 20, padding: '2px 8px', color: C.muted, fontSize: 10 }}>
              {product.form}
            </div>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 16 }}>{expanded ? '▲' : '▼'}</div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '16px 18px' }}>
          {/* How to take */}
          <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ color: C.gold, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📋 How to Take</div>
            <div style={{ color: C.text, fontSize: 13 }}>{product.usage}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>⏰ Best time: <b style={{ color: C.text }}>{product.timing}</b></div>
          </div>

          {/* Benefits */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✅ Benefits</div>
            {product.detailedBenefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ color: C.green, fontSize: 13, flexShrink: 0 }}>→</span>
                <span style={{ color: C.muted, fontSize: 13 }}>{b}</span>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div style={{ background: C.bgMid, borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
            <div style={{ color: C.text, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>🌿 Ingredients</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{product.ingredients}</div>
          </div>

          {/* Science note */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ color: '#1D4ED8', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>🔬 Science Note</div>
            <div style={{ color: '#1E40AF', fontSize: 12 }}>{product.scienceNote}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────
export default function MyKitScreen() {
  const { state } = useApp()
  const { vitaScore, userName, orderDate } = state

  const bodyType     = detectBodyType(state)
  const productCount = getProductCountByScore(vitaScore || 0)
  const products     = bodyType.productIds
    .slice(0, productCount)
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter(Boolean)

  // Calculate days on plan
  const daysOnPlan = orderDate
    ? Math.floor((Date.now() - new Date(orderDate)) / 86400000)
    : 0

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bgMid, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ background: G.hero, padding: '50px 20px 20px' }}>
        <div style={{ color: 'rgba(255,215,0,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
          YOUR CUSTOMISED VI KIT
        </div>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
          {productCount}-Product Protocol
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '6px 12px' }}>
            <div style={{ color: '#FFD700', fontSize: 16, fontWeight: 800 }}>{daysOnPlan}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Days on Plan</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '6px 12px' }}>
            <div style={{ color: '#FFD700', fontSize: 16, fontWeight: 800 }}>{productCount}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Formulas</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '6px 12px' }}>
            <div style={{ color: '#4ade80', fontSize: 16, fontWeight: 800 }}>Active</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Plan Status</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 100px' }}>

        {/* Today's Checklist */}
        <DailyChecklist products={products} />

        {/* Routine timing guide */}
        <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⏰ Daily Timing Guide</div>
          {[
            { time: 'Morning (7–9 AM)', icon: '🌅', products: products.filter(p => p.timing.includes('Morning')) },
            { time: 'Before Activity',  icon: '🎯', products: products.filter(p => p.timing.includes('Pre-Activity')) },
            { time: 'Night (9–11 PM)',  icon: '🌙', products: products.filter(p => p.timing.includes('Night')) },
          ].filter(t => t.products.length > 0).map((slot, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 5 }}>{slot.icon} {slot.time}</div>
              {slot.products.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bgMid, borderRadius: 10, padding: '6px 10px', marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{p.icon}</span>
                  <span style={{ color: C.text, fontSize: 13 }}>{p.brand}</span>
                  <span style={{ color: C.muted, fontSize: 11, marginLeft: 'auto' }}>{p.form.split(' · ')[0]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Product Cards */}
        <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Your Formulas — Tap to Learn More</div>
        {products.map(p => <ProductDetailCard key={p.id} product={p} />)}

        {/* Reorder */}
        <div style={{ background: G.hero, borderRadius: 16, padding: 18, marginBottom: 16 }}>
          <div style={{ color: '#FFD700', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>🔄 Need a Refill?</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 14 }}>
            Your {productCount}-product kit lasts 30 days. Order your next kit before Day 25 to avoid a gap in your protocol.
          </div>
          <div
            onClick={() => window.open('https://wa.me/918000000000?text=Hi%20VI%2C%20I%20want%20to%20reorder%20my%20kit', '_blank')}
            style={{ background: '#25D366', borderRadius: 12, padding: '12px 0', textAlign: 'center', color: '#FFFFFF', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            💬 WhatsApp to Reorder
          </div>
        </div>
      </div>
    </div>
  )
}
