// VI Quiz Engine — 30 Questions across 4 categories
// Each answer has a score. Category max = 25 pts each. Total VitaScore max = 100.

export const QUIZ_CATEGORIES = [
  { id:'lifestyle', label:'Lifestyle',       icon:'🌙', color:'#0891B2', count:7 },
  { id:'physical',  label:'Physical Health', icon:'💪', color:'#15803D', count:7 },
  { id:'mental',    label:'Mental Wellness', icon:'🧠', color:'#7C3AED', count:8 },
  { id:'intimate',  label:'Intimate Health', icon:'❤️', color:'#DC2626', count:8 },
]

export const QUIZ_QUESTIONS = [
  // ── LIFESTYLE (7 qs) ─────────────────────────────────────
  { id:'L1', category:'lifestyle', seq:1, icon:'😴',
    question:'How many hours of sleep do you get on most nights?',
    options:[
      {label:'Less than 5 hours',  value:'u5',   score:1},
      {label:'5 – 6 hours',        value:'5to6', score:2},
      {label:'6 – 7 hours',        value:'6to7', score:3},
      {label:'7 – 8 hours',        value:'7to8', score:4},
      {label:'More than 8 hours',  value:'o8',   score:3},
    ], key:'sleepHours' },
  { id:'L2', category:'lifestyle', seq:2, icon:'🥗',
    question:'How would you describe your eating habits?',
    options:[
      {label:'Skip meals often',                 value:'skip',     score:1},
      {label:'Mostly junk / fast food',          value:'junk',     score:1},
      {label:'Mixed — some healthy, some not',   value:'mixed',    score:2},
      {label:'Mostly home-cooked meals',         value:'home',     score:3},
      {label:'Balanced, nutritious always',      value:'balanced', score:4},
    ], key:'dietQuality' },
  { id:'L3', category:'lifestyle', seq:3, icon:'🏃',
    question:'How often do you exercise or do physical activity?',
    options:[
      {label:'Never',              value:'never', score:1},
      {label:'Once a week',        value:'once',  score:2},
      {label:'2–3 times a week',   value:'2to3',  score:3},
      {label:'4–5 times a week',   value:'4to5',  score:4},
      {label:'Every day',          value:'daily', score:4},
    ], key:'exerciseFreq' },
  { id:'L4', category:'lifestyle', seq:4, icon:'🍺',
    question:'How much alcohol do you consume?',
    options:[
      {label:'Daily or almost daily',   value:'daily',    score:1},
      {label:'3–5 times a week',        value:'3to5',     score:2},
      {label:'Weekends only',           value:'weekends', score:3},
      {label:'Rarely / occasionally',   value:'rarely',   score:4},
      {label:'Never',                   value:'never',    score:4},
    ], key:'alcoholUse' },
  { id:'L5', category:'lifestyle', seq:5, icon:'🚬',
    question:'Do you smoke or use tobacco?',
    options:[
      {label:'Yes, daily',          value:'daily', score:1},
      {label:'Occasionally',        value:'occ',   score:2},
      {label:'Used to, quit now',   value:'quit',  score:3},
      {label:'Never smoked',        value:'never', score:4},
    ], key:'smokingStatus' },
  { id:'L6', category:'lifestyle', seq:6, icon:'💼',
    question:'How would you describe your daily work schedule?',
    options:[
      {label:'Night shifts / highly irregular',    value:'night',    score:1},
      {label:'Very long hours (12+ hrs daily)',     value:'overwork', score:2},
      {label:'Regular long hours (9–11 hrs)',       value:'long',     score:2},
      {label:'Standard 8–9 hour day',              value:'standard', score:3},
      {label:'Flexible / controlled schedule',     value:'flex',     score:4},
    ], key:'workSchedule' },
  { id:'L7', category:'lifestyle', seq:7, icon:'☀️',
    question:'How often do you feel rested when you wake up?',
    options:[
      {label:'Almost never — always groggy',       value:'never',    score:1},
      {label:'Rarely — most mornings are tough',   value:'rarely',   score:2},
      {label:'Sometimes — depends on the day',     value:'sometimes',score:3},
      {label:'Usually well-rested',                value:'usually',  score:4},
      {label:'Almost always energised',            value:'always',   score:4},
    ], key:'morningEnergy' },

  // ── PHYSICAL (7 qs) ──────────────────────────────────────
  { id:'P1', category:'physical', seq:1, icon:'⚡',
    question:'How would you rate your overall energy levels during the day?',
    options:[
      {label:'Exhausted — barely get through',      value:'exhaust', score:1},
      {label:'Low — need caffeine to function',      value:'low',     score:2},
      {label:'Moderate — up and down',              value:'mod',     score:3},
      {label:'Good — consistent energy',            value:'good',    score:4},
      {label:'High — full energy all day',          value:'high',    score:4},
    ], key:'energyLevel', stateKey:'energyLevel' },
  { id:'P2', category:'physical', seq:2, icon:'😮‍💨',
    question:'How often do you feel physically fatigued?',
    options:[
      {label:'Every single day',        value:'daily',  score:1},
      {label:'Most days',               value:'most',   score:2},
      {label:'A few times a week',      value:'few',    score:3},
      {label:'Occasionally',            value:'occ',    score:4},
      {label:'Almost never',            value:'never',  score:4},
    ], key:'fatigueFreq', stateKey:'fatigueLevel',
    valueMap:{daily:'Frequently',most:'Often',few:'Sometimes',occ:'Rarely',never:'Rarely'} },
  { id:'P3', category:'physical', seq:3, icon:'💪',
    question:'Have you noticed a decrease in muscle strength or stamina?',
    options:[
      {label:'Significant decrease over 1–2 years', value:'severe',   score:1},
      {label:'Noticeable drop in past 6 months',    value:'notable',  score:2},
      {label:'Slight decrease — nothing major',     value:'slight',   score:3},
      {label:'Same as before',                      value:'same',     score:4},
      {label:'Actually improved recently',          value:'improved', score:4},
    ], key:'strengthDecline' },
  { id:'P4', category:'physical', seq:4, icon:'🦴',
    question:'Do you experience back pain, joint pain, or body aches regularly?',
    options:[
      {label:'Yes, severe — affects daily life',    value:'severe',   score:1},
      {label:'Yes, moderate — distracting',         value:'mod',      score:2},
      {label:'Mild aches occasionally',             value:'mild',     score:3},
      {label:'Very rarely',                         value:'rare',     score:4},
      {label:'No pain at all',                      value:'none',     score:4},
    ], key:'bodyPain' },
  { id:'P5', category:'physical', seq:5, icon:'⚖️',
    question:'How would you describe your body weight / fitness level?',
    options:[
      {label:'Significantly overweight',            value:'obese',  score:1},
      {label:'Overweight — working on it',          value:'over',   score:2},
      {label:'Slightly above ideal weight',         value:'slight', score:3},
      {label:'Near ideal weight',                   value:'ideal',  score:4},
      {label:'Fit and athletic',                    value:'fit',    score:4},
    ], key:'fitnessLevel' },
  { id:'P6', category:'physical', seq:6, icon:'🩺',
    question:'Do you have any diagnosed health conditions?',
    options:[
      {label:'Yes — diabetes AND heart condition',   value:'both',  score:1},
      {label:'Yes — diabetes or blood pressure',    value:'one',   score:2},
      {label:'Borderline / pre-diabetic',           value:'pre',   score:3},
      {label:'Generally healthy, some issues',      value:'minor', score:3},
      {label:'No diagnosed conditions',             value:'none',  score:4},
    ], key:'healthConditions' },
  { id:'P7', category:'physical', seq:7, icon:'🫃',
    question:'How is your digestion and gut health?',
    options:[
      {label:'Very poor — bloating, constipation daily', value:'poor',    score:1},
      {label:'Often troubled — irregular',               value:'troubled',score:2},
      {label:'Moderate — occasional issues',             value:'mod',     score:3},
      {label:'Good — mostly regular',                    value:'good',    score:4},
      {label:'Excellent gut health',                     value:'exc',     score:4},
    ], key:'gutHealth' },

  // ── MENTAL (8 qs) ────────────────────────────────────────
  { id:'M1', category:'mental', seq:1, icon:'🧠',
    question:'How would you rate your current stress level?',
    options:[
      {label:'Extremely high — overwhelmed always',  value:'extreme', score:1},
      {label:'High — constant pressure',             value:'high',    score:2},
      {label:'Moderate — manageable most days',      value:'mod',     score:3},
      {label:'Low — mostly calm',                    value:'low',     score:4},
      {label:'Very low — I manage stress well',      value:'vlow',    score:4},
    ], key:'stressLevel', stateKey:'stressLevel',
    valueMap:{extreme:'High',high:'High',mod:'Moderate',low:'Low',vlow:'Low'} },
  { id:'M2', category:'mental', seq:2, icon:'😰',
    question:'How often do you experience anxiety or overthinking?',
    options:[
      {label:'Daily — can\'t switch off my mind',    value:'daily',    score:1},
      {label:'Often — several times a week',         value:'often',    score:2},
      {label:'Sometimes — triggered by situations',  value:'sometimes',score:3},
      {label:'Rarely',                               value:'rarely',   score:4},
      {label:'Almost never',                         value:'never',    score:4},
    ], key:'anxietyFreq', stateKey:'anxietyLevel',
    valueMap:{daily:'Often',often:'Often',sometimes:'Sometimes',rarely:'Rarely',never:'Rarely'} },
  { id:'M3', category:'mental', seq:3, icon:'🎯',
    question:'How is your ability to focus and concentrate?',
    options:[
      {label:'Very poor — can\'t focus on anything',    value:'vpoor', score:1},
      {label:'Poor — easily distracted',               value:'poor',  score:2},
      {label:'Average — focus when necessary',         value:'avg',   score:3},
      {label:'Good — focused most of the time',        value:'good',  score:4},
      {label:'Excellent — sharp and concentrated',     value:'exc',   score:4},
    ], key:'focusLevel', stateKey:'focusLevel',
    valueMap:{vpoor:'Poor',poor:'Poor',avg:'Moderate',good:'Good',exc:'Excellent'} },
  { id:'M4', category:'mental', seq:4, icon:'😔',
    question:'How would you describe your overall mood and emotional state?',
    options:[
      {label:'Frequently low, depressed, or irritable', value:'low',     score:1},
      {label:'Often moody — swings frequently',         value:'moody',   score:2},
      {label:'Neutral — neither great nor bad',         value:'neutral', score:3},
      {label:'Generally positive',                      value:'pos',     score:4},
      {label:'Consistently happy and balanced',         value:'great',   score:4},
    ], key:'moodState' },
  { id:'M5', category:'mental', seq:5, icon:'🔥',
    question:'Do you feel a sense of motivation and purpose in daily life?',
    options:[
      {label:'No — I feel lost or unmotivated',        value:'none',   score:1},
      {label:'Low — hard to find motivation',          value:'low',    score:2},
      {label:'Sometimes — depends on the situation',   value:'some',   score:3},
      {label:'Usually motivated',                      value:'usual',  score:4},
      {label:'Highly motivated and driven',            value:'high',   score:4},
    ], key:'motivationLevel' },
  { id:'M6', category:'mental', seq:6, icon:'😟',
    question:'Have you experienced performance anxiety around intimacy?',
    options:[
      {label:'Yes — severe anxiety, avoid intimacy',   value:'severe', score:1},
      {label:'Yes — significant anxiety often',        value:'often',  score:2},
      {label:'Occasionally — before it starts',        value:'occ',    score:3},
      {label:'Rarely — minimal nervousness',           value:'rarely', score:4},
      {label:'No anxiety at all',                      value:'none',   score:4},
    ], key:'performanceAnxiety' },
  { id:'M7', category:'mental', seq:7, icon:'👫',
    question:'How is your relationship with your partner currently?',
    options:[
      {label:'Very strained — intimacy-related tension', value:'strained', score:1},
      {label:'Somewhat affected by wellness issues',     value:'affected', score:2},
      {label:'OK — not great, not bad',                 value:'ok',       score:3},
      {label:'Good — minor areas to improve',           value:'good',     score:4},
      {label:'Excellent — no issues',                   value:'great',    score:4},
    ], key:'relationshipHealth' },
  { id:'M8', category:'mental', seq:8, icon:'🛡️',
    question:'How has your confidence been affected by these wellness issues?',
    options:[
      {label:'Severely — I avoid situations completely',  value:'severe', score:1},
      {label:'Significantly — affects my self-image',    value:'sig',    score:2},
      {label:'Somewhat — I notice it sometimes',         value:'some',   score:3},
      {label:'Minimally — mostly confident',             value:'min',    score:4},
      {label:'Not at all — fully confident',             value:'none',   score:4},
    ], key:'confidenceImpact' },

  // ── INTIMATE (8 qs) ──────────────────────────────────────
  { id:'I1', category:'intimate', seq:1, icon:'❤️',
    question:'How would you describe your current level of sexual desire (libido)?',
    options:[
      {label:'Very low — rarely feel any desire',       value:'vlow',  score:1},
      {label:'Low — significantly reduced from before', value:'low',   score:2},
      {label:'Moderate — present but not strong',       value:'mod',   score:3},
      {label:'Good — healthy desire',                   value:'good',  score:4},
      {label:'High — strong and consistent',            value:'high',  score:4},
    ], key:'libidoLevel', stateKey:'libidoLevel',
    valueMap:{vlow:'Low',low:'Low',mod:'Moderate',good:'Good',high:'High'} },
  { id:'I2', category:'intimate', seq:2, icon:'🔋',
    question:'How often do you have difficulty achieving or maintaining an erection?',
    options:[
      {label:'Almost always — very difficult',     value:'always',    score:1},
      {label:'Often — happens regularly',          value:'often',     score:2},
      {label:'Sometimes — occasional difficulty',  value:'sometimes', score:3},
      {label:'Rarely — minor occasional issue',    value:'rarely',    score:4},
      {label:'Never — no issues',                  value:'never',     score:4},
    ], key:'erectionDifficulty', stateKey:'erectionQuality',
    valueMap:{always:'Weak',often:'Moderate',sometimes:'Moderate',rarely:'Strong',never:'Strong'} },
  { id:'I3', category:'intimate', seq:3, icon:'⏱️',
    question:'How would you rate your stamina and duration during intimacy?',
    options:[
      {label:'Very short — ends much sooner than wanted', value:'vshort', score:1},
      {label:'Short — below what I\'d like',              value:'short',  score:2},
      {label:'Average — acceptable but could be better',  value:'avg',    score:3},
      {label:'Good — happy with duration',                value:'good',   score:4},
      {label:'Excellent — no concerns',                   value:'great',  score:4},
    ], key:'staminaDuration', stateKey:'timingControl',
    valueMap:{vshort:'Often',short:'Sometimes',avg:'Rarely',good:'Never',great:'Never'} },
  { id:'I4', category:'intimate', seq:4, icon:'📉',
    question:'Compared to 2–3 years ago, how has your sexual performance changed?',
    options:[
      {label:'Significantly worse — night and day',  value:'much_worse', score:1},
      {label:'Noticeably worse',                     value:'worse',      score:2},
      {label:'Slightly worse',                       value:'slight',     score:3},
      {label:'About the same',                       value:'same',       score:4},
      {label:'Actually better',                      value:'better',     score:4},
    ], key:'performanceChange' },
  { id:'I5', category:'intimate', seq:5, icon:'🌅',
    question:'How often do you experience morning erections (morning wood)?',
    options:[
      {label:'Rarely or never — less than once/week', value:'rare',  score:1},
      {label:'1–2 times a week',                      value:'1to2',  score:2},
      {label:'3–4 times a week',                      value:'3to4',  score:3},
      {label:'Almost daily',                          value:'daily', score:4},
      {label:'Every morning',                         value:'every', score:4},
    ], key:'morningErections' },
  { id:'I6', category:'intimate', seq:6, icon:'😌',
    question:'How satisfied are you with your overall sexual wellness currently?',
    options:[
      {label:'Very unsatisfied — causing real distress',  value:'vunsat', score:1},
      {label:'Unsatisfied — significant improvement needed', value:'unsat', score:2},
      {label:'Somewhat satisfied — it\'s okay',           value:'ok',     score:3},
      {label:'Satisfied — minor improvements wanted',     value:'sat',    score:4},
      {label:'Very satisfied',                            value:'vsat',   score:4},
    ], key:'overallSatisfaction' },
  { id:'I7', category:'intimate', seq:7, icon:'💔',
    question:'Have any of these issues affected your relationship?',
    options:[
      {label:'Yes — caused serious relationship problems', value:'serious', score:1},
      {label:'Yes — created tension or distance',          value:'tension', score:2},
      {label:'Slightly — partner is understanding',        value:'slight',  score:3},
      {label:'No — relationship is unaffected',           value:'none',    score:4},
      {label:'Not applicable / not in relationship',       value:'na',      score:3},
    ], key:'relationshipImpact' },
  { id:'I8', category:'intimate', seq:8, icon:'📅',
    question:'How long have you been experiencing these concerns?',
    options:[
      {label:'More than 3 years',      value:'over3yr', score:1},
      {label:'1 – 3 years',            value:'1to3yr',  score:2},
      {label:'6 months – 1 year',      value:'6mto1yr', score:3},
      {label:'1 – 6 months',           value:'1to6m',   score:4},
      {label:'Just started noticing',  value:'recent',  score:4},
    ], key:'durationOfConcerns' },
]

