export interface TextQuestion {
  id: number;
  type: 'text';
  text: string;
  correctAnswers: string[];
}

export interface SingleChoiceQuestion {
  id: number;
  type: 'single_choice';
  text: string;
  correctAnswer: string;
  wrongOptions: string[];
}

export interface MultipleChoiceQuestion {
  id: number;
  type: 'multiple_choice';
  text: string;
  correctAnswers: string[];
  wrongOptions: string[];
}

export type Question = TextQuestion | SingleChoiceQuestion | MultipleChoiceQuestion;
