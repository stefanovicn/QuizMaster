import type { TextQuestion } from '../../models/Question';

interface Props {
  question: TextQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function TextQuestionComponent({ question, value, onChange }: Props) {
  return (
    <div className="quiz-question-card">
      <p className="quiz-question-text">{question.text}</p>
      <input
        type="text"
        className="quiz-question-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Your answer..."
      />
    </div>
  );
}
