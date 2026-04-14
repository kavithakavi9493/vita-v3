import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { C, G } from '../constants/colors'
import {
  QUIZ_QUESTIONS, QUIZ_CATEGORIES,
  calculateScores, extractStateValues,
  getQuestionsByCategory,
} from '../constants/quizQuestions'

// ── Progress bar ──────────────────────────────────────────
function ProgressBar({ total, current, color }) {
  return (
    <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
      <div style={{ height: '100%', width: `${((current + 1) / total) * 100}%`, background: color, borderRadius: 2, transition: 'width 0.3s ease' }} />
    </div>
  )
}

// ── Category pill ─────────────────────────────────────────
function CategoryPill({ cat, qIndex, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30`, borderRadius: 20, padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>{cat.icon}</span>
        <span style={{ color: cat.color, fontSize: 12, fontWeight: 700 }}>{cat.label}</span>
      </div>
      <span style={{ color: C.muted, fontSize: 12 }}>Question {qIndex + 1} of {total}</span>
    </div>
  )
}

// ── Option button ─────────────────────────────────────────
function OptionBtn({ option, selected, onSelect, color }) {
  return (
    <div
      onClick={() => onSelect(option.value)}
      style={{
        background: selected ? `${color}12` : '#FFFFFF',
        border: `${selected ? 2 : 1.5}px solid ${selected ? color : C.border}`,
        borderRadius: 16, padding: '14px 16px',
        marginBottom: 10, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'all 0.15s ease',
        boxShadow: selected ? `0 2px 12px ${color}20` : '0 1px 4px rgba(0,0,0,0.06)',
      }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? color : C.border}`,
        background: selected ? color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}>
        {selected && <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</span>}
      </div>
      <span style={{ color: selected ? color : C.text, fontSize: 14, fontWeight: selected ? 600 : 400, lineHeight: 1.4 }}>
        {option.label}
      </span>
    </div>
  )
}

// ── Main Quiz Screen ──────────────────────────────────────
export default function QuizScreen() {
  const navigate   = useNavigate()
  const { catId }  = useParams()
  const { state, update } = useApp()

  const category    = QUIZ_CATEGORIES.find(c => c.id === catId) || QUIZ_CATEGORIES[0]
  const questions   = getQuestionsByCategory(catId || 'lifestyle')
  const [qIndex, setQIndex]     = useState(0)
  const [answers, setAnswers]   = useState(state.quizAnswers || {})
  const [animDir, setAnimDir]   = useState(1) // 1=forward, -1=back
  const [visible, setVisible]   = useState(true)

  const question = questions[qIndex]
  const catIndex = QUIZ_CATEGORIES.findIndex(c => c.id === catId)
  const totalDone = QUIZ_CATEGORIES.slice(0, catIndex).reduce((s, c) => s + c.count, 0)
  const overallCurrent = totalDone + qIndex
  const overallTotal   = QUIZ_QUESTIONS.length

  // Route map: which category comes next
  const CAT_ROUTE = { lifestyle: 'physical', physical: 'mental', mental: 'intimate' }

  const selectAnswer = (value) => {
    const newAnswers = { ...answers, [question.key]: value }
    setAnswers(newAnswers)
    update({ quizAnswers: newAnswers })

    setTimeout(() => {
      setVisible(false)
      setAnimDir(1)
      setTimeout(() => {
        if (qIndex < questions.length - 1) {
          setQIndex(i => i + 1)
        } else {
          // Category complete
          if (catId === 'mental') {
            // Go to analyzing screen before intimate
            update({ quizAnswers: newAnswers })
            navigate('/analyzing')
          } else if (catId === 'intimate') {
            // All done — calculate scores and go to result
            const scores  = calculateScores(newAnswers)
            const mapped  = extractStateValues(newAnswers)
            update({ ...scores, ...mapped, quizAnswers: newAnswers, hasCompletedQuiz: true })
            navigate('/final-loading')
          } else {
            navigate(`/quiz/${CAT_ROUTE[catId]}`)
          }
        }
        setVisible(true)
      }, 150)
    }, 350)
  }

  const goBack = () => {
    if (qIndex > 0) {
      setVisible(false)
      setAnimDir(-1)
      setTimeout(() => { setQIndex(i => i - 1); setVisible(true) }, 150)
    } else if (catIndex > 0) {
      const prevCat = QUIZ_CATEGORIES[catIndex - 1].id
      navigate(`/quiz/${prevCat}`)
    } else {
      navigate(-1)
    }
  }

  const currentAnswer = answers[question?.key]

  if (!question) return null

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bgMid, overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{ background: '#FFFFFF', padding: '54px 20px 16px', borderBottom: `1px solid ${C.border}` }}>

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div onClick={goBack} style={{ width: 36, height: 36, borderRadius: '50%', background: C.bgMid, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ color: C.text, fontSize: 16 }}>←</span>
          </div>
          <div style={{ flex: 1 }}>
            <CategoryPill cat={category} qIndex={qIndex} total={questions.length} />
          </div>
          <div style={{ color: C.muted, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            {overallCurrent + 1}/{overallTotal}
          </div>
        </div>

        {/* Overall progress bar */}
        <ProgressBar total={overallTotal} current={overallCurrent} color={category.color} />

        {/* Category progress dots */}
        <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
          {QUIZ_CATEGORIES.map((c, i) => (
            <div key={c.id} style={{ flex: 1, height: 3, borderRadius: 2, background: i < catIndex ? c.color : i === catIndex ? `${c.color}60` : C.border }} />
          ))}
        </div>
      </div>

      {/* ── Question + Options ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 120px', opacity: visible ? 1 : 0, transition: 'opacity 0.15s ease', transform: visible ? 'translateY(0)' : `translateY(${animDir * 10}px)` }}>

        {/* Question */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>{question.icon}</div>
          <div style={{ color: C.text, fontSize: 19, fontWeight: 800, lineHeight: 1.35 }}>
            {question.question}
          </div>
        </div>

        {/* Options */}
        <div>
          {question.options.map(opt => (
            <OptionBtn
              key={opt.value}
              option={opt}
              selected={currentAnswer === opt.value}
              onSelect={selectAnswer}
              color={category.color}
            />
          ))}
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(255,255,255,0.97)', borderTop: `1px solid ${C.border}`, backdropFilter: 'blur(12px)', padding: '12px 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ color: C.muted, fontSize: 12 }}>
            {currentAnswer ? '✅ Answer selected — tap to move on' : 'Select an option to continue'}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {questions.map((_, i) => (
              <div key={i} style={{ width: i === qIndex ? 16 : 6, height: 6, borderRadius: 3, background: answers[questions[i].key] ? category.color : i === qIndex ? `${category.color}60` : C.border, transition: 'all 0.2s' }} />
            ))}
          </div>
        </div>
        {currentAnswer && (
          <div
            onClick={() => selectAnswer(currentAnswer)}
            style={{ background: category.color, borderRadius: 14, padding: '14px 0', textAlign: 'center', color: '#FFFFFF', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 16px ${category.color}40` }}>
            Next →
          </div>
        )}
      </div>
    </div>
  )
}
