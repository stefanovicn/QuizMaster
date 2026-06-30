import { useState } from 'react';
import QuizCard from './QuizCard';
import type { Quiz } from '../models/Quiz';

const VISIBLE = 3;

type QuizListProps = {
  title: string;
  quizzes: Quiz[];
};

export default function QuizList({ title, quizzes }: QuizListProps) {
  const [offset, setOffset] = useState(0);

  const shift = (dir: 1 | -1) => {
    setOffset(prev => {
      const next = prev + dir;
      if (next < 0) return Math.max(0, quizzes.length - VISIBLE);
      if (next > quizzes.length - VISIBLE) return 0;
      return next;
    });
  };

  const visible = quizzes.slice(offset, offset + VISIBLE);

  return (
    <div className="home-block">
      <div className="home-block-header">
        <h2 className="home-block-title">{title}</h2>
      </div>
      <div className="home-carousel-wrap">
        <div className="home-carousel">
          {visible.map((q, i) => (
            <QuizCard key={q.id} quiz={q} style={{ animationDelay: `${i * 0.17}s` }} />
          ))}
        </div>
        <button
          className="carousel-arrow"
          onClick={() => shift(1)}
          aria-label="Next"
        >
          &#187;&#187;
        </button>
      </div>
    </div>
  );
}