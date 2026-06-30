export type Grade = 'correct' | 'partial' | 'wrong';

export interface IQuizResult {
  gradeQuestion(questionId: number): Grade;
  getAnswer(questionId: number): string | string[] | undefined;
  getScore(): { correct: number; partial: number; wrong: number; total: number };
  getScorePercent(): number;
}
