import "./FormGroupContainer.css";
const FormGroupContainer = ({
  label,
  inputValue,
  isRequired,
  placeholder,
  type,
  handleChange,
}: {
  label: string;
  inputValue: string;
  isRequired: boolean;
  placeholder: string;
  type: "input" | "textarea";
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
      {type === "textarea" ? (
        <textarea value={inputValue} placeholder={placeholder} onChange={handleChange} />
      ) : (
        <input value={inputValue} onChange={handleChange} placeholder={placeholder} />
      )}
    </div>
  );
};
export default FormGroupContainer;
