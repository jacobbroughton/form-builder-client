import { MultipleChoiceOptionType } from "../../../lib/types";
import CircleIcon from "../icons/CircleIcon";
import FilledCircleIcon from "../icons/FilledCircleIcon";
import "./MultipleChoiceForUser.css";

export const MultipleChoiceForUser = ({
  question,
  description,
  isRequired,
  options,
  handleOptionClick,
  disabled = false
}: {
  question: string;
  description: string;
  isRequired: boolean;
  options: MultipleChoiceOptionType[];
  handleOptionClick: () => void;
  disabled: boolean;
}) => {
  console.log(options)
  return (
    <div className="multiple-choice-for-user">
      <p className="small-text bold">
        {question}{" "}
        {isRequired ? (
          <span className="required">*</span>
        ) : (
          <span className="optional">(optional)</span>
        )}
      </p>
      {description && <p className="tiny-text">{description}</p>}
      {options.length === 0 ? (
        <div className="no-options-message">
          <p className="small-text">Multiple choice options not found</p>
        </div>
      ) : (
        <div className="options">
          {options.map((option, i) => (
            <button
              className={`${option.checked ? "checked" : ""}`}
              key={option.id}
              type="button"
              onClick={() => handleOptionClick(option)}
              disabled={disabled}
            >
              {option.checked ? <FilledCircleIcon /> : <CircleIcon />}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
