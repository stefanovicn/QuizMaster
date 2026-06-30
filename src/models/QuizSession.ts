import type { Question } from './Question';
import type { IQuizSession } from './IQuizSession';

export class QuizSession implements IQuizSession {
  private readonly _startedAt: number;
  private readonly _answers: Record<number, string | string[]>;

  constructor(startedAt: number = Date.now(), answers: Record<number, string | string[]> = {}) {
    this._startedAt = startedAt;
    this._answers = answers;
  }

  setAnswer(questionId: number, answer: string | string[]): QuizSession {
    return new QuizSession(this._startedAt, { ...this._answers, [questionId]: answer });
  }

  getAnswer(questionId: number): string | string[] | undefined {
    return this._answers[questionId];
  }

  getAllAnswers(): Record<number, string | string[]> {
    return { ...this._answers };
  }

  getTimeElapsed(): number {
    return Math.floor((Date.now() - this._startedAt) / 1000);
  }

  isComplete(questions: Question[]): boolean {
    return questions.every(q => {
      const answer = this._answers[q.id];
      if (q.type === 'text') return typeof answer === 'string' && answer.trim() !== '';
      if (q.type === 'single_choice') return typeof answer === 'string';
      if (q.type === 'multiple_choice') return Array.isArray(answer) && answer.length > 0;
      return false;
    });
  }
}
