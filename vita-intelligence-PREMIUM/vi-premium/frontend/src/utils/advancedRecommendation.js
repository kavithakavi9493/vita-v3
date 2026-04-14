// ─────────────────────────────────────────────────────────────────────────────
// VI ADVANCED RECOMMENDATION ENGINE
// Multi-condition analysis → priority protocol → personalised kit
// ─────────────────────────────────────────────────────────────────────────────
import { CONDITIONS, CONDITION_META } from './quizEngine'

// ── Product → Condition mapping with effectiveness scores ─────────────────────
const PRODUCT_CONDITION_MAP = {
  1:  { TESTOSTERONE_DEFICIENCY:95, AGE_RELATED_ANDROPAUSE:90, CORTISOL_OVERLOAD:40 },
  2:  { PERFORMANCE_ANXIETY:85, VASCULAR_DYSFUNCTION:70 },
  3:  { VASCULAR_DYSFUNCTION:95, TESTOSTERONE_DEFICIENCY:50 },
  4:  { CORTISOL_OVERLOAD:95, NEUROTRANSMITTER_DEFICIT:80, SLEEP_HORMONE_DISRUPTION:70, PERFORMANCE_ANXIETY:60 },
  5:  { NEUROTRANSMITTER_DEFICIT:90, TESTOSTERONE_DEFICIENCY:60, PERFORMANCE_ANXIETY:50 },
  6:  { SLEEP_HORMONE_DISRUPTION:95, CORTISOL_OVERLOAD:70, TESTOSTERONE_DEFICIENCY:40 },
  7:  { VASCULAR_DYSFUNCTION:85, PERFORMANCE_ANXIETY:40 },
  8:  { AGE_RELATED_ANDROPAUSE:95, TESTOSTERONE_DEFICIENCY:80 },
  9:  { NEUROTRANSMITTER_DEFICIT:85, TESTOSTERONE_DEFICIENCY:70, PERFORMANCE_ANXIETY:40 },
  10: { GUT_ABSORPTION_ISSUE:90, TESTOSTERONE_DEFICIENCY:50 },
  11: { TESTOSTERONE_DEFICIENCY:100, AGE_RELATED_ANDROPAUSE:100, CORTISOL_OVERLOAD:70, VASCULAR_DYSFUNCTION:70 },
}

// ── Product labels ─────────────────────────────────────────────────────────────
export const PRODUCT_LABELS = {
  1:  { mustHave: true,  tag: 'FOUNDATION',  priority: 1 },
  2:  { mustHave: false, tag: 'CONTROL',     priority: 6 },
  3:  { mustHave: false, tag: 'VASCULAR',    priority: 5 },
  4:  { mustHave: false, tag: 'CALM',        priority: 4 },
  5:  { mustHave: false, tag: 'IGNITION',    priority: 7 },
  6:  { mustHave: false, tag: 'RECOVERY',    priority: 3 },
  7:  { mustHave: false, tag: 'TOPICAL',     priority: 8 },
  8:  { mustHave: true,  tag: 'AGE-DEFENCE', priority: 2 },
  9:  { mustHave: false, tag: 'DESIRE',      priority: 6 },
  10: { mustHave: false, tag: 'ABSORPTION',  priority: 9 },
  11: { mustHave: true,  tag: 'ULTRA',       priority: 1 },
}

// ── Protocol intensity based on severity ──────────────────────────────────────
export const PROTOCOL_INTENSITY = {
  CRITICAL: { count: 4, durationMonths: 3, label: 'Intensive Protocol',  color: '#DC2626' },
  HIGH:     { count: 3, durationMonths: 2, label: 'Targeted Protocol',   color: '#D97706' },
  MODERATE: { count: 2, durationMonths: 1, label: 'Precision Protocol',  color: '#0891B2' },
  LOW:      { count: 1, durationMonths: 1, label: 'Optimisation Stack',  color: '#15803D' },
}

