import { CircleIcon } from "../icons/CircleIcon";
import { FilledCircleIcon } from "../icons/FilledCircleIcon";
import "./SingleSelectToggle.css";

export function SingleSelectToggle({
  label = "",
  options,
  onChange,
}: {
  label: string;
  options: { label: string; value: unknown; checkedCondition: boolean }[];
  onChange: (value: unknown) => void;
}) {
  return (
    <div className="single-select-toggle">
      <p className="small-text bold">{label}</p>
      <div className="toggle-container">
        {options.map((option) => (
          <button
            type="button"
            className={`${option.checkedCondition ? "selected" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.checkedCondition ? <FilledCircleIcon /> : <CircleIcon />}{" "}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
