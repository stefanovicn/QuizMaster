import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { useUser } from '../../context/UserContext';
import { useQuizzes } from '../../context/QuizContext';
import type { QuizType } from '../../models/Quiz';
import '../../css/QuizEditor.css';

const TITLE_MAX = 50;

interface Language {
  code: string;
  name: string;
}

function toSeconds(str: string): number | undefined {
  const parts = str.trim().split(':').map(Number);
  if (parts.some(isNaN) || parts.length < 2 || parts.length > 3) return undefined;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function fromSeconds(s?: number): string {
  if (!s) return '';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function QuizEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { localQuizzes, addQuiz, updateQuiz, deleteQuiz } = useQuizzes();

  const isNew = id === 'new';
  const existing = isNew ? null : (localQuizzes.find(q => q.id === Number(id)) ?? null);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [quizType, setQuizType] = useState<QuizType>(existing?.type ?? 'form');
  const [language, setLanguage] = useState(existing?.language ?? '');
  const [timeLimit, setTimeLimit] = useState(fromSeconds(existing?.type === 'form' ? existing.timeLimit : undefined));
  const [shortDesc, setShortDesc] = useState(existing?.shortDescription ?? '');
  const [longDesc, setLongDesc] = useState(existing?.longDescription ?? '');
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? '');
  const [categories, setCategories] = useState<string[]>(existing?.categories ?? []);
  const [catInput, setCatInput] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [langsLoading, setLangsLoading] = useState(true);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('https://libretranslate.com/languages')
      .then(r => r.json())
      .then((data: Language[]) => setLanguages(data))
      .catch(() => {})
      .finally(() => setLangsLoading(false));
  }, []);

  if (!user?.isAdmin) {
    return (
      <Layout>
        <p className="qe-msg qe-msg--error">You don't have access to this page.</p>
      </Layout>
    );
  }

  function addCategory() {
    const v = catInput.trim();
    if (v && !categories.includes(v)) setCategories(p => [...p, v]);
    setCatInput('');
    setCatOpen(false);
  }

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) {
      setError('Image must be smaller than 512 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function buildBase() {
    return {
      title: title.trim(),
      shortDescription: shortDesc.trim(),
      longDescription: longDesc.trim(),
      author: user!.username,
      rating: existing?.rating ?? 0,
      categories,
      language: language || undefined,
      imageUrl: imageUrl || undefined,
      timeLimit: toSeconds(timeLimit),
    };
  }

  function validate(): boolean {
    if (!title.trim()) { setError('Title is required.'); return false; }
    setError('');
    return true;
  }

  function handleSave() {
    if (!validate()) return;
    const base = buildBase();
    if (existing) {
      const typeChanged = existing.type !== quizType;
      if (quizType === 'form') {
        updateQuiz({ ...existing, ...base, type: 'form', questions: typeChanged ? [] : (existing.type === 'form' ? existing.questions : []), questionCount: typeChanged ? 0 : existing.questionCount });
      } else {
        updateQuiz({ ...existing, ...base, type: 'flashcards', cards: typeChanged ? [] : (existing.type === 'flashcards' ? existing.cards : []), questionCount: typeChanged ? 0 : existing.questionCount });
      }
    } else {
      const data = quizType === 'form'
        ? { ...base, type: 'form' as const, questions: [], questionCount: 0 }
        : { ...base, type: 'flashcards' as const, cards: [], questionCount: 0 };
      const created = addQuiz(data);
      navigate(`/admin/quiz-editor/${created.id}`, { replace: true });
      setSaved(true);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleEditQuestions() {
    if (!validate()) return;
    if (isNew) {
      const base = buildBase();
      const data = quizType === 'form'
        ? { ...base, type: 'form' as const, questions: [], questionCount: 0 }
        : { ...base, type: 'flashcards' as const, cards: [], questionCount: 0 };
      const created = addQuiz(data);
      navigate(`/admin/quiz-editor/${created.id}/questions`);
    } else {
      handleSave();
      navigate(`/admin/quiz-editor/${id}/questions`);
    }
  }

  function handleDelete() {
    if (!existing) return;
    deleteQuiz(existing.id);
    navigate('/admin/my-quizzes');
  }

  return (
    <Layout>
      <div className="qe-page">

        {/* Title row */}
        <div className="qe-title-row">
          <input
            className="qe-title-input"
            value={title}
            maxLength={TITLE_MAX}
            placeholder="Quiz title"
            onChange={e => setTitle(e.target.value)}
          />
          <span className="qe-char-count">{title.length}/{TITLE_MAX}</span>
        </div>

        {/* Meta row */}
        <div className="qe-meta-row">
          <div className="qe-meta-item">
            <span className="qe-meta-label">Type:</span>
            <div className="qe-select-wrap">
              <select
                className="qe-select"
                value={quizType}
                disabled={false}
                onChange={e => setQuizType(e.target.value as QuizType)}
              >
                <option value="form">Form</option>
                <option value="flashcards">Flashcards</option>
              </select>
            </div>
          </div>

          <div className="qe-meta-item">
            <span className="qe-meta-label">Language:</span>
            <div className="qe-select-wrap">
              <select
                className="qe-select"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="">—</option>
                {langsLoading
                  ? <option disabled>Loading...</option>
                  : languages.map(l => <option key={l.code} value={l.name}>{l.name}</option>)
                }
              </select>
            </div>
          </div>

          {quizType === 'form' && (
            <div className="qe-meta-item">
              <span className="qe-meta-label">Time limit:</span>
              <input
                className="qe-time-input"
                value={timeLimit}
                placeholder="0:00:00"
                onChange={e => setTimeLimit(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="qe-meta-row">
          <span className="qe-meta-label">Categories:</span>
          {categories.map(c => (
            <span key={c} className="qe-cat-chip">
              {c}
              <button className="qe-chip-x" onClick={() => setCategories(p => p.filter(x => x !== c))} type="button">✕</button>
            </span>
          ))}
          <div className="qe-cat-add-wrap">
            <button className="qe-cat-plus" onClick={() => setCatOpen(o => !o)} type="button">+</button>
            {catOpen && (
              <div className="qe-cat-popup">
                <input
                  className="qe-cat-input"
                  autoFocus
                  placeholder="Category name"
                  value={catInput}
                  onChange={e => setCatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
                />
                <button className="qe-cat-confirm" onClick={addCategory} type="button">Add</button>
              </div>
            )}
          </div>
        </div>

        {/* Short description */}
        <textarea
          className="qe-short-desc"
          placeholder="Click to edit short description..."
          value={shortDesc}
          onChange={e => setShortDesc(e.target.value)}
        />

        {/* Icon + long description card */}
        <div className="qe-desc-card">
          <div className="qe-icon-area" onClick={() => fileRef.current?.click()}>
            {imageUrl
              ? <img src={imageUrl} alt="Quiz icon" className="qe-icon-preview" />
              : <div className="qe-icon-placeholder" />
            }
            <span className="qe-icon-label">Click to import icon...</span>
            <input ref={fileRef} type="file" accept="image/*" className="qe-file-input" onChange={handleIconChange} />
          </div>
          <textarea
            className="qe-long-desc"
            placeholder="Click to edit description..."
            value={longDesc}
            onChange={e => setLongDesc(e.target.value)}
          />
        </div>

        {error && <p className="qe-msg qe-msg--error">{error}</p>}
        {saved && <p className="qe-msg qe-msg--success">Saved!</p>}

        {/* Footer */}
        <div className="qe-footer">
          <Button variant="danger" onClick={() => navigate('/admin/my-quizzes')}>Exit</Button>
          <Button variant="secondary" onClick={handleEditQuestions}>Edit questions</Button>
          <Button onClick={handleSave}>Save changes</Button>
          {existing && (
            <Button variant="danger" onClick={handleDelete}>Delete quiz</Button>
          )}
        </div>

      </div>
    </Layout>
  );
}
