// ─────────────────────────────────────────────────────────────────────────────
// VI ADVANCED QUIZ ENGINE
// Medical-style multi-condition diagnosis with severity scoring
// ─────────────────────────────────────────────────────────────────────────────

// ── Condition IDs ─────────────────────────────────────────────────────────────
export const CONDITIONS = {
  TESTOSTERONE_DEFICIENCY:  'TESTOSTERONE_DEFICIENCY',
  CORTISOL_OVERLOAD:        'CORTISOL_OVERLOAD',
  VASCULAR_DYSFUNCTION:     'VASCULAR_DYSFUNCTION',
  NEUROTRANSMITTER_DEFICIT: 'NEUROTRANSMITTER_DEFICIT',
  SLEEP_HORMONE_DISRUPTION: 'SLEEP_HORMONE_DISRUPTION',
  GUT_ABSORPTION_ISSUE:     'GUT_ABSORPTION_ISSUE',
  AGE_RELATED_ANDROPAUSE:   'AGE_RELATED_ANDROPAUSE',
  PERFORMANCE_ANXIETY:      'PERFORMANCE_ANXIETY',
}

// ── Severity levels ───────────────────────────────────────────────────────────
export const SEVERITY = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 }

// ── Condition metadata ────────────────────────────────────────────────────────
export const CONDITION_META = {
  TESTOSTERONE_DEFICIENCY: {
    label: 'Testosterone Deficiency',
    icon: '⚗️',
    color: '#7C3AED',
    shortLabel: 'Low T',
    description: 'Your testosterone production is running significantly below optimal levels. This single hormone governs energy, drive, performance, and confidence.',
    clinicalNote: 'Clinical threshold for low testosterone: <300 ng/dL. Symptoms appear at 400-500 ng/dL.',
    urgency: 'HIGH',
    affectedSystems: ['Libido', 'Energy', 'Muscle Mass', 'Mood', 'Performance'],
    productIds: [1, 8, 9],
  },
  CORTISOL_OVERLOAD: {
    label: 'Cortisol Overload',
    icon: '🧠',
    color: '#DC2626',
    shortLabel: 'High Cortisol',
    description: 'Chronic stress has elevated your cortisol to levels that directly suppress testosterone production. This is the silent destroyer of male vitality.',
    clinicalNote: 'Every 10% rise in cortisol causes a 7-15% drop in free testosterone within 48 hours.',
    urgency: 'CRITICAL',
    affectedSystems: ['Testosterone', 'Sleep', 'Anxiety', 'Performance', 'Recovery'],
    productIds: [4, 6, 1],
  },
  VASCULAR_DYSFUNCTION: {
    label: 'Vascular Dysfunction',
    icon: '🫀',
    color: '#DC2626',
    shortLabel: 'Blood Flow',
    description: 'Reduced nitric oxide production and vascular tone is restricting blood flow to where it matters. This is the direct physical cause of performance issues.',
    clinicalNote: '80% of performance issues have a vascular component that responds to natural treatment.',
    urgency: 'HIGH',
    affectedSystems: ['Erection Quality', 'Sensitivity', 'Stamina', 'Recovery'],
    productIds: [3, 7, 2],
  },
  NEUROTRANSMITTER_DEFICIT: {
    label: 'Dopamine/Serotonin Imbalance',
    icon: '⚡',
    color: '#0891B2',
    shortLabel: 'Neuro Deficit',
    description: 'Low dopamine and serotonin levels are reducing desire, motivation, and pleasure response. This creates a cycle of low drive and poor performance.',
    clinicalNote: 'L-DOPA from Kapikacchu converts directly to dopamine, the motivation and desire molecule.',
    urgency: 'MODERATE',
    affectedSystems: ['Libido', 'Motivation', 'Mood', 'Desire', 'Pleasure'],
    productIds: [9, 5, 4],
  },
  SLEEP_HORMONE_DISRUPTION: {
    label: 'Sleep-Hormone Disruption',
    icon: '🌙',
    color: '#6D28D9',
    shortLabel: 'Sleep Disrupted',
    description: 'Poor sleep is cutting off the primary window for testosterone production. 70% of daily testosterone is made between 11 PM and 3 AM during deep sleep.',
    clinicalNote: 'Men sleeping less than 6 hours have 10-15% lower testosterone than those sleeping 8 hours.',
    urgency: 'HIGH',
    affectedSystems: ['Testosterone', 'Recovery', 'Energy', 'Cortisol', 'Mood'],
    productIds: [6, 4, 1],
  },
  GUT_ABSORPTION_ISSUE: {
    label: 'Nutrient Absorption Deficit',
    icon: '🫃',
    color: '#D97706',
    shortLabel: 'Gut Issue',
    description: 'Poor gut health is preventing your body from absorbing the zinc, magnesium, and vitamins essential for testosterone synthesis.',
    clinicalNote: 'Zinc deficiency alone reduces testosterone by up to 50%. Gut health is the gateway to hormonal health.',
    urgency: 'MODERATE',
    affectedSystems: ['Zinc', 'Magnesium', 'B Vitamins', 'Testosterone Synthesis'],
    productIds: [10, 6, 1],
  },
  AGE_RELATED_ANDROPAUSE: {
    label: 'Andropause (Male Menopause)',
    icon: '🕐',
    color: '#1E3A5F',
    shortLabel: 'Andropause',
    description: 'You\'re in the andropause window — the male equivalent of menopause. Testosterone drops 3-5% every year after 35 without targeted intervention.',
    clinicalNote: 'By age 45, average testosterone is 30% lower than at age 25. Ancient Rasayana science was designed specifically for this stage.',
    urgency: 'CRITICAL',
    affectedSystems: ['All Hormone Systems', 'Energy', 'Drive', 'Recovery', 'Body Composition'],
    productIds: [8, 11, 1, 6],
  },
  PERFORMANCE_ANXIETY: {
    label: 'Performance Anxiety Loop',
    icon: '😰',
    color: '#0D9488',
    shortLabel: 'Anxiety Loop',
    description: 'A self-reinforcing cycle where fear of poor performance causes the very problem feared. This psychological pattern has a direct physiological effect on performance.',
    clinicalNote: 'Performance anxiety activates the sympathetic nervous system, constricting blood vessels and suppressing natural response.',
    urgency: 'HIGH',
    affectedSystems: ['Confidence', 'Performance', 'Relationship', 'Mental Health'],
    productIds: [4, 2, 5],
  },
}

