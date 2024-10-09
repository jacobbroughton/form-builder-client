import "./FormGroupContainer.css";
const FormGroupContainer = ({
  label,
  description,
  inputValue,
  isRequired,
  disabled,
  placeholder,
  type,
  handleChange,
}: {
  label: string;
  description: string;
  inputValue: string;
  isRequired: boolean;
  disabled: boolean;
  placeholder: string;
  type: "Short Answer" | "Paragraph" | "Color" | "Date" | "Time";
  handleChange: (e: any) => void;
}) => {
  return (
    <div className="form-group-container">
      <p className="small-text bold">
        {label}{" "}
        {isRequired ? (
          <span className="required">*</span>
        ) : (
          <span className="optional">(optional)</span>
        )}
      </p>
      {description && <p className="small-text">{description}</p>}
      {type === "Short Answer" ? (
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
};
export default FormGroupContainer;