// ── Scoring ───────────────────────────────────────────────
export function calculateScores(answers) {
  const catRaw   = { lifestyle:0, physical:0, mental:0, intimate:0 }
  const catCount = { lifestyle:0, physical:0, mental:0, intimate:0 }
  QUIZ_QUESTIONS.forEach(q => {
    const ans = answers[q.key]
    if (!ans) return
    const opt = q.options.find(o => o.value === ans)
    if (!opt) return
    catRaw[q.category]   += opt.score
    catCount[q.category] += 1
  })
  const maxRaw = { lifestyle:28, physical:28, mental:32, intimate:32 }
  const norm = cat => catCount[cat] > 0
    ? Math.round((catRaw[cat] / maxRaw[cat]) * 25)
    : 0
  const lifestyleScore   = norm('lifestyle')
  const physicalScore    = norm('physical')
  const mentalScore      = norm('mental')
  const performanceScore = norm('intimate')
  const vitaScore        = lifestyleScore + physicalScore + mentalScore + performanceScore
  return { lifestyleScore, physicalScore, mentalScore, performanceScore, vitaScore }
}

// ── Extract mapped state values ───────────────────────────
export function extractStateValues(answers) {
  const out = {}
  QUIZ_QUESTIONS.forEach(q => {
    if (!q.stateKey) return
    const ans = answers[q.key]
    if (!ans) return
    out[q.stateKey] = q.valueMap ? (q.valueMap[ans] || ans) : ans
  })
  return out
}

export const getQuestionsByCategory = (cat) => QUIZ_QUESTIONS.filter(q => q.category === cat)
