import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useQuizzes } from '../context/QuizContext';
import type { Question } from '../models/Question';
import { QuizResultModel } from '../models/QuizResultModel';
import { useUser } from '../context/UserContext';
import '../css/QuizResult.css';

interface ResultState {
  quizId: number;
  answers: Record<number, string | string[]>;
  timeElapsed: number;
  timeRemaining: number | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function QuestionResult({ question, result }: { question: Question; result: QuizResultModel }) {
  const grade = result.gradeQuestion(question.id);
  const answer = result.getAnswer(question.id);
  const gradeClass = grade === 'correct'
    ? 'result-question--correct'
    : grade === 'partial'
    ? 'result-question--partial'
    : 'result-question--wrong';

  if (question.type === 'text') {
    const userAnswer = (answer as string) ?? '';
    return (
      <div className={`result-question-card ${gradeClass}`}>
        <p className="result-question-text">{question.text}</p>
        <input placeholder="s" title=" " className="result-question-input" value={userAnswer || '(no answer)'} readOnly />
        {grade === 'wrong' && (
          <p className="result-question-correct-answer">Correct answer: {question.correctAnswers.join(' / ')}</p>
        )}
      </div>
    );
  }

  if (question.type === 'single_choice') {
    const userAnswer = (answer as string) ?? null;
    const allOptions = [question.correctAnswer, ...question.wrongOptions];
    return (
      <div className={`result-question-card ${gradeClass}`}>
        <p className="result-question-text">{question.text}</p>
        <div className="result-question-options">
          {allOptions.map(opt => (
            <label key={opt} className="result-question-option">
              <input
                type="radio"
                name={`result-${question.id}`}
                checked={userAnswer === opt}
                readOnly
                onChange={() => {}}
              />
              {opt}
            </label>
          ))}
        </div>
        {grade === 'wrong' && (
          <p className="result-question-correct-answer">Correct answer: {question.correctAnswer}</p>
        )}
      </div>
    );
  }

  if (question.type === 'multiple_choice') {
    const userAnswers = (answer as string[]) ?? [];
    const allOptions = [...question.correctAnswers, ...question.wrongOptions];
    return (
      <div className={`result-question-card ${gradeClass}`}>
        <p className="result-question-text">{question.text}</p>
        <div className="result-question-options">
          {allOptions.map(opt => (
            <label key={opt} className="result-question-option">
              <input
                type="checkbox"
                checked={userAnswers.includes(opt)}
                readOnly
                onChange={() => {}}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function QuizResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultState | null;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const { addQuizResult } = useUser();
  const savedRef = useRef(false);
  const { allQuizzes } = useQuizzes();

  const quiz = allQuizzes.find(q => q.id === Number(id));

  useEffect(() => {
    if (savedRef.current || !quiz || quiz.type !== 'form' || !state) return;
    savedRef.current = true;
    const result = new QuizResultModel(quiz, state.answers, state.timeElapsed, state.timeRemaining);
    const score = result.getScore();
    addQuizResult({
      quizId: quiz.id,
      quizTitle: quiz.title,
      scorePercent: result.getScorePercent(),
      correct: score.correct,
      total: score.total,
      timeElapsed: state.timeElapsed,
      date: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
  if (!quiz || quiz.type !== 'form' || !state) return;
  const result = new QuizResultModel(quiz, state.answers, state.timeElapsed, state.timeRemaining);
  if (result.getScorePercent() < 80) return;

  const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
  const pieces: HTMLDivElement[] = [];

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = `${Math.random() * 2}s`;
    el.style.animationDuration = `${2 + Math.random() * 2}s`;
    el.style.width = `${6 + Math.random() * 8}px`;
    el.style.height = `${6 + Math.random() * 8}px`;
    document.body.appendChild(el);
    pieces.push(el);
  }

  const timeout = setTimeout(() => pieces.forEach(p => p.remove()), 5000);

  return () => {
    clearTimeout(timeout);
    pieces.forEach(p => p.remove());
  };
}, []);

  if (!quiz || !state) {
    return (
      <Layout>
        <p className="quiz-result-error">Result not found.</p>
      </Layout>
    );
  }

  const displayRating = hoverRating || rating;

  if (showDetails && quiz.type === 'form') {
    const result = new QuizResultModel(quiz, state.answers, state.timeElapsed, state.timeRemaining);
    const score = result.getScore();

    return (
      <Layout>
        <div className="quiz-result">
          <h1 className="quiz-result-title">{quiz.title}</h1>
          <p className="quiz-result-author">Author: {quiz.author}</p>

          <p className="result-score">
            Score: {result.getScorePercent()}% &nbsp;·&nbsp; {score.correct}/{score.total} correct
          </p>

          <div className="result-details">
            {quiz.questions.map(q => (
              <QuestionResult key={q.id} question={q} result={result} />
            ))}

            <Button onClick={() => setShowDetails(false)}>Exit</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="quiz-result">
        <h1 className="quiz-result-title">{quiz.title}</h1>
        <p className="quiz-result-author">Author: {quiz.author}</p>

        <div className="quiz-result-card">
          <p className="quiz-result-submitted">Your results have been submitted</p>
          {quiz.type === 'form' && (() => {
            const result = new QuizResultModel(quiz, state.answers, state.timeElapsed, state.timeRemaining);
            const score = result.getScore();
            return (
              <p className="quiz-result-score">
                Score: {result.getScorePercent()}% &nbsp;·&nbsp; {score.correct}/{score.total} correct
              </p>
            );
          })()}

          <div className="quiz-result-info">
            <p>Time elapsed: {formatTime(state.timeElapsed)}</p>
            {state.timeRemaining !== null && (
              <p>Time remaining: {formatTime(state.timeRemaining)}</p>
            )}
          </div>

          <div className="quiz-result-rating">
            <span>Rate this quiz:</span>
            <div className="quiz-result-stars">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(star => (
                <button
                  key={star}
                  className="quiz-result-star"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} out of 10`}
                >
                  {star <= displayRating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-result-actions">
            <Button variant="secondary" onClick={() => setShowDetails(true)} disabled={quiz.type !== 'form'}>
              View your results
            </Button>
            <Button onClick={() => navigate(`/quiz/${id}`)}>Back</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}