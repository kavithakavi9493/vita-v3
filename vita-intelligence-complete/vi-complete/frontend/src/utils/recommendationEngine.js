// VI Recommendation Engine
// VitaScore → Product Count → Body Type → Personalised Stack

export const BODY_TYPES = {
  HIGH_STRESS: {
    id:'HIGH_STRESS', label:'High Stress / Low Vitality', icon:'🧠',
    color:'#DC2626', bgColor:'#FEF2F2', borderColor:'#FECACA',
    shortDesc:'Chronic stress is draining your life force',
    description:'Your nervous system is in overdrive. Elevated cortisol is directly suppressing testosterone and depleting your vital Ojas (life force). This is the most urgent pattern to address.',
    coreIssues:['Cortisol overload','Testosterone suppression','Chronic fatigue','Sleep disruption'],
    solutions:['Adaptogenic herbs to calm HPA axis','Night recovery formula to rebuild Ojas','Testosterone-restoring stack'],
    productIds:[4,6,1,5,7,9], urgency:'HIGH', rootCauses:['STRESS','LIFESTYLE'],
  },
  HORMONAL_DECLINE: {
    id:'HORMONAL_DECLINE', label:'Hormonal Decline', icon:'⚗️',
    color:'#7C3AED', bgColor:'#F5F3FF', borderColor:'#DDD6FE',
    shortDesc:'Your hormonal system needs targeted support',
    description:'Your body\'s hormonal production is running below optimal. This creates a cascade — low libido, reduced performance, and depleted energy. Correctable with precision Ayurvedic formulation.',
    coreIssues:['Low testosterone','Reduced libido','Hormonal imbalance','Performance decline'],
    solutions:['Testosterone-building botanicals','Reproductive vitality stack','Libido-restoring herbs'],
    productIds:[1,9,10,5,6,7], urgency:'HIGH', rootCauses:['HORMONES','NUTRITION'],
  },
  PERFORMANCE_DEFICIT: {
    id:'PERFORMANCE_DEFICIT', label:'Performance Deficit', icon:'⚡',
    color:'#D97706', bgColor:'#FFFBEB', borderColor:'#FDE68A',
    shortDesc:'Performance issues affecting confidence & relationship',
    description:'Your vascular function and neuromuscular coordination need targeted support. This is the most directly treatable type — the ancient Siddha masters had precise formulas for exactly this.',
    coreIssues:['Timing control','Erection strength','Stamina','Low confidence'],
    solutions:['Sthambhan (control) herbs','Vascular & blood flow support','Performance oils'],
    productIds:[2,3,7,1,5,4], urgency:'HIGH', rootCauses:['PERFORMANCE','LIFESTYLE'],
  },
  AGE_RELATED: {
    id:'AGE_RELATED', label:'Age-Related Decline', icon:'🕐',
    color:'#1E3A5F', bgColor:'#EEF2F8', borderColor:'#BFDBFE',
    shortDesc:'Natural testosterone decline accelerating after 35',
    description:'After 35, testosterone drops 3–5% every year. Without targeted support this compounds into fatigue, performance decline, and reduced vitality. Ancient Rasayana protocols exist for exactly this stage.',
    coreIssues:['3–5% annual testosterone drop','Slower recovery','Reduced drive','Compound decline'],
    solutions:['Age-specific Rasayana formulas','Testosterone restoration stack','Reproductive vitality support'],
    productIds:[8,1,10,6,11,9], urgency:'CRITICAL', rootCauses:['AGING','HORMONES'],
  },
  PEAK_PERFORMANCE: {
    id:'PEAK_PERFORMANCE', label:'Optimisation Mode', icon:'🏆',
    color:'#15803D', bgColor:'#F0FDF4', borderColor:'#BBF7D0',
    shortDesc:'Strong foundation — push to peak performance',
    description:'Your vitality foundation is solid. A precision VI stack will push you from good to extraordinary — maximising energy, performance, and drive to levels most men never experience.',
    coreIssues:['Performance plateau','Untapped potential','Optimisation','Peak maintenance'],
    solutions:['Precision performance stack','Pre-intimacy formula','Recovery optimisation'],
    productIds:[1,5,7,4,6,10], urgency:'MODERATE', rootCauses:['NUTRITION','LIFESTYLE'],
  },
}

export const ROOT_CAUSE_META = {
  STRESS:      { label:'Stress',      icon:'🧠', color:'#DC2626' },
  LIFESTYLE:   { label:'Lifestyle',   icon:'🌙', color:'#D97706' },
  HORMONES:    { label:'Hormones',    icon:'⚗️', color:'#7C3AED' },
  NUTRITION:   { label:'Nutrition',   icon:'🥗', color:'#15803D' },
  PERFORMANCE: { label:'Performance', icon:'⚡', color:'#D97706' },
  AGING:       { label:'Aging',       icon:'🕐', color:'#1E3A5F' },
}

export function detectBodyType(state) {
  const { mentalScore, lifestyleScore, physicalScore, performanceScore,
    ageGroup, vitaScore, stressLevel, anxietyLevel, fatigueLevel,
    libidoLevel, timingControl, erectionQuality } = state

  if (ageGroup === '36-45' || ageGroup === '45+') return BODY_TYPES.AGE_RELATED

  const stressScore = [
    mentalScore < 10, lifestyleScore < 10,
    stressLevel === 'High', anxietyLevel === 'Often', fatigueLevel === 'Frequently',
  ].filter(Boolean).length
  if (stressScore >= 3) return BODY_TYPES.HIGH_STRESS

  const perfScore = [
    performanceScore < 10,
    timingControl === 'Often' || timingControl === 'Sometimes',
    erectionQuality === 'Weak' || erectionQuality === 'Moderate',
  ].filter(Boolean).length
  if (perfScore >= 2) return BODY_TYPES.PERFORMANCE_DEFICIT

  const hormScore = [
    physicalScore < 10, libidoLevel === 'Low',
    vitaScore < 55, mentalScore < 12 && performanceScore < 12,
  ].filter(Boolean).length
  if (hormScore >= 2) return BODY_TYPES.HORMONAL_DECLINE

  return BODY_TYPES.PEAK_PERFORMANCE
}

// Score → product count
export function getProductCountByScore(vitaScore) {
  if (vitaScore < 50) return 4
  if (vitaScore <= 80) return 3
  return 1
}

// Kit price based on product count
export const KIT_PRICES = {
  4: { price:3999, original:5999, label:'4-Product Protocol' },
  3: { price:2999, original:4499, label:'3-Product Stack' },
  1: { price:1499, original:1999, label:'1-Product Formula' },
}
