import { useState } from 'react';
import Button from '../../components/Button';
import type { Question } from '../../models/Question';
import type { FormQuiz } from '../../models/Quiz';
import '../../css/FormQuestionsEditor.css';

interface AnswerDraft { id: number; text: string; correct: boolean; }

interface TextDraft   { id: number; type: 'text'; question: string; answers: string; }
interface ChoiceDraft { id: number; type: 'single_choice' | 'multiple_choice'; question: string; answers: AnswerDraft[]; }
type QuestionDraft = TextDraft | ChoiceDraft;

const HINTS: Record<QuestionDraft['type'], string> = {
  text:            'Player types their answer. Separate multiple correct answers with commas.',
  single_choice:   'Player picks exactly one answer. Only one option can be marked correct.',
  multiple_choice: 'Player picks all correct answers. Multiple options can be marked correct.',
};


let _uid = Date.now();
const uid = () => ++_uid;


function toDraft(q: Question): QuestionDraft {
  if (q.type === 'text') {
    return { id: q.id, type: 'text', question: q.text, answers: q.correctAnswers.join(', ') };
  }
  if (q.type === 'single_choice') {
    return {
      id: q.id, type: 'single_choice', question: q.text,
      answers: [
        { id: uid(), text: q.correctAnswer, correct: true },
        ...q.wrongOptions.map(o => ({ id: uid(), text: o, correct: false })),
      ],
    };
  }
  return {
    id: q.id, type: 'multiple_choice', question: q.text,
    answers: [
      ...q.correctAnswers.map(o => ({ id: uid(), text: o, correct: true })),
      ...q.wrongOptions.map(o  => ({ id: uid(), text: o, correct: false })),
    ],
  };
}

function fromDraft(d: QuestionDraft): Question {
  if (d.type === 'text') {
    return { id: d.id, type: 'text', text: d.question, correctAnswers: d.answers.split(',').map(s => s.trim()).filter(Boolean) };
  }
  if (d.type === 'single_choice') {
    const correct = d.answers.find(a => a.correct);
    return {
      id: d.id, type: 'single_choice', text: d.question,
      correctAnswer: correct?.text ?? '',
      wrongOptions: d.answers.filter(a => !a.correct).map(a => a.text),
    };
  }
  return {
    id: d.id, type: 'multiple_choice', text: d.question,
    correctAnswers: d.answers.filter(a => a.correct).map(a => a.text),
    wrongOptions:   d.answers.filter(a => !a.correct).map(a => a.text),
  };
}

function blankDraft(type: QuestionDraft['type']): QuestionDraft {
  if (type === 'text') return { id: uid(), type: 'text', question: '', answers: '' };
  return {
    id: uid(), type, question: '',
    answers: [
      { id: uid(), text: '', correct: true  },
      { id: uid(), text: '', correct: false },
    ],
  };
}


function AddQuestionButton({ onAdd }: { onAdd: (type: QuestionDraft['type']) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fqe-divider-wrap">
      <div className="fqe-divider">
        <button className="fqe-divider-btn" onClick={() => setOpen(o => !o)}>+</button>
      </div>
      {open && (
        <div className="fqe-type-popup">
          {(['text', 'single_choice', 'multiple_choice'] as QuestionDraft['type'][]).map(t => (
            <button key={t} className="fqe-type-option" onClick={() => { onAdd(t); setOpen(false); }}>
              {t === 'text' ? 'Text question' : t === 'single_choice' ? 'One-choice' : 'Multiple-choice'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function QuestionCard({ q, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  q: QuestionDraft;
  onUpdate: (q: QuestionDraft) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [showHint, setShowHint] = useState(false);

  const header = (
    <div className="fqe-card-top">
      <input
        className="fqe-q-input"
        placeholder="Enter question here..."
        value={q.question}
        onChange={e => onUpdate({ ...q, question: e.target.value })}
      />
      <div className="fqe-card-actions">
        <div className="fqe-hint-wrap"
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
        >
          <button className="fqe-icon-btn fqe-icon-btn--hint">?</button>
          {showHint && <div className="fqe-hint-popup">{HINTS[q.type]}</div>}
        </div>
        <button className="fqe-icon-btn fqe-icon-btn--del" onClick={onDelete}>✕</button>
      </div>
    </div>
  );

  if (q.type === 'text') {
    return (
      <div className="fqe-card">
        <div className="fqe-card-side">
          <button className="fqe-move-btn" onClick={onMoveUp} disabled={isFirst}>↑</button>
          <button className="fqe-move-btn" onClick={onMoveDown} disabled={isLast}>↓</button>
        </div>
        <div className="fqe-card-body">
          {header}
          <input
            className="fqe-q-input"
            placeholder="Enter answer(s) here..."
            value={q.answers}
            onChange={e => onUpdate({ ...q, answers: e.target.value })}
          />
        </div>
      </div>
    );
  }


  const isMultiple = q.type === 'multiple_choice';
  const choiceAnswers = q.answers as AnswerDraft[];

  function toggleCorrect(id: number) {
    const updated = isMultiple
      ? choiceAnswers.map(a => a.id === id ? { ...a, correct: !a.correct } : a)
      : choiceAnswers.map(a => ({ ...a, correct: a.id === id }));
    onUpdate({ ...q, answers: updated } as ChoiceDraft);
  }

  return (
    <div className="fqe-card">
      <div className="fqe-card-side">
        <button className="fqe-move-btn" onClick={onMoveUp} disabled={isFirst}>↑</button>
        <button className="fqe-move-btn" onClick={onMoveDown} disabled={isLast}>↓</button>
      </div>
      <div className="fqe-card-body">
        {header}
        <div className="fqe-answers">
          {q.answers.map(a => (
            <div key={a.id} className="fqe-answer-row">
              <button
                className="fqe-icon-btn fqe-icon-btn--del fqe-icon-btn--sm"
                onClick={() => onUpdate({ ...q, answers: q.answers.filter(x => x.id !== a.id) })}
              >✕</button>
              <button
                className={`fqe-correct-dot${a.correct ? ' fqe-correct-dot--on' : ''}`}
                onClick={() => toggleCorrect(a.id)}
              />
              <input
                className="fqe-q-input fqe-answer-input"
                placeholder="Enter answer..."
                value={a.text}
                onChange={e => onUpdate({ ...q, answers: q.answers.map(x => x.id === a.id ? { ...x, text: e.target.value } : x) })}
              />
            </div>
          ))}
          <div className="fqe-add-answer">
            <div className="fqe-add-answer-line">
              <button
                className="fqe-add-answer-btn"
                onClick={() => onUpdate({ ...q, answers: [...q.answers, { id: uid(), text: '', correct: false }] })}
              >+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function FormQuestionsEditor({ quiz, onSave, onExit }: {
  quiz: FormQuiz;
  onSave: (questions: Question[]) => void;
  onExit: () => void;
}) {
  const [questions, setQuestions] = useState<QuestionDraft[]>(quiz.questions.map(toDraft));
  const [saved, setSaved] = useState(false);

  function addQuestion(type: QuestionDraft['type'], at: number) {
    setQuestions(prev => { const next = [...prev]; next.splice(at, 0, blankDraft(type)); return next; });
  }

  function moveQuestion(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= questions.length) return;
    setQuestions(prev => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function handleSave() {
    onSave(questions.map(fromDraft));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="fqe-page">
      <div className="fqe-header">
        <h2 className="fqe-title">{quiz.title}</h2>
        <p className="fqe-subtitle">Form quiz</p>
      </div>

      <div className="fqe-list">
        {questions.length === 0
          ? <AddQuestionButton onAdd={type => addQuestion(type, 0)} />
          : questions.map((q, idx) => (
            <div key={q.id}>
              <QuestionCard
                q={q}
                onUpdate={updated => setQuestions(prev => prev.map((x, i) => i === idx ? updated : x))}
                onDelete={() => setQuestions(prev => prev.filter((_, i) => i !== idx))}
                onMoveUp={() => moveQuestion(idx, -1)}
                onMoveDown={() => moveQuestion(idx, 1)}
                isFirst={idx === 0}
                isLast={idx === questions.length - 1}
              />
              <AddQuestionButton onAdd={type => addQuestion(type, idx + 1)} />
            </div>
          ))
        }
      </div>

      {saved && <p className="qe-msg qe-msg--success">Saved!</p>}

      <div className="qe-footer">
        <Button variant="outline" onClick={onExit}>Exit</Button>
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  );
}
