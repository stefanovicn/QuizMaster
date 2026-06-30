import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TextQuestionComponent from '../components/questions/TextQuestion';
import SingleChoiceQuestionComponent from '../components/questions/SingleChoiceQuestion';
import MultipleChoiceQuestionComponent from '../components/questions/MultipleChoiceQuestion';
import { useQuizzes } from '../context/QuizContext';
import { shuffle } from '../utils/shuffle';
import { QuizSession } from '../models/QuizSession';
import type { IQuizSession } from '../models/IQuizSession';
import '../css/QuizPlay.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function QuizPlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<IQuizSession>(() => new QuizSession());

  const { allQuizzes } = useQuizzes();
  const quiz = allQuizzes.find(q => q.id === Number(id));

  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz?.type === 'form' && quiz.timeLimit ? quiz.timeLimit : null
  );

  const [shuffledOptions] = useState<Record<number, string[]>>(() => {
    if (!quiz || quiz.type !== 'form') return {};
    const result: Record<number, string[]> = {};
    for (const q of quiz.questions) {
      if (q.type === 'single_choice') {
        result[q.id] = shuffle([q.correctAnswer, ...q.wrongOptions]);
      } else if (q.type === 'multiple_choice') {
        result[q.id] = shuffle([...q.correctAnswers, ...q.wrongOptions]);
      }
    }
    return result;
  });

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    const timer = setTimeout(() => {
      setTimeRemaining(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining]);

  useEffect(() => {
    if (timeRemaining !== 0) return;
    if (!quiz || quiz.type !== 'form') return;
    navigate(`/quiz/${id}/result`, {
      state: {
        quizId: Number(id),
        answers: session.getAllAnswers(),
        timeElapsed: quiz.timeLimit ?? 0,
        timeRemaining: 0,
      },
    });
  }, [timeRemaining]);

  if (!quiz) {
    return (
      <Layout>
        <p className="quiz-play-error">Quiz not found.</p>
      </Layout>
    );
  }

  if (quiz.type !== 'form') {
    return (
      <Layout>
        <p className="quiz-play-error">This quiz uses the flashcard player.</p>
      </Layout>
    );
  }

  function handleSubmit() {
    if (!quiz || quiz.type !== 'form') return;
    const initialTime = quiz.timeLimit ?? null;
    const timeElapsed = initialTime !== null && timeRemaining !== null
      ? initialTime - timeRemaining
      : session.getTimeElapsed();
    navigate(`/quiz/${id}/result`, {
      state: {
        quizId: Number(id),
        answers: session.getAllAnswers(),
        timeElapsed,
        timeRemaining,
      },
    });
  }

  function setAnswer(questionId: number, value: string | string[]) {
    setSession(prev => prev.setAnswer(questionId, value));
  }

  return (
    <Layout>
      {timeRemaining !== null && (
        <div className="quiz-play-timer">! {formatTime(timeRemaining)}</div>
      )}

      <div className="quiz-play">
        <h1 className="quiz-play-title">{quiz.title}</h1>
        <p className="quiz-play-author">Author: {quiz.author}</p>

        <div className="quiz-play-questions">
          {quiz.questions.map(q => {
            if (q.type === 'text') {
              return (
                <TextQuestionComponent
                  key={q.id}
                  question={q}
                  value={(session.getAnswer(q.id) as string) ?? ''}
                  onChange={val => setAnswer(q.id, val)}
                />
              );
            }
            if (q.type === 'single_choice') {
              return (
                <SingleChoiceQuestionComponent
                  key={q.id}
                  question={q}
                  options={shuffledOptions[q.id] ?? []}
                  value={(session.getAnswer(q.id) as string) ?? null}
                  onChange={val => setAnswer(q.id, val)}
                />
              );
            }
            if (q.type === 'multiple_choice') {
              return (
                <MultipleChoiceQuestionComponent
                  key={q.id}
                  question={q}
                  options={shuffledOptions[q.id] ?? []}
                  value={(session.getAnswer(q.id) as string[]) ?? []}
                  onChange={val => setAnswer(q.id, val)}
                />
              );
            }
            return null;
          })}
        </div>

        <div className="quiz-play-actions">
          <button className="quiz-play-submit" onClick={handleSubmit}>
            Submit
          </button>
          <button className="quiz-play-exit" onClick={() => navigate(`/quiz/${id}`)}>
            ⚠️ Exit without saving
          </button>
        </div>
      </div>
    </Layout>
  );
}