import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ScreenWrapper } from '../components/UI'
import { C, G } from '../constants/colors'
import {
  detectBodyType,
  getProductCountByScore,
  ROOT_CAUSE_META,
} from '../utils/recommendationEngine'

// ── All products (single source of truth for this screen) ─
const ALL_PRODUCTS = [
  {
    id: 1, icon: '💊',
    brand: 'Vajra Veerya', hindi: 'वज्र वीर्य',
    cat: 'Testosterone Boost', tag: 'MUST HAVE',
    mrp: 1199, price: 849,
    benefits: ['Testosterone Rise', 'Energy Surge', 'Muscle Strength'],
    ingredients: 'Ashwagandha, Shilajit, Safed Musli, Gokshura, Kapikacchu',
    usage: '2 capsules daily after breakfast',
    rating: 4.9, reviews: 3241,
  },
  {
    id: 2, icon: '⏱️',
    brand: 'Sthambhan Shakti', hindi: 'स्थम्भन शक्ति',
    cat: 'Timing Control', tag: 'AYURVEDA',
    mrp: 999, price: 699,
    benefits: ['Better Control', 'Longer Duration', 'Confidence'],
    ingredients: 'Jaiphal, Akarkara, Vidari Kanda, Ashwagandha, Shatavari',
    usage: '2 capsules 1 hour before activity',
    rating: 4.8, reviews: 2847,
  },
  {
    id: 3, icon: '🔥',
    brand: 'Dridha Stambh', hindi: 'दृढ स्तम्भ',
    cat: 'Erection Support', tag: 'AYURVEDA',
    mrp: 1099, price: 779,
    benefits: ['Stronger Erection', 'Blood Flow', 'Vascular Health'],
    ingredients: 'Vidarikanda, Kaunch Beej, Gokshura, Swarna Bhasma, Shilajit',
    usage: '2 capsules after dinner with warm milk',
    rating: 4.8, reviews: 2103,
  },
  {
    id: 4, icon: '🧠',
    brand: 'Manas Veerya', hindi: 'मनस् वीर्य',
    cat: 'Stress & Calm', tag: 'AYURVEDA',
    mrp: 899, price: 649,
    benefits: ['Calm Mind', 'Cortisol Control', 'Focus & Sleep'],
    ingredients: 'Brahmi, Ashwagandha, Jatamansi, L-Theanine, Magnesium',
    usage: '1 capsule morning + 1 at night',
    rating: 4.8, reviews: 1654,
  },
  {
    id: 5, icon: '⚡',
    brand: 'Kaam Agni Ras', hindi: 'काम अग्नि रस',
    cat: 'Pre-Intimacy Shots', tag: 'MUST HAVE',
    mrp: 1499, price: 999,
    benefits: ['Instant Ignition', 'Fast Absorb', 'Passion Boost'],
    ingredients: 'Saffron, Shilajit Extract, Zinc, Ginseng, Vitamin B12, Honey Base',
    usage: '1 shot 30 minutes before activity',
    rating: 4.9, reviews: 3102,
  },
  {
    id: 6, icon: '🌿',
    brand: 'Rasayana Shakti', hindi: 'रसायन शक्ति',
    cat: 'Night Recovery', tag: 'AYURVEDA',
    mrp: 1099, price: 799,
    benefits: ['Deep Sleep', 'Hormone Repair', 'Morning Energy'],
    ingredients: 'Magnesium Glycinate, Tart Cherry, L-Glycine, Zinc, Ashwagandha, Melatonin 0.5mg',
    usage: '1 scoop in warm water before bed',
    rating: 4.7, reviews: 1287,
  },
  {
    id: 7, icon: '🛢️',
    brand: 'Vajra Tailam', hindi: 'वज्र तैलम्',
    cat: 'Performance Oil', tag: 'AYURVEDA',
    mrp: 799, price: 549,
    benefits: ['Fast Absorption', 'Blood Flow', 'Enhanced Sensitivity'],
    ingredients: 'Nirgundi Oil, Akarkara, Clove Extract, Sesame Base, Camphor',
    usage: 'Apply gently 15 minutes before activity',
    rating: 4.7, reviews: 1923,
  },
  {
    id: 8, icon: '💪',
    brand: 'Yuva Vajra', hindi: 'युवा वज्र',
    cat: '30+ Performance', tag: 'MUST HAVE',
    mrp: 1299, price: 949,
    benefits: ['Age Reversal Formula', 'Testosterone Restore', 'Energy & Drive'],
    ingredients: 'Shilajit Resin, Safed Musli, Ashwagandha, Shatavari, Swarna Makshik Bhasma',
    usage: '2 capsules morning with warm milk',
    rating: 4.9, reviews: 2567,
  },
  {
    id: 9, icon: '🔥',
    brand: 'Kaam Veerya', hindi: 'काम वीर्य',
    cat: 'Libido Boost', tag: 'AYURVEDA',
    mrp: 999, price: 729,
    benefits: ['Reignite Desire', 'Hormonal Balance', 'Vitality'],
    ingredients: 'Kapikacchu, Shatavari, Gokshura, Safed Musli, Ras Sindoor, Clove',
    usage: '2 capsules after dinner',
    rating: 4.8, reviews: 2198,
  },
  {
    id: 10, icon: '🧬',
    brand: 'Beej Shakti', hindi: 'बीज शक्ति',
    cat: 'Sperm Health', tag: 'AYURVEDA',
    mrp: 1199, price: 849,
    benefits: ['Sperm Count', 'Motility', 'Reproductive Vitality'],
    ingredients: 'Ashwagandha, Shatavari, Kapikacchu, Zinc, Selenium, Gokshura, Vidarikanda',
    usage: '2 capsules daily after breakfast',
    rating: 4.7, reviews: 1432,
  },
  {
    id: 11, icon: '👑',
    brand: 'Maha Vajra', hindi: 'महावज्र',
    cat: 'Ultra Performance', tag: 'MUST HAVE',
    mrp: 1999, price: 1499,
    benefits: ['Maximum Potency Formula', 'All-in-one Power', 'Premium Results'],
    ingredients: 'Shilajit Resin 500mg, Swarna Bhasma, Ashwagandha KSM-66, Safed Musli, Gokshura, Kapikacchu, Saffron',
    usage: '1 capsule morning + 1 at night with warm milk',
    rating: 5.0, reviews: 987,
  },
]

// ── Kit price (plan price covering the kit + service) ─────
const KIT_PRICES = {
  4: { price: 3999, original: 5999, duration: '1 Month' },
  3: { price: 2999, original: 4499, duration: '1 Month' },
  1: { price: 1499, original: 1999, duration: '1 Month' },
}

// ── Score label helper ────────────────────────────────────
function scoreLabel(vitaScore) {
  if (vitaScore < 50) return { text: 'Needs Urgent Attention', color: C.red }
  if (vitaScore <= 80) return { text: 'Moderate — Room to Grow', color: C.orange }
  return { text: 'Excellent Foundation', color: C.green }
}

// ── Coach banner ──────────────────────────────────────────
function CoachBanner() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #2D7A4F 0%, #1A5C38 100%)', padding: '20px 20px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circle */}
      <div style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', right: 30, top: 10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 800, lineHeight: 1.3, marginBottom: 4 }}>
          Doubts? Talk to a<br />VI Expert for <span style={{ color: '#A8F0C6' }}>FREE</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 16 }}>
          Get 100% clarity before you start
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => window.open('tel:+918000000000', '_self')}
            style={{ background: '#FFFFFF', border: 'none', borderRadius: 12, padding: '10px 18px', color: '#1A5C38', fontSize: 13, fontWeight: 700, cursor: 'pointer', flex: 1 }}>
            📞 Book Free Call
          </button>
          <button
            onClick={() => window.open('https://wa.me/918000000000', '_blank')}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 12, padding: '10px 18px', color: '#FFFFFF', fontSize: 13, fontWeight: 700, cursor: 'pointer', flex: 1 }}>
            💬 Chat With Us
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Root Cause Chip ───────────────────────────────────────
function RootCauseChip({ causeKey }) {
  const meta = ROOT_CAUSE_META[causeKey]
  if (!meta) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 70 }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        border: `2px solid ${meta.color}30`,
        background: `${meta.color}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>
        {meta.icon}
      </div>
      <span style={{ color: meta.color, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {meta.label}
      </span>
    </div>
  )
}

// ── Product Card (Traya-style horizontal card) ────────────
function ProductCard({ product, isMustHave }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: `1.5px solid ${isMustHave ? C.goldBorder : C.border}`,
      borderRadius: 18, padding: 16, marginBottom: 14,
      boxShadow: isMustHave ? '0 4px 16px rgba(185,129,26,0.12)' : '0 2px 10px rgba(0,0,0,0.06)',
      position: 'relative',
    }}>
      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <div style={{
          background: C.goldBg, border: `1px solid ${C.goldBorder}`,
          borderRadius: 20, padding: '3px 10px',
          color: C.gold, fontSize: 10, fontWeight: 700,
        }}>
          🌿 Ayurveda
        </div>
        {isMustHave && (
          <div style={{
            background: '#FEF3C7', border: '1px solid #FCD34D',
            borderRadius: 20, padding: '3px 10px',
            color: '#92400E', fontSize: 10, fontWeight: 700,
          }}>
            ⭐ Must Have
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Product visual */}
        <div style={{
          width: 80, height: 100, flexShrink: 0,
          background: `linear-gradient(160deg, ${C.bgMid}, ${C.goldBg})`,
          borderRadius: 14, border: `1px solid ${C.goldBorder}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 4,
        }}>
          <span style={{ fontSize: 32 }}>{product.icon}</span>
          <span style={{ color: C.gold, fontSize: 8, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, padding: '0 4px' }}>
            VI Formula
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 800, marginBottom: 2 }}>{product.brand}</div>
          <div style={{ color: C.gold, fontSize: 11, fontStyle: 'italic', marginBottom: 8 }}>{product.hindi}</div>

          {/* Benefits */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            {product.benefits.slice(0, 2).map(b => (
              <div key={b} style={{
                background: '#F0FDF4', border: '1px solid #86EFAC',
                borderRadius: 20, padding: '2px 8px',
                color: '#15803D', fontSize: 10, fontWeight: 600,
              }}>{b}</div>
            ))}
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ color: '#F59E0B', fontSize: 12 }}>{'★'.repeat(Math.floor(product.rating))}</span>
            <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>{product.rating}</span>
            <span style={{ color: C.muted, fontSize: 11 }}>({product.reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: C.subtle, fontSize: 12, textDecoration: 'line-through' }}>₹{product.mrp}</span>
            <span style={{ color: C.text, fontSize: 17, fontWeight: 800 }}>₹{product.price}</span>
            <span style={{ background: '#FEF2F2', color: C.red, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
              Save ₹{product.mrp - product.price}
            </span>
          </div>
        </div>
      </div>

      {/* Usage hint */}
      <div style={{ marginTop: 12, background: C.bgMid, borderRadius: 10, padding: '8px 12px' }}>
        <span style={{ color: C.muted, fontSize: 11 }}>📋 <b style={{ color: C.text }}>Usage:</b> {product.usage}</span>
      </div>
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────
export default function PlanScreen() {
  const navigate  = useNavigate()
  const { state, update } = useApp()
  const { vitaScore, userName, bodyTypeId } = state

  const bodyType     = detectBodyType(state)
  const productCount = getProductCountByScore(vitaScore || 0)
  const kit          = KIT_PRICES[productCount] || KIT_PRICES[3]

  // Build product list from bodyType productIds
  const products = bodyType.productIds
    .slice(0, productCount)
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter(Boolean)

  const sl  = scoreLabel(vitaScore || 0)
  const totalMrp   = products.reduce((s, p) => s + p.mrp, 0)
  const saving     = totalMrp - kit.price

  // Persist plan choice to context (no plan type — score-based)
  useEffect(() => {
    if (bodyType?.id) {
      update({
        bodyTypeId:      bodyType.id,
        recommendedPlan: 'score_based',
        planType:        productCount <= 1 ? 'basic' : productCount <= 3 ? 'advanced' : 'premium',
        selectedAmount:  kit.price,
      })
    }
  }, [])

  return (
    <ScreenWrapper bg={C.bgMid}>
      {/* ── Top Coach Banner ── */}
      <CoachBanner />

      <div style={{ padding: '0 0 130px' }}>

        {/* ── Personalised Greeting Card ── */}
        <div style={{
          background: '#FFFFFF',
          margin: '0 16px',
          marginTop: -14,
          borderRadius: 20,
          padding: '20px 20px 16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{ color: C.text, fontSize: 20, fontWeight: 800, marginBottom: 2 }}>
            Hi {userName || 'there'} 👋
          </div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>
            Here's what your VI analysis says:
          </div>

          {/* VitaScore pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${sl.color}12`, border: `1px solid ${sl.color}30`,
            borderRadius: 12, padding: '8px 14px', marginBottom: 16,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: G.hero,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFD700', fontSize: 13, fontWeight: 800,
            }}>
              {vitaScore}
            </div>
            <div>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>VitaScore</div>
              <div style={{ color: sl.color, fontSize: 11, fontWeight: 600 }}>{sl.text}</div>
            </div>
          </div>

          {/* Root Causes section */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 800 }}>Your Root Causes</div>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {bodyType.rootCauses.map(c => (
                <RootCauseChip key={c} causeKey={c} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Body Type Badge ── */}
        <div style={{
          margin: '14px 16px 0',
          background: bodyType.bgColor,
          border: `1.5px solid ${bodyType.borderColor}`,
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderLeft: `4px solid ${bodyType.color}`,
        }}>
          <span style={{ fontSize: 24 }}>{bodyType.icon}</span>
          <div>
            <div style={{ color: bodyType.color, fontSize: 10, fontWeight: 700, letterSpacing: 0.8 }}>
              YOUR BODY TYPE
            </div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{bodyType.label}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{bodyType.shortDesc}</div>
          </div>
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <div style={{
              background: bodyType.color, borderRadius: 20, padding: '4px 10px',
              color: '#fff', fontSize: 10, fontWeight: 700,
            }}>
              {bodyType.urgency === 'CRITICAL' ? '🔴 Critical' : bodyType.urgency === 'HIGH' ? '🟠 High' : '🟢 Moderate'}
            </div>
          </div>
        </div>

        {/* ── Kit Heading ── */}
        <div style={{ padding: '20px 16px 12px' }}>
          <div style={{ color: C.text, fontSize: 20, fontWeight: 800 }}>
            {kit.duration} Customised Kit
            <span style={{ color: C.gold }}> — ({productCount} product{productCount > 1 ? 's' : ''})</span>
          </div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            🤖 AI-matched to your VitaScore {vitaScore} · Free home delivery included
          </div>
        </div>

        {/* ── Product Cards ── */}
        <div style={{ padding: '0 16px' }}>
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              isMustHave={i === 0 || p.tag === 'MUST HAVE'}
            />
          ))}
        </div>

        {/* ── Bundle Summary ── */}
        <div style={{
          margin: '4px 16px 16px',
          background: G.hero,
          borderRadius: 18, padding: 18,
          boxShadow: '0 4px 20px rgba(26,14,0,0.18)',
        }}>
          <div style={{ color: 'rgba(255,215,0,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
            📦 YOUR COMPLETE VI KIT
          </div>
          {products.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{p.icon} {p.brand}</span>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textDecoration: 'line-through', marginRight: 6 }}>₹{p.mrp}</span>
                <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>₹{p.price}</span>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>You save</div>
              <div style={{ color: '#A8F0C6', fontSize: 14, fontWeight: 700 }}>₹{saving.toLocaleString()} ({Math.round((saving / totalMrp) * 100)}% OFF)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'line-through' }}>₹{kit.original.toLocaleString()}</div>
              <div style={{ color: '#FFD700', fontSize: 26, fontWeight: 900 }}>₹{kit.price.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 6 }}>🚚 Free Home Delivery · 🔒 Secure Checkout</div>
        </div>

        {/* ── Social Proof Strip ── */}
        <div style={{
          margin: '0 16px 16px',
          background: '#FFFFFF',
          border: `1px solid ${C.border}`,
          borderRadius: 14, padding: '14px 16px',
          display: 'flex', justifyContent: 'space-around',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        }}>
          {[{ v: '10K+', l: 'Men Helped' }, { v: '94%', l: 'Success Rate' }, { v: '4.9★', l: 'Avg Rating' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ color: C.gold, fontSize: 18, fontWeight: 800 }}>{s.v}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── Results Promise ── */}
        <div style={{ margin: '0 16px 16px', background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>⏱️ What to Expect</div>
          {[
            { t: '15 Days', d: 'First noticeable energy improvement' },
            { t: '1 Month', d: 'Visible confidence & performance boost' },
            { t: '3 Months', d: 'Complete transformation — full protocol' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: i < 2 ? 8 : 0 }}>
              <div style={{ background: G.gold, color: '#FFFFFF', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {item.t}
              </div>
              <div style={{ color: C.text, fontSize: 12 }}>{item.d}</div>
            </div>
          ))}
        </div>

        {/* ── Certifications ── */}
        <div style={{ margin: '0 16px', display: 'flex', justifyContent: 'space-around', background: '#FFFFFF', borderRadius: 14, padding: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          {['FSSAI\nCertified', 'Lab\nTested', '100%\nNatural', 'Ancient\nFormula'].map(t => (
            <div key={t} style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.goldBg, border: `1.5px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: 16 }}>✅</div>
              <div style={{ color: C.muted, fontSize: 9, whiteSpace: 'pre-line', fontWeight: 600 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky Buy Now Bar ── */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'rgba(255,255,255,0.97)',
        borderTop: `1px solid ${C.border}`,
        backdropFilter: 'blur(16px)',
        padding: '12px 16px 16px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ color: C.muted, fontSize: 12 }}>
              Your Customised {productCount}-Product Kit
            </div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 800 }}>
              Is Ready
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: C.subtle, fontSize: 12, textDecoration: 'line-through' }}>₹{kit.original.toLocaleString()}</div>
            <div style={{ color: '#A8F0C6', background: '#15803D', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, display: 'inline-block' }}>
              {Math.round((saving / kit.original) * 100)}% OFF
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/social-proof')}
          style={{
            width: '100%', border: 'none', borderRadius: 16,
            background: '#5A9E6F',
            color: '#FFFFFF', fontSize: 17, fontWeight: 800,
            padding: '16px 0', cursor: 'pointer',
            letterSpacing: 0.5,
            boxShadow: '0 4px 16px rgba(90,158,111,0.35)',
          }}>
          Buy Now — ₹{kit.price.toLocaleString()} →
        </button>
        <div style={{ textAlign: 'center', color: C.muted, fontSize: 11, marginTop: 8 }}>
          🔒 Secure payment via Razorpay · Free home delivery
        </div>
      </div>
    </ScreenWrapper>
  )
}