// ── Kit pricing ────────────────────────────────────────────────────────────────
export const KIT_PRICING = {
  4: { price: 3999, original: 6599, label: '4-Formula Intensive Kit',   saving: 2600 },
  3: { price: 2999, original: 4999, label: '3-Formula Targeted Kit',    saving: 2000 },
  2: { price: 2199, original: 3499, label: '2-Formula Precision Kit',   saving: 1300 },
  1: { price: 1499, original: 1999, label: '1-Formula Optimisation Kit',saving:  500 },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN RECOMMENDATION FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
export function buildProtocol(diagnosisResult, allProducts) {
  const { conditions, severity, vitaScore, primaryCondition } = diagnosisResult

  // Step 1: Determine protocol intensity
  const intensity = PROTOCOL_INTENSITY[severity] || PROTOCOL_INTENSITY.MODERATE
  const productCount = getProductCountByVitaScore(vitaScore)

  // Step 2: Score each product against ALL detected conditions
  const productScores = allProducts.map(product => {
    const conditionMap = PRODUCT_CONDITION_MAP[product.id] || {}
    let totalScore = 0
    let matchedConditions = []

    conditions.forEach(({ condition, score: condScore }) => {
      const effectiveness = conditionMap[condition] || 0
      if (effectiveness > 0) {
        totalScore += effectiveness * (condScore / 100)
        matchedConditions.push({ condition, effectiveness })
      }
    })

    // Bonus for "MUST HAVE" products
    const label = PRODUCT_LABELS[product.id]
    if (label?.mustHave) totalScore *= 1.4

    return {
      ...product,
      relevanceScore:    Math.round(totalScore),
      matchedConditions,
      isMustHave:        label?.mustHave || false,
      tag:               label?.tag || 'FORMULA',
    }
  })

  // Step 3: Sort by relevance score
  const ranked = productScores.sort((a, b) => b.relevanceScore - a.relevanceScore)

  // Step 4: Always include #1 ranked "MUST HAVE" at top, then fill by score
  const mustHaves  = ranked.filter(p => p.isMustHave).slice(0, 1)
  const others     = ranked.filter(p => !p.isMustHave)
  const combined   = [...mustHaves, ...others]
  const deduplicated = combined.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)
  const selected   = deduplicated.slice(0, productCount)

  // Step 5: Build protocol schedule
  const schedule = buildSchedule(selected)

  // Step 6: Build transformation timeline
  const timeline = buildTimeline(severity, primaryCondition)

  // Step 7: Kit pricing
  const pricing = KIT_PRICING[productCount] || KIT_PRICING[3]

  return {
    products:      selected,
    productCount,
    intensity,
    schedule,
    timeline,
    pricing,
    totalMRP:      selected.reduce((s, p) => s + p.mrp, 0),
    conditionsCovered: [...new Set(selected.flatMap(p => Object.keys(PRODUCT_CONDITION_MAP[p.id] || {})))].length,
  }
}

// ── Score → product count ──────────────────────────────────────────────────────
export function getProductCountByVitaScore(vitaScore) {
  if (vitaScore < 40) return 4
  if (vitaScore < 60) return 3
  if (vitaScore < 80) return 2
  return 1
}

// ── Daily schedule builder ─────────────────────────────────────────────────────
function buildSchedule(products) {
  const slots = { morning: [], preActivity: [], afternoon: [], night: [] }
  products.forEach(p => {
    if (p.timing?.includes('Morning'))    slots.morning.push(p)
    if (p.timing?.includes('Pre-Activity')) slots.preActivity.push(p)
    if (p.timing?.includes('Night'))      slots.night.push(p)
  })
  return [
    { time: '7:00 – 8:00 AM',  label: 'Morning',      icon: '🌅', products: slots.morning     },
    { time: '30 min before',   label: 'Pre-Activity',  icon: '🎯', products: slots.preActivity },
    { time: '9:00 – 10:00 PM', label: 'Night',         icon: '🌙', products: slots.night       },
  ].filter(slot => slot.products.length > 0)
}

// ── Transformation timeline builder ───────────────────────────────────────────
function buildTimeline(severity, primaryCondition) {
  const conditionId = primaryCondition?.condition

  const timelines = {
    TESTOSTERONE_DEFICIENCY: [
      { day: 'Day 1–7',   icon: '🌱', label: 'Absorption Phase',      desc: 'Herbs begin absorbing. Ojas (life force) starts rebuilding at the cellular level.' },
      { day: 'Day 8–14',  icon: '⚡', label: 'Energy Shift',           desc: 'Noticeable increase in morning energy. Waking up feeling more refreshed.' },
      { day: 'Day 15–21', icon: '🔥', label: 'Drive Returning',        desc: 'Libido and motivation start returning. Noticeable improvement in spontaneous desire.' },
      { day: 'Day 22–30', icon: '💪', label: 'Performance Improving',  desc: 'Physical performance visibly improving. Confidence rebuilding naturally.' },
      { day: 'Day 60',    icon: '🏆', label: 'Hormonal Reset Complete',desc: 'Testosterone levels measurably improved. Full vitality protocol achieved.' },
    ],
    CORTISOL_OVERLOAD: [
      { day: 'Day 1–3',   icon: '🌊', label: 'Calming Begins',         desc: 'Ashwagandha starts calming the HPA axis. First signs of reduced mental noise.' },
      { day: 'Day 7',     icon: '😴', label: 'Sleep Deepening',        desc: 'Sleep quality visibly improving. Waking up less during the night.' },
      { day: 'Day 14',    icon: '🧠', label: 'Cortisol Dropping',      desc: 'Stress response becoming more proportional. Less reactive to triggers.' },
      { day: 'Day 21',    icon: '⚡', label: 'Energy Rebounding',      desc: 'Energy levels rising as cortisol stops suppressing testosterone.' },
      { day: 'Day 30',    icon: '🏆', label: 'Full Hormonal Balance',  desc: 'Cortisol-testosterone balance restored. Performance and drive returning.' },
    ],
    VASCULAR_DYSFUNCTION: [
      { day: 'Day 1',     icon: '🌱', label: 'Circulation Improving',  desc: 'Nirgundi and Gokshura begin improving nitric oxide production immediately.' },
      { day: 'Day 7',     icon: '💧', label: 'Blood Flow Increasing',  desc: 'Noticeable improvement in circulation and sensitivity.' },
      { day: 'Day 14',    icon: '🔥', label: 'Quality Improving',      desc: 'Significant improvement in erection quality and duration.' },
      { day: 'Day 21',    icon: '💪', label: 'Stamina Building',       desc: 'Endurance and control noticeably improved.' },
      { day: 'Day 30',    icon: '🏆', label: 'Full Vascular Health',   desc: 'Complete vascular restoration achieved.' },
    ],
    default: [
      { day: 'Day 1–7',   icon: '🌱', label: 'Protocol Activated',    desc: 'Ayurvedic herbs begin their deep absorption. Foundation building begins.' },
      { day: 'Day 14',    icon: '⚡', label: 'First Changes',          desc: 'Energy and mood shifts become noticeable.' },
      { day: 'Day 21',    icon: '🔥', label: 'Real Momentum',          desc: 'Performance and confidence visibly improving.' },
      { day: 'Day 30',    icon: '💪', label: 'Strong Foundation',      desc: 'First month complete. Solid progress established.' },
      { day: 'Day 90',    icon: '🏆', label: 'Complete Transformation',desc: 'Full protocol achieved. Lasting change at hormonal level.' },
    ],
  }

  return timelines[conditionId] || timelines.default
}

// ── Body type helper (backwards compat) ───────────────────────────────────────
// Use recommendationEngine.js for detectBodyType, getProductCountByScore, etc.
