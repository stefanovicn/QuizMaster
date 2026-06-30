import type { FormQuiz } from './Quiz';
import type { IQuizResult } from './IQuizResult';
import type { Grade } from './IQuizResult';

export class QuizResultModel implements IQuizResult {
  private readonly _quiz: FormQuiz;
  private readonly _answers: Record<number, string | string[]>;
  readonly timeElapsed: number;
  readonly timeRemaining: number | null;

  constructor(
    quiz: FormQuiz,
    answers: Record<number, string | string[]>,
    timeElapsed: number,
    timeRemaining: number | null
  ) {
    this._quiz = quiz;
    this._answers = answers;
    this.timeElapsed = timeElapsed;
    this.timeRemaining = timeRemaining;
  }

  get quiz(): FormQuiz {
    return this._quiz;
  }

  gradeQuestion(questionId: number): Grade {
    const question = this._quiz.questions.find(q => q.id === questionId);
    if (!question) return 'wrong';
    const answer = this._answers[questionId];

    if (question.type === 'text') {
      const userAnswer = ((answer as string) ?? '').trim().toLowerCase();
      return question.correctAnswers.some(a => a.toLowerCase() === userAnswer) ? 'correct' : 'wrong';
    }
    if (question.type === 'single_choice') {
      return answer === question.correctAnswer ? 'correct' : 'wrong';
    }
    if (question.type === 'multiple_choice') {
      const userAnswers = (answer as string[]) ?? [];
      const correctSet = new Set(question.correctAnswers);
      const selectedCorrect = userAnswers.filter(a => correctSet.has(a));
      const selectedWrong = userAnswers.filter(a => !correctSet.has(a));
      if (selectedCorrect.length === question.correctAnswers.length && selectedWrong.length === 0) return 'correct';
      if (selectedCorrect.length === 0) return 'wrong';
      return 'partial';
    }
    return 'wrong';
  }

  getAnswer(questionId: number): string | string[] | undefined {
    return this._answers[questionId];
  }

  getScore(): { correct: number; partial: number; wrong: number; total: number } {
    const score = { correct: 0, partial: 0, wrong: 0, total: this._quiz.questions.length };
    for (const q of this._quiz.questions) {
      score[this.gradeQuestion(q.id)]++;
    }
    return score;
  }

  getScorePercent(): number {
    const { correct, partial, total } = this.getScore();
    if (total === 0) return 0;
    return Math.round(((correct + partial * 0.5) / total) * 100);
  }
}