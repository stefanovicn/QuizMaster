import type { Question } from './Question';

export interface IQuizSession {
  setAnswer(questionId: number, answer: string | string[]): IQuizSession;
  getAnswer(questionId: number): string | string[] | undefined;
  getAllAnswers(): Record<number, string | string[]>;
  getTimeElapsed(): number;
  isComplete(questions: Question[]): boolean;
}
