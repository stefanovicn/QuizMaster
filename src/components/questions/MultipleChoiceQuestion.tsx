import type { MultipleChoiceQuestion } from '../../models/Question';

interface Props {
  question: MultipleChoiceQuestion;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultipleChoiceQuestionComponent({ question, options, value, onChange }: Props) {
  function toggle(option: string) {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <div className="quiz-question-card">
      <p className="quiz-question-text">{question.text}</p>
      <div className="quiz-question-options">
        {options.map(option => (
          <label key={option} className="quiz-question-option">
            <input
              type="checkbox"
              value={option}
              checked={value.includes(option)}
              onChange={() => toggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
