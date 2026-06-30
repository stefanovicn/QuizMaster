import type { Question } from './Question';
import type { Flashcard } from './Flashcard';

export type QuizType = 'form' | 'flashcards';

interface BaseQuiz {
  id: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  author: string;
  rating: number;
  questionCount: number;
  categories: string[];
  imageUrl?: string;
  language?: string;
  timeLimit?: number;
}

export interface FormQuiz extends BaseQuiz {
  type: 'form';
  questions: Question[];
}

export interface FlashcardsQuiz extends BaseQuiz {
  type: 'flashcards';
  cards: Flashcard[];
}

export type Quiz = FormQuiz | FlashcardsQuiz;
