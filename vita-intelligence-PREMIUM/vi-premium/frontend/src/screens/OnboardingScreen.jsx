import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, G } from '../constants/colors'

const SLIDES = [
  {
    icon: '🔬',
    gradient: 'linear-gradient(160deg, #1A0E00 0%, #3D2400 100%)',
    accent: '#FFD700',
    headline: 'India\'s First AI-Powered\nSexual Wellness Platform',
    sub: 'We combine ancient Ayurvedic wisdom with modern AI to find the exact root cause of your concerns — not just guess.',
    points: ['30-question clinical assessment', 'AI-powered root cause detection', 'Personalised product protocol'],
  },
  {
    icon: '🎯',
    gradient: 'linear-gradient(160deg, #0D3320 0%, #15803D 100%)',
    accent: '#86EFAC',
    headline: 'Your Kit. Built\nFor You Alone.',
    sub: 'No two men are the same. Your VitaScore determines exactly which Ayurvedic formulas you need — and how many.',
    points: ['VitaScore < 50 → 4-formula protocol', 'VitaScore 50–80 → 3-formula stack', 'VitaScore > 80 → 1 precision formula'],
  },
  {
    icon: '📈',
    gradient: 'linear-gradient(160deg, #1E1A5F 0%, #3730A3 100%)',
    accent: '#A5B4FC',
    headline: 'Real Results.\nTrack Every Step.',
    sub: 'Your dashboard tracks your daily routine, monthly progress, and connects you to an expert VI Coach — always.',
    points: ['Daily routine checklist', 'Monthly progress tracking', 'WhatsApp expert coach support'],
  },
]

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const slide = SLIDES[current]

  const next = () => {
    if (animating) return
    if (current < SLIDES.length - 1) {
      setAnimating(true)
      setTimeout(() => { setCurrent(c => c + 1); setAnimating(false) }, 200)
    } else {
      navigate('/signup')
    }
  }

  const skip = () => navigate('/signup')

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: slide.gradient, transition: 'background 0.5s ease', overflow: 'hidden', position: 'relative' }}>

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', top: 40, right: 20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', bottom: 200, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      {/* Skip */}
      <div style={{ padding: '50px 24px 0', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
        <div onClick={skip} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20 }}>
          Skip →
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '30px 28px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 10, opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease' }}>

        {/* Icon */}
        <div style={{ width: 90, height: 90, borderRadius: 28, background: `rgba(255,255,255,0.12)`, border: `2px solid rgba(255,255,255,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, marginBottom: 30, backdropFilter: 'blur(10px)' }}>
          {slide.icon}
        </div>

        {/* Headline */}
        <div style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 900, lineHeight: 1.25, marginBottom: 16, whiteSpace: 'pre-line' }}>
          {slide.headline}
        </div>

        {/* Sub */}
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.65, marginBottom: 28 }}>
          {slide.sub}
        </div>

        {/* Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slide.points.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: slide.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#000', fontSize: 12, fontWeight: 800 }}>✓</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: '24px 28px 44px', position: 'relative', zIndex: 10 }}>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => !animating && setCurrent(i)}
              style={{
                height: 6, borderRadius: 3,
                width: i === current ? 28 : 8,
                background: i === current ? slide.accent : 'rgba(255,255,255,0.25)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          style={{
            width: '100%', border: 'none', borderRadius: 18,
            background: slide.accent,
            color: '#000000', fontSize: 17, fontWeight: 800,
            padding: '18px 0', cursor: 'pointer',
            boxShadow: `0 8px 32px ${slide.accent}50`,
          }}>
          {current < SLIDES.length - 1 ? 'Continue →' : 'Take the Free Test →'}
        </button>

        {/* Legal */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 12 }}>
          Free · Takes 4 minutes · 100% confidential
        </div>
      </div>
    </div>
  )
}
