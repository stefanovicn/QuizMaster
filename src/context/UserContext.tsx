import { createContext, useContext, useState, type ReactNode } from 'react';

export interface User {
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface QuizResultEntry {
  quizId: number;
  quizTitle: string;
  scorePercent: number;
  correct: number;
  total: number;
  timeElapsed: number;
  date: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  quizResults: QuizResultEntry[];
  addQuizResult: (entry: QuizResultEntry) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    const stored = localStorage.getItem('qm_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [quizResults, setQuizResults] = useState<QuizResultEntry[]>(() => {
    const stored = localStorage.getItem('qm_results');
    return stored ? JSON.parse(stored) : [];
  });

  function setUser(newUser: User) {
    localStorage.setItem('qm_user', JSON.stringify(newUser));
    setUserState(newUser);
  }

  function logout() {
    localStorage.removeItem('qm_user');
    setUserState(null);
  }

  function addQuizResult(entry: QuizResultEntry) {
    setQuizResults(prev => {
      const updated = [entry, ...prev].slice(0, 20);
      localStorage.setItem('qm_results', JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, quizResults, addQuizResult }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}