import type { SingleChoiceQuestion } from '../../models/Question';

interface Props {
  question: SingleChoiceQuestion;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}

export default function SingleChoiceQuestionComponent({ question, options, value, onChange }: Props) {
  return (
    <div className="quiz-question-card">
      <p className="quiz-question-text">{question.text}</p>
      <div className="quiz-question-options">
        {options.map(option => (
          <label key={option} className="quiz-question-option">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