// ── Answer weights for condition scoring ──────────────────────────────────────
// Each quiz answer contributes weighted points to specific conditions
const ANSWER_WEIGHTS = {
  // ── LIFESTYLE answers ──────────────────────────────────────────────────────
  sleepHours: {
    u5:   { SLEEP_HORMONE_DISRUPTION:4, CORTISOL_OVERLOAD:3, TESTOSTERONE_DEFICIENCY:3 },
    '5to6': { SLEEP_HORMONE_DISRUPTION:3, CORTISOL_OVERLOAD:2, TESTOSTERONE_DEFICIENCY:2 },
    '6to7': { SLEEP_HORMONE_DISRUPTION:2 },
    '7to8': {},
    o8:   {},
  },
  dietQuality: {
    skip:     { GUT_ABSORPTION_ISSUE:4, TESTOSTERONE_DEFICIENCY:3 },
    junk:     { GUT_ABSORPTION_ISSUE:3, TESTOSTERONE_DEFICIENCY:2 },
    mixed:    { GUT_ABSORPTION_ISSUE:1 },
    home:     {},
    balanced: {},
  },
  exerciseFreq: {
    never: { TESTOSTERONE_DEFICIENCY:3, VASCULAR_DYSFUNCTION:2 },
    once:  { TESTOSTERONE_DEFICIENCY:2, VASCULAR_DYSFUNCTION:1 },
    '2to3': {},
    '4to5': {},
    daily:  {},
  },
  alcoholUse: {
    daily:    { TESTOSTERONE_DEFICIENCY:3, SLEEP_HORMONE_DISRUPTION:2, GUT_ABSORPTION_ISSUE:2 },
    '3to5':   { TESTOSTERONE_DEFICIENCY:2, GUT_ABSORPTION_ISSUE:1 },
    weekends: { TESTOSTERONE_DEFICIENCY:1 },
    rarely:   {},
    never:    {},
  },
  smokingStatus: {
    daily: { VASCULAR_DYSFUNCTION:4, TESTOSTERONE_DEFICIENCY:2 },
    occ:   { VASCULAR_DYSFUNCTION:2 },
    quit:  { VASCULAR_DYSFUNCTION:1 },
    never: {},
  },
  workSchedule: {
    night:    { CORTISOL_OVERLOAD:4, SLEEP_HORMONE_DISRUPTION:4, TESTOSTERONE_DEFICIENCY:3 },
    overwork: { CORTISOL_OVERLOAD:3, SLEEP_HORMONE_DISRUPTION:2 },
    long:     { CORTISOL_OVERLOAD:2 },
    standard: {},
    flex:     {},
  },
  morningEnergy: {
    never:    { SLEEP_HORMONE_DISRUPTION:3, TESTOSTERONE_DEFICIENCY:3 },
    rarely:   { SLEEP_HORMONE_DISRUPTION:2, TESTOSTERONE_DEFICIENCY:2 },
    sometimes:{ SLEEP_HORMONE_DISRUPTION:1 },
    usually:  {},
    always:   {},
  },

  // ── PHYSICAL answers ───────────────────────────────────────────────────────
  energyLevel: {
    exhaust: { TESTOSTERONE_DEFICIENCY:4, CORTISOL_OVERLOAD:3, AGE_RELATED_ANDROPAUSE:3 },
    low:     { TESTOSTERONE_DEFICIENCY:3, CORTISOL_OVERLOAD:2 },
    mod:     { TESTOSTERONE_DEFICIENCY:1 },
    good:    {},
    high:    {},
  },
  fatigueFreq: {
    daily: { TESTOSTERONE_DEFICIENCY:3, CORTISOL_OVERLOAD:3, SLEEP_HORMONE_DISRUPTION:2 },
    most:  { TESTOSTERONE_DEFICIENCY:2, CORTISOL_OVERLOAD:2 },
    few:   { TESTOSTERONE_DEFICIENCY:1 },
    occ:   {},
    never: {},
  },
  strengthDecline: {
    severe:   { AGE_RELATED_ANDROPAUSE:4, TESTOSTERONE_DEFICIENCY:4 },
    notable:  { TESTOSTERONE_DEFICIENCY:3, AGE_RELATED_ANDROPAUSE:2 },
    slight:   { TESTOSTERONE_DEFICIENCY:1 },
    same:     {},
    improved: {},
  },
  bodyPain: {
    severe: { CORTISOL_OVERLOAD:2, GUT_ABSORPTION_ISSUE:2 },
    mod:    { CORTISOL_OVERLOAD:1 },
    mild:   {},
    rare:   {},
    none:   {},
  },
  fitnessLevel: {
    obese:  { VASCULAR_DYSFUNCTION:3, TESTOSTERONE_DEFICIENCY:3 },
    over:   { VASCULAR_DYSFUNCTION:2, TESTOSTERONE_DEFICIENCY:2 },
    slight: { VASCULAR_DYSFUNCTION:1 },
    ideal:  {},
    fit:    {},
  },
  healthConditions: {
    both:  { VASCULAR_DYSFUNCTION:4, TESTOSTERONE_DEFICIENCY:3, GUT_ABSORPTION_ISSUE:2 },
    one:   { VASCULAR_DYSFUNCTION:2, TESTOSTERONE_DEFICIENCY:2 },
    pre:   { VASCULAR_DYSFUNCTION:1, TESTOSTERONE_DEFICIENCY:1 },
    minor: {},
    none:  {},
  },
  gutHealth: {
    poor:     { GUT_ABSORPTION_ISSUE:4, TESTOSTERONE_DEFICIENCY:2 },
    troubled: { GUT_ABSORPTION_ISSUE:3 },
    mod:      { GUT_ABSORPTION_ISSUE:1 },
    good:     {},
    exc:      {},
  },

  // ── MENTAL answers ─────────────────────────────────────────────────────────
  stressLevel: {
    extreme: { CORTISOL_OVERLOAD:5, TESTOSTERONE_DEFICIENCY:4, PERFORMANCE_ANXIETY:3 },
    high:    { CORTISOL_OVERLOAD:4, TESTOSTERONE_DEFICIENCY:3, PERFORMANCE_ANXIETY:2 },
    mod:     { CORTISOL_OVERLOAD:2 },
    low:     {},
    vlow:    {},
  },
  anxietyFreq: {
    daily:    { PERFORMANCE_ANXIETY:5, CORTISOL_OVERLOAD:4, NEUROTRANSMITTER_DEFICIT:3 },
    often:    { PERFORMANCE_ANXIETY:4, CORTISOL_OVERLOAD:3, NEUROTRANSMITTER_DEFICIT:2 },
    sometimes:{ PERFORMANCE_ANXIETY:2, CORTISOL_OVERLOAD:1 },
    rarely:   {},
    never:    {},
  },
  focusLevel: {
    vpoor: { NEUROTRANSMITTER_DEFICIT:4, CORTISOL_OVERLOAD:3, TESTOSTERONE_DEFICIENCY:2 },
    poor:  { NEUROTRANSMITTER_DEFICIT:3, CORTISOL_OVERLOAD:2 },
    avg:   { NEUROTRANSMITTER_DEFICIT:1 },
    good:  {},
    exc:   {},
  },
  moodState: {
    low:     { NEUROTRANSMITTER_DEFICIT:4, TESTOSTERONE_DEFICIENCY:3 },
    moody:   { NEUROTRANSMITTER_DEFICIT:3, CORTISOL_OVERLOAD:2 },
    neutral: { NEUROTRANSMITTER_DEFICIT:1 },
    pos:     {},
    great:   {},
  },
  motivationLevel: {
    none:  { NEUROTRANSMITTER_DEFICIT:4, TESTOSTERONE_DEFICIENCY:3 },
    low:   { NEUROTRANSMITTER_DEFICIT:3, TESTOSTERONE_DEFICIENCY:2 },
    some:  { NEUROTRANSMITTER_DEFICIT:1 },
    usual: {},
    high:  {},
  },
  performanceAnxiety: {
    severe: { PERFORMANCE_ANXIETY:5, NEUROTRANSMITTER_DEFICIT:3 },
    often:  { PERFORMANCE_ANXIETY:4, NEUROTRANSMITTER_DEFICIT:2 },
    occ:    { PERFORMANCE_ANXIETY:2 },
    rarely: { PERFORMANCE_ANXIETY:1 },
    none:   {},
  },
  relationshipHealth: {
    strained: { PERFORMANCE_ANXIETY:3, TESTOSTERONE_DEFICIENCY:2 },
    affected: { PERFORMANCE_ANXIETY:2 },
    ok:       {},
    good:     {},
    great:    {},
  },
  confidenceImpact: {
    severe: { PERFORMANCE_ANXIETY:4, NEUROTRANSMITTER_DEFICIT:3 },
    sig:    { PERFORMANCE_ANXIETY:3, NEUROTRANSMITTER_DEFICIT:2 },
    some:   { PERFORMANCE_ANXIETY:2 },
    min:    {},
    none:   {},
  },

  // ── INTIMATE answers ───────────────────────────────────────────────────────
  libidoLevel: {
    vlow: { TESTOSTERONE_DEFICIENCY:5, NEUROTRANSMITTER_DEFICIT:4, AGE_RELATED_ANDROPAUSE:3 },
    low:  { TESTOSTERONE_DEFICIENCY:4, NEUROTRANSMITTER_DEFICIT:3 },
    mod:  { TESTOSTERONE_DEFICIENCY:2, NEUROTRANSMITTER_DEFICIT:1 },
    good: {},
    high: {},
  },
  erectionDifficulty: {
    always:    { VASCULAR_DYSFUNCTION:5, TESTOSTERONE_DEFICIENCY:3, PERFORMANCE_ANXIETY:3 },
    often:     { VASCULAR_DYSFUNCTION:4, TESTOSTERONE_DEFICIENCY:2, PERFORMANCE_ANXIETY:2 },
    sometimes: { VASCULAR_DYSFUNCTION:2, PERFORMANCE_ANXIETY:2 },
    rarely:    { VASCULAR_DYSFUNCTION:1 },
    never:     {},
  },
  staminaDuration: {
    vshort: { PERFORMANCE_ANXIETY:4, VASCULAR_DYSFUNCTION:3, NEUROTRANSMITTER_DEFICIT:3 },
    short:  { PERFORMANCE_ANXIETY:3, VASCULAR_DYSFUNCTION:2 },
    avg:    { PERFORMANCE_ANXIETY:1 },
    good:   {},
    great:  {},
  },
  performanceChange: {
    much_worse: { AGE_RELATED_ANDROPAUSE:4, TESTOSTERONE_DEFICIENCY:4, VASCULAR_DYSFUNCTION:3 },
    worse:      { AGE_RELATED_ANDROPAUSE:3, TESTOSTERONE_DEFICIENCY:3 },
    slight:     { TESTOSTERONE_DEFICIENCY:1 },
    same:       {},
    better:     {},
  },
  morningErections: {
    rare:  { TESTOSTERONE_DEFICIENCY:4, VASCULAR_DYSFUNCTION:3 },
    '1to2':{ TESTOSTERONE_DEFICIENCY:3, VASCULAR_DYSFUNCTION:2 },
    '3to4':{ TESTOSTERONE_DEFICIENCY:1 },
    daily: {},
    every: {},
  },
  overallSatisfaction: {
    vunsat: { PERFORMANCE_ANXIETY:3, TESTOSTERONE_DEFICIENCY:2 },
    unsat:  { PERFORMANCE_ANXIETY:2, TESTOSTERONE_DEFICIENCY:1 },
    ok:     {},
    sat:    {},
    vsat:   {},
  },
  relationshipImpact: {
    serious: { PERFORMANCE_ANXIETY:4 },
    tension: { PERFORMANCE_ANXIETY:3 },
    slight:  { PERFORMANCE_ANXIETY:1 },
    none:    {},
    na:      {},
  },
  durationOfConcerns: {
    over3yr:  { AGE_RELATED_ANDROPAUSE:3, TESTOSTERONE_DEFICIENCY:2 },
    '1to3yr': { TESTOSTERONE_DEFICIENCY:2 },
    '6mto1yr':{ TESTOSTERONE_DEFICIENCY:1 },
    '1to6m':  {},
    recent:   {},
  },
}

// ── Age multiplier ─────────────────────────────────────────────────────────────
const AGE_MULTIPLIERS = {
  '18-25': { AGE_RELATED_ANDROPAUSE: 0,   TESTOSTERONE_DEFICIENCY: 0.8 },
  '26-35': { AGE_RELATED_ANDROPAUSE: 0.5, TESTOSTERONE_DEFICIENCY: 1.0 },
  '36-45': { AGE_RELATED_ANDROPAUSE: 2.5, TESTOSTERONE_DEFICIENCY: 1.5 },
  '45+':   { AGE_RELATED_ANDROPAUSE: 4.0, TESTOSTERONE_DEFICIENCY: 2.0 },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DIAGNOSIS FUNCTION
// Returns: detected conditions sorted by severity, scores, primary condition
// ─────────────────────────────────────────────────────────────────────────────
export function runDiagnosis(quizAnswers, ageGroup) {
  // Step 1: Accumulate raw condition scores from all answers
  const raw = {}
  Object.values(CONDITIONS).forEach(c => { raw[c] = 0 })

  Object.entries(quizAnswers).forEach(([key, value]) => {
    const weights = ANSWER_WEIGHTS[key]
    if (!weights || !weights[value]) return
    Object.entries(weights[value]).forEach(([condition, points]) => {
      raw[condition] = (raw[condition] || 0) + points
    })
  })

  // Step 2: Apply age multipliers
  const ageGroup_ = ageGroup || '26-35'
  const multipliers = AGE_MULTIPLIERS[ageGroup_] || {}
  Object.entries(multipliers).forEach(([condition, mult]) => {
    raw[condition] = (raw[condition] || 0) * mult
  })

  // Step 3: Normalise to 0-100 scale
  // Max theoretical score per condition ~30 pts raw
  const MAX_RAW = 30
  const scores = {}
  Object.entries(raw).forEach(([c, s]) => {
    scores[c] = Math.min(100, Math.round((s / MAX_RAW) * 100))
  })

  // Step 4: Detect active conditions (score > 25 = detectable)
  const THRESHOLD = 25
  const detected = Object.entries(scores)
    .filter(([_, score]) => score >= THRESHOLD)
    .map(([condition, score]) => ({
      condition,
      score,
      severity: score >= 75 ? 'CRITICAL' : score >= 55 ? 'HIGH' : 'MODERATE',
      meta: CONDITION_META[condition],
    }))
    .sort((a, b) => b.score - a.score)

  // Step 5: Calculate VitaScore (inverse of average condition severity)
  const avgConditionScore = detected.length > 0
    ? detected.reduce((s, c) => s + c.score, 0) / detected.length
    : 10
  const vitaScore = Math.max(5, Math.min(100, Math.round(100 - (avgConditionScore * 0.7))))

  // Step 6: Primary condition (highest score)
  const primaryCondition = detected[0] || null

  // Step 7: Category sub-scores (0–25 each)
  const lifestyleScore   = calcCategoryScore(quizAnswers, 'lifestyle')
  const physicalScore    = calcCategoryScore(quizAnswers, 'physical')
  const mentalScore      = calcCategoryScore(quizAnswers, 'mental')
  const performanceScore = calcCategoryScore(quizAnswers, 'intimate')

  return {
    conditions:       detected,
    conditionScores:  scores,
    primaryCondition,
    vitaScore,
    lifestyleScore,
    physicalScore,
    mentalScore,
    performanceScore,
    severity: detected.some(c => c.severity === 'CRITICAL') ? 'CRITICAL'
             : detected.some(c => c.severity === 'HIGH')     ? 'HIGH'
             : 'MODERATE',
    conditionCount: detected.length,
  }
}

// Inline scoring — maps known answer keys to simple scores
const SIMPLE_SCORE_MAP = {
  u5:1,'5to6':2,'6to7':3,'7to8':4,o8:3,
  skip:1,junk:1,mixed:2,home:3,balanced:4,
  never:4,once:2,'2to3':3,'4to5':4,daily:4,
  exhaust:1,low:2,mod:3,good:4,high:4,
  extreme:1,severe:1,often:2,sometimes:3,rarely:4,none:4,
  vpoor:1,poor:2,avg:3,exc:4,
  vlow:1,vunsat:1,unsat:2,ok:3,sat:4,vsat:4,
  always:1,much_worse:1,worse:2,slight:3,same:4,better:4,
  strained:1,affected:2,great:4,over3yr:1,'1to3yr':2,'6mto1yr':3,'1to6m':4,recent:4,
}
function calcCategoryScore(answers, category) {
  const catKeys = {
    lifestyle: ['sleepHours','dietQuality','exerciseFreq','alcoholUse','smokingStatus','workSchedule','morningEnergy'],
    physical:  ['energyLevel','fatigueFreq','strengthDecline','bodyPain','fitnessLevel','healthConditions','gutHealth'],
    mental:    ['stressLevel','anxietyFreq','focusLevel','moodState','motivationLevel','performanceAnxiety','relationshipHealth','confidenceImpact'],
    intimate:  ['libidoLevel','erectionDifficulty','staminaDuration','performanceChange','morningErections','overallSatisfaction','relationshipImpact','durationOfConcerns'],
  }
  const keys = catKeys[category] || []
  let score = 0, count = 0
  keys.forEach(key => {
    const ans = answers[key]
    if (!ans) return
    const s = SIMPLE_SCORE_MAP[ans]
    if (s !== undefined) { score += s; count++ }
  })
  const maxRaw = { lifestyle:28, physical:28, mental:32, intimate:32 }
  return count > 0 ? Math.round((score / maxRaw[category]) * 25) : 12
}

// ── Get personalised message based on conditions ───────────────────────────────
export function getPersonalisedInsight(conditions, userName) {
  const name = userName || 'you'
  if (!conditions || conditions.length === 0) {
    return `${name}, your foundation is solid. A precision stack will elevate you to peak performance.`
  }
  const primary = conditions[0].condition
  const insights = {
    TESTOSTERONE_DEFICIENCY:  `${name}, your answers reveal a classic testosterone deficiency pattern. The good news — this responds quickly to the right Ayurvedic protocol.`,
    CORTISOL_OVERLOAD:        `${name}, chronic stress has hijacked your hormonal system. Every day this continues, cortisol is actively destroying your testosterone and vitality.`,
    VASCULAR_DYSFUNCTION:     `${name}, restricted blood flow is the physical root of your performance issues. Ancient Siddha formulas were designed precisely for this pattern.`,
    NEUROTRANSMITTER_DEFICIT: `${name}, your dopamine and serotonin balance is off. This is what's creating low desire, low motivation, and performance anxiety together.`,
    SLEEP_HORMONE_DISRUPTION: `${name}, your sleep window is failing to produce testosterone. Every poor night of sleep compounds the deficit.`,
    GUT_ABSORPTION_ISSUE:     `${name}, even if you eat well, poor gut health means your body isn't absorbing the minerals needed for testosterone synthesis.`,
    AGE_RELATED_ANDROPAUSE:   `${name}, you've entered the andropause window. Without intervention, this compounds every year. The ancient masters had a specific Rasayana protocol for this exact stage.`,
    PERFORMANCE_ANXIETY:      `${name}, a psychological loop is creating a physical cycle. Breaking this pattern with the right formula changes everything.`,
  }
  return insights[primary] || `${name}, your VI analysis is complete. A personalised protocol awaits.`
}
