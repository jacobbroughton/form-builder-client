import { useState } from "react";
import "./FormGroupContainer.css";

export function FormGroupContainer({
  label,
  description,
  inputValue,
  isRequired,
  disabled,
  placeholder,
  type,
  handleChange,
  canHide = false,
}: {
  label: string;
  description: string;
  inputValue: string;
  isRequired: boolean;
  disabled: boolean;
  placeholder: string;
  type: "Short Answer" | "Paragraph" | "Color" | "Date" | "Time";
  handleChange: (e: any) => void;
  canHide: boolean;
}) {
  const [inputVisible, setInputVisible] = useState(true);
  return (
    <div className={`form-group-container disabled`}>
      <header>
        <p className="small-text bold">
          {label}{" "}
          {isRequired ? (
            <span className="required">*</span>
          ) : (
            <span className="optional">(optional)</span>
          )}
        </p>
        {canHide && (
          <button
            className="hide-input-button"
            type="button"
            onClick={() => setInputVisible(!inputVisible)}
          >
            {inputVisible ? "Hide" : "Show"}
          </button>
        )}
      </header>

      {description && <p className="tiny-text">{description}</p>}
      {!inputVisible ? (
        false
      ) : type === "Short Answer" ? (
        <input
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
        />
      ) : type === "Paragraph" ? (
        <textarea
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
        />
      ) : type === "Date" ? (
        <input
          disabled={disabled}
          type="date"
          value={inputValue}
          onChange={handleChange}
        />
      ) : type === "Time" ? (
        <input
          disabled={disabled}
          type="time"
          value={inputValue}
          onChange={handleChange}
        />
      ) : type === "Color" ? (
        <div className={`input-wrapper color ${false ? "disabled" : ""}`}>
          <input
            disabled={disabled}
            type="color"
            value={inputValue}
            onChange={handleChange}
          />
          <p>{inputValue}</p>
        </div>
      ) : (
        false
      )}
    </div>
  );
}
