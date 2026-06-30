import { createContext, useContext, useState, type ReactNode } from 'react';
import { ALL_QUIZZES } from '../data/quizzes';
import type { Quiz } from '../models/Quiz';

interface QuizContextType {
  allQuizzes: Quiz[];
  localQuizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id'>) => Quiz;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: number) => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [localQuizzes, setLocalQuizzes] = useState<Quiz[]>(() => {
    const stored = localStorage.getItem('qm_quizzes');
    return stored ? JSON.parse(stored) : [];
  });

  const allQuizzes = [...ALL_QUIZZES, ...localQuizzes];

  function save(quizzes: Quiz[]) {
    localStorage.setItem('qm_quizzes', JSON.stringify(quizzes));
    setLocalQuizzes(quizzes);
  }

  function addQuiz(data: Omit<Quiz, 'id'>): Quiz {
    const quiz = { ...data, id: Date.now() } as Quiz;
    save([...localQuizzes, quiz]);
    return quiz;
  }

  function updateQuiz(updated: Quiz) {
    save(localQuizzes.map(q => q.id === updated.id ? updated : q));
  }

  function deleteQuiz(id: number) {
    save(localQuizzes.filter(q => q.id !== id));
  }

  return (
    <QuizContext.Provider value={{ allQuizzes, localQuizzes, addQuiz, updateQuiz, deleteQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizzes() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuizzes must be used inside QuizProvider');
  return ctx;
}
