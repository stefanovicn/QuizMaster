import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { useUser } from '../../context/UserContext';
import { useQuizzes } from '../../context/QuizContext';
import type { Flashcard } from '../../models/Flashcard';
import type { FlashcardsQuiz, FormQuiz } from '../../models/Quiz';
import FormQuestionsEditor from './FormQuestionsEditor';
import '../../css/QuestionsEditor.css';

export default function QuestionsEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { localQuizzes, updateQuiz } = useQuizzes();

  const quiz = localQuizzes.find(q => q.id === Number(id));

  const initCards: Flashcard[] = quiz?.type === 'flashcards' && quiz.cards.length
    ? quiz.cards
    : [{ id: Date.now(), front: '', back: '' }];

  const [cards, setCards] = useState<Flashcard[]>(initCards);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user?.isAdmin) {
    return <Layout><p className="qe-msg qe-msg--error">No access.</p></Layout>;
  }
  if (!quiz) {
    return <Layout><p className="qe-msg qe-msg--error">Quiz not found.</p></Layout>;
  }
  if (quiz.type === 'form') {
    return (
      <Layout>
        <FormQuestionsEditor
          quiz={quiz as FormQuiz}
          onSave={questions => updateQuiz({ ...(quiz as FormQuiz), questions, questionCount: questions.length })}
          onExit={() => navigate(`/admin/quiz-editor/${id}`)}
        />
      </Layout>
    );
  }

  const card = cards[index];
  const sideKey = showBack ? 'back' : 'front';

  function updateCard(text: string) {
    setCards(prev => prev.map((c, i) => i === index ? { ...c, [sideKey]: text } : c));
  }

  function goTo(next: number) {
    setIndex(Math.max(0, Math.min(next, cards.length - 1)));
    setShowBack(false);
  }

  function moveCard(dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= cards.length) return;
    setCards(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setIndex(target);
  }

  function addCard() {
    const newCard: Flashcard = { id: Date.now(), front: '', back: '' };
    setCards(prev => [...prev, newCard]);
    setIndex(cards.length);
    setShowBack(false);
  }

  function handleSave() {
    const updated: FlashcardsQuiz = {
      ...(quiz as FlashcardsQuiz),
      cards,
      questionCount: cards.length,
    };
    updateQuiz(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Layout>
      <div className="qe-page">

        <div className="fce-header">
          <h2 className="fce-title">{quiz.title}</h2>
          <div className="fce-move-row">
            <span className="fce-move-label">Move flashcard</span>
            <button className="fce-arrow-btn" onClick={() => moveCard(-1)} disabled={index === 0}>←</button>
            <button className="fce-arrow-btn" onClick={() => moveCard(1)} disabled={index === cards.length - 1}>→</button>
          </div>
        </div>

        <div className="fce-card">
          <textarea
            className="fce-card-text"
            placeholder="Click to add text..."
            value={card[sideKey]}
            onChange={e => updateCard(e.target.value)}
          />
          <span className="fce-card-side">{showBack ? 'Answer side' : 'Question side'}</span>
        </div>

        <div className="fce-controls">
          <Button variant="primary" onClick={() => setShowBack(s => !s)}>Flip card</Button>
          <div className="fce-nav">
            <button className="fce-arrow-btn" onClick={() => goTo(index - 1)} disabled={index === 0}>←</button>
            <span className="fce-nav-count">{index + 1}/{cards.length}</span>
            <button className="fce-arrow-btn" onClick={() => goTo(index + 1)} disabled={index === cards.length - 1}>→</button>
          </div>
          <Button variant="secondary" onClick={addCard}>Add new flashcard</Button>
        </div>

        {saved && <p className="qe-msg qe-msg--success">Saved!</p>}

        <div className="qe-footer">
          <Button variant="outline" onClick={() => navigate(`/admin/quiz-editor/${id}`)}>Exit</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>

      </div>
    </Layout>
  );
}
