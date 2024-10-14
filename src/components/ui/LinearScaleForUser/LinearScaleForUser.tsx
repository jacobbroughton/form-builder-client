import "./LinearScaleForUser.css";

export const LinearScaleForUser = ({
  question,
  description,
  isRequired,
  minLinearScale,
  maxLinearScale,
  selectedLinearScaleNumber,
  setSelectedLinearScaleNumber,
}: {
  question: string;
  description: string;
  isRequired: boolean;
  minLinearScale: number;
  maxLinearScale: number;
  selectedLinearScaleNumber: number | null;
  setSelectedLinearScaleNumber: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const linearScaleOptions = [];

  for (let i = minLinearScale; i < maxLinearScale + 1; i++) {
    linearScaleOptions.push(i);
  }

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

      <p className="small-text">
        <i>
          Select a number between {minLinearScale} and {maxLinearScale}
        </i>
      </p>

      <div className="picker-wrapper">
        <div className="line"></div>
        <div className="buttons">
          {linearScaleOptions.map((num) => (
            <button
              type="button"
              disabled={false}
              className={`button ${num === minLinearScale ? `min ` : ""} ${
                num === maxLinearScale ? `max ` : ""
              } ${selectedLinearScaleNumber === num ? "selected" : ""}`}
              key={num}
              onClick={() => {
                setSelectedLinearScaleNumber(num);
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
