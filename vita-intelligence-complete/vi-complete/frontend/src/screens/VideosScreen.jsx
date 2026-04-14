import { useState } from 'react'
import { C, G } from '../constants/colors'

const VIDEOS = [
  {
    id: 1, cat: 'Ayurveda',
    title: 'Why Shilajit is Called the Destroyer of Weakness',
    sub: 'Dr. Rahul Sharma · 8 min',
    icon: '🪨', color: '#7C3AED',
    desc: 'The ancient Himalayan resin that 3000 years of Ayurvedic medicine relied on for male vitality.',
    tags: ['Shilajit', 'Testosterone', 'Ayurveda'],
  },
  {
    id: 2, cat: 'Science',
    title: 'How Cortisol Destroys Testosterone — And How to Stop It',
    sub: 'VI Science Team · 11 min',
    icon: '🧠', color: '#DC2626',
    desc: 'The direct biological mechanism between stress hormones and sexual health — explained simply.',
    tags: ['Stress', 'Cortisol', 'Hormones'],
  },
  {
    id: 3, cat: 'Nutrition',
    title: '7 Foods That Naturally Boost Testosterone',
    sub: 'Nutritionist Priya K · 6 min',
    icon: '🥗', color: '#15803D',
    desc: 'The exact foods, portions, and timing that support your VI protocol and hormonal health.',
    tags: ['Diet', 'Nutrition', 'Natural'],
  },
  {
    id: 4, cat: 'Exercise',
    title: 'The 3 Exercises Proven to Increase Testosterone',
    sub: 'Fitness Coach Arjun · 9 min',
    icon: '🏋️', color: '#D97706',
    desc: 'Squat, deadlift, and sprint protocols that maximise testosterone production naturally.',
    tags: ['Exercise', 'Fitness', 'Testosterone'],
  },
  {
    id: 5, cat: 'Sleep',
    title: 'The Sleep Protocol for Peak Testosterone',
    sub: 'VI Expert · 7 min',
    icon: '🌙', color: '#0891B2',
    desc: '70% of testosterone is produced during specific sleep cycles. This protocol protects them.',
    tags: ['Sleep', 'Recovery', 'Hormones'],
  },
  {
    id: 6, cat: 'Mindset',
    title: 'Overcoming Performance Anxiety — A Clinical Guide',
    sub: 'Psychologist Dr. Mehta · 14 min',
    icon: '🧘', color: '#0D9488',
    desc: 'The psychological patterns that create performance anxiety and the techniques to break them permanently.',
    tags: ['Mindset', 'Anxiety', 'Confidence'],
  },
  {
    id: 7, cat: 'Ayurveda',
    title: 'Ashwagandha KSM-66 — What the Research Actually Shows',
    sub: 'VI Science Team · 10 min',
    icon: '🌿', color: '#15803D',
    desc: 'A deep dive into the 24 clinical trials on Ashwagandha KSM-66 and what they mean for you.',
    tags: ['Ashwagandha', 'Research', 'Ayurveda'],
  },
  {
    id: 8, cat: 'Relationships',
    title: 'How to Talk to Your Partner About These Concerns',
    sub: 'Relationship Coach · 12 min',
    icon: '👫', color: '#BE185D',
    desc: 'A compassionate guide to having the conversation — and strengthening your relationship through it.',
    tags: ['Relationship', 'Communication', 'Partner'],
  },
]

const CATS = ['All', 'Ayurveda', 'Science', 'Nutrition', 'Exercise', 'Sleep', 'Mindset', 'Relationships']

function VideoCard({ video }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* Thumbnail-style header */}
      <div style={{ background: `linear-gradient(135deg, ${video.color}20, ${video.color}10)`, border: `1px solid ${video.color}20`, padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${video.color}18`, border: `1.5px solid ${video.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
          {video.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ background: `${video.color}18`, borderRadius: 20, padding: '2px 8px', display: 'inline-block', color: video.color, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>
            {video.cat}
          </div>
          <div style={{ color: C.text, fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>{video.title}</div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{video.sub}</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: video.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
          onClick={() => setExpanded(e => !e)}>
          <span style={{ color: '#fff', fontSize: 14 }}>{expanded ? '▲' : '▶'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '14px 18px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{video.desc}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {video.tags.map(t => (
              <div key={t} style={{ background: C.bgMid, border: `1px solid ${C.border}`, borderRadius: 20, padding: '3px 10px', color: C.muted, fontSize: 11 }}>{t}</div>
            ))}
          </div>
          <div style={{ background: `${video.color}10`, border: `1px solid ${video.color}25`, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => alert('Video player coming soon! Available in the full app.')}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: video.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 14 }}>▶</span>
            </div>
            <div>
              <div style={{ color: video.color, fontSize: 13, fontWeight: 700 }}>Watch Now</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{video.sub}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VideosScreen() {
  const [selectedCat, setSelectedCat] = useState('All')

  const filtered = selectedCat === 'All' ? VIDEOS : VIDEOS.filter(v => v.cat === selectedCat)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bgMid, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ background: G.hero, padding: '50px 20px 20px', flexShrink: 0 }}>
        <div style={{ color: 'rgba(255,215,0,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>VI EDUCATION</div>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Expert Videos</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Science-backed content from VI experts</div>
      </div>

      {/* Category filter */}
      <div style={{ background: '#FFFFFF', borderBottom: `1px solid ${C.border}`, padding: '12px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px', scrollbarWidth: 'none' }}>
          {CATS.map(cat => (
            <div key={cat} onClick={() => setSelectedCat(cat)} style={{ background: selectedCat === cat ? G.gold : C.bgMid, border: `1px solid ${selectedCat === cat ? C.goldDeep : C.border}`, borderRadius: 20, padding: '6px 14px', color: selectedCat === cat ? '#FFFFFF' : C.muted, fontSize: 12, fontWeight: selectedCat === cat ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Video list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px' }}>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>{filtered.length} videos{selectedCat !== 'All' ? ` in ${selectedCat}` : ''}</div>
        {filtered.map(v => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  )
}
