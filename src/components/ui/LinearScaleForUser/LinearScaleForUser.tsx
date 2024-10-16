import "./LinearScaleForUser.css";

export const LinearScaleForUser = ({
  question,
  description,
  isRequired,
  minLinearScale,
  maxLinearScale,
  value,
  onNumberSelect,
  disabled
}: {
  question: string;
  description: string;
  isRequired: boolean;
  minLinearScale: number;
  maxLinearScale: number;
  value: string;
  onNumberSelect: (number: string) => void;
  disabled: boolean;
}) => {
  const linearScaleOptions = [];

  for (let i = minLinearScale; i < maxLinearScale + 1; i++) {
    linearScaleOptions.push(`${i}`);
  }

  const minLinearScaleString = `${minLinearScale}`;
  const maxLinearScaleString = `${maxLinearScale}`;

  return (
    <div className="linear-scale-settings">
      <p className="small-text bold">
        {question}{" "}
        {isRequired ? (
          <span className="required">*</span>
        ) : (
          <span className="optional">(optional)</span>
        )}
      </p>
      {description && <p className="tiny-text">{description}</p>}

      <div className="picker-wrapper">
        <div className="line"></div>
        <div className="buttons">
          {linearScaleOptions.map((num) => (
            <button
              type="button"
              disabled={disabled}
              className={`button ${num == minLinearScaleString ? `min ` : ""} ${
                num == maxLinearScaleString ? `max ` : ""
              } ${value == num ? "selected" : ""}`}
              key={num}
              onClick={() => {
                onNumberSelect(`${num}`);
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
