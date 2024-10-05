import { useEffect, useState } from "react";
import { AddedInputType } from "../../../lib/types";
import "./FormInput.css";

export const FormInput = ({
  readOnly,
  input,
  inputs,
  setInputs,
}: {
  readOnly: boolean;
  input: AddedInputType;
  inputs: AddedInputType[];
  setInputs: React.Dispatch<React.SetStateAction<AddedInputType[]>>;
}) => {
  const [value, setValue] = useState(input.properties?.[`default-value`]?.value || "");

  function renderInput() {
    switch (input.input_type_name) {
      case "Text": {
        return (
          <input
            disabled={readOnly}
            type={"Text"}
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            // defaultValue={input.properties?.[`default-value`]?.value}
            minLength={parseInt(input.properties?.[`min`]?.value || "0")}
            maxLength={parseInt(input.properties?.[`max`]?.value)}
            value={input.value}
            onChange={(e) => {
              setInputs(
                inputs.map((localInput) => ({
                  ...localInput,
                  ...(localInput.id === input.id && {
                    value: e.target.value,
                  }),
                }))
              );
            }}
          />
        );
      }
      case "Textarea": {
        return (
          <textarea
            disabled={readOnly}
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            minLength={parseInt(input.properties?.[`min`]?.value || "0")}
            maxLength={parseInt(input.properties?.[`max`]?.value)}
            value={input.value}
            onChange={(e) => {
              setInputs(
                inputs.map((localInput) => ({
                  ...localInput,
                  ...(localInput.id === input.id && {
                    value: e.target.value,
                  }),
                }))
              );
            }}
          />
        );
      }
      case "Number": {
        return (
          <input
            type="number"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            min={input.properties?.[`min`]?.value}
            max={input.properties?.[`max`]?.value}
            step={input.properties?.[`step`]?.value}
            value={input.value}
            onChange={(e) => {
              setInputs(
                inputs.map((localInput) => ({
                  ...localInput,
                  ...(localInput.id === input.id && {
                    value: e.target.value,
                  }),
                }))
              );
            }}
          />
        );
      }
      case "Email": {
        return (
          <input
            type="email"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            value={input.value}
            onChange={(e) => {
              setInputs(
                inputs.map((localInput) => ({
                  ...localInput,
                  ...(localInput.id === input.id && {
                    value: e.target.value,
                  }),
                }))
              );
            }}
          />
        );
      }
      case "URL": {
        return (
          <input
            type="url"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            value={input.value}
            onChange={(e) => {
              setInputs(
                inputs.map((localInput) => ({
                  ...localInput,
                  ...(localInput.id === input.id && {
                    value: e.target.value,
                  }),
                }))
              );
            }}
          />
        );
      }
      case "Telephone": {
        return (
          <input
            type="tel"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            value={input.value}
            onChange={(e) => {
              setInputs(
                inputs.map((localInput) => ({
                  ...localInput,
                  ...(localInput.id === input.id && {
                    value: e.target.value,
                  }),
                }))
              );
            }}
          />
        );
      }
      case "Date": {
        return (
          <input
            type="date"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            min={input.properties?.[`min`]?.value}
            max={input.properties?.[`max`]?.value}
            value={input.value}
            onChange={(e) => {
              setInputs(
                inputs.map((localInput) => ({
                  ...localInput,
                  ...(localInput.id === input.id && {
                    value: e.target.value,
                  }),
                }))
              );
            }}
          />
        );
      }
      case "Time": {
        return (
          <input
            type="time"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            min={input.properties?.[`min`]?.value}
            max={input.properties?.[`max`]?.value}
            value={input.value}
            onChange={(e) => {
              setInputs(
                inputs.map((localInput) => ({
                  ...localInput,
                  ...(localInput.id === input.id && {
                    value: e.target.value,
                  }),
                }))
              );
            }}
          />
        );
      }

      case "Color": {
        return (
          <div className="input-wrapper">
            <input
              type="color"
              defaultValue={input.properties?.[`default-value`]?.value}
              value={input.value}
              onChange={(e) => {
                setInputs(
                  inputs.map((localInput) => ({
                    ...localInput,
                    ...(localInput.id === input.id && {
                      value: e.target.value,
                    }),
                  }))
                );
              }}
            />
          </div>
        );
      }
      default: {
        return (
          <p className="small-text">Something went wrong while rendering this input...</p>
        );
      }
    }
  }

  return (
    <div className="input-container">
      <p className="small-text bold">
        {input.metadata_question} {input.is_required ? "*" : ""}
      </p>
      {input.metadata_description && (
        <p className="small-text question-description">{input.metadata_description}</p>
      )}
      {renderInput()}
    </div>
  );
};
