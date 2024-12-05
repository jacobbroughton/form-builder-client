import { useState } from "react";
import "./LinearScaleForAdmin.css";

export function LinearScaleForAdmin ({
  minLinearScale,
  setMinLinearScale,
  maxLinearScale,
  setMaxLinearScale,
}: {
  minLinearScale: number;
  setMinLinearScale: React.Dispatch<React.SetStateAction<number>>;
  maxLinearScale: number;
  setMaxLinearScale: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [scaleToMove, setScaleToMove] = useState<"min" | "max" | null>(null);

  const initialLinearScaleOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const linearScaleOptions = [];

  for (let i = minLinearScale; i < maxLinearScale + 1; i++) {
    linearScaleOptions.push(i);
  }

  return (
    <div className="linear-scale-settings">
      <p className="small-text">Linear Scale Settings *</p>
      <p className="small-text">
        Create a range for users to select a number from. (Default: 1 - 10)
      </p>
      {!scaleToMove && (
        <p className="small-text">
          <i>
            To adjust, select the current '<strong>min</strong>' or '<strong>max</strong>'
          </i>
        </p>
      )}
      {scaleToMove === "min" && (
        <p className="small-text">
          <i>
            Select a new <strong>min</strong>
          </i>
        </p>
      )}
      {scaleToMove === "max" && (
        <p className="small-text">
          <i>
            Select a new <strong>max</strong>
          </i>
        </p>
      )}
      <div className="picker-wrapper">
        <div className="line"></div>
        <div className="buttons">
          {(scaleToMove ? initialLinearScaleOptions : linearScaleOptions).map((num) => (
            <button
              type="button"
              disabled={
                !scaleToMove &&
                (num < minLinearScale ||
                  num > maxLinearScale ||
                  (num > minLinearScale && num < maxLinearScale))
              }
              className={`button ${
                num === minLinearScale
                  ? `min ${scaleToMove === "min" ? "selected" : ""}`
                  : ""
              } ${
                num === maxLinearScale
                  ? `max ${scaleToMove === "max" ? "selected" : ""}`
                  : ""
              }`}
              key={num}
              onClick={() => {
                console.log({num, minLinearScale, maxLinearScale})
                if (num === minLinearScale) {
                  if (scaleToMove === "min") {
                    setScaleToMove(null);
                    setMinLinearScale(1);
                  } else setScaleToMove("min");
                } else if (num === maxLinearScale) {
                  if (scaleToMove === "max") {
                    setScaleToMove(null);
                    setMaxLinearScale(10);
                  } else setScaleToMove("max");
                } else {
                  if (scaleToMove === "min") {
                    if (num > maxLinearScale) {
                      setMinLinearScale(maxLinearScale);
                      setMaxLinearScale(num);
                    } else {
                      setMinLinearScale(num);
                    }
                  } else if (scaleToMove === "max") {
                    if (num < minLinearScale) {
                      setMaxLinearScale(minLinearScale);
                      setMinLinearScale(num);
                    } else {
                      setMaxLinearScale(num);
                    }
                  }
                  setScaleToMove(null);
                }
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      <p className="small-text">
        Users will be able to select a number <strong>between {minLinearScale}</strong>{" "}
        and <strong>{maxLinearScale}</strong>
      </p>
    </div>
  );
};
