import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { Quiz } from '../models/Quiz';
import { useUser } from '../context/UserContext';
import '../css/QuizCard.css';

interface QuizCardProps {
  quiz: Quiz;
  style?: React.CSSProperties;
}

export default function QuizCard({ quiz, style }: QuizCardProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isOwner = user?.isAdmin && user.username.toLowerCase() === quiz.author.toLowerCase();

  return (
    <Link to={`/quiz/${quiz.id}`} state={{ from: location.pathname }} className="quiz-card" style={style}>
      <div className="quiz-card-top">
        <div className="quiz-card-image">
          {quiz.imageUrl ? (
            <img src={quiz.imageUrl} alt={quiz.title} />
          ) : (
            <div className="quiz-card-image-placeholder" />
          )}
        </div>
        {isOwner && (
          <button
            className="quiz-card-edit-btn"
            onClick={e => { e.preventDefault(); navigate(`/admin/quiz-editor/${quiz.id}`); }}
            aria-label="Edit quiz"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}
      </div>
      <div className="quiz-card-meta">
        <span className="quiz-card-rating">☆ {quiz.rating}/10</span>
        <span className="quiz-card-author">Author: {quiz.author}</span>
      </div>
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-desc">{quiz.shortDescription}</p>
      <span className="quiz-card-count">{quiz.questionCount} questions</span>
    </Link>
  );
}
