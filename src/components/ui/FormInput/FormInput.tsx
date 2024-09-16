import { useState } from "react";
import { AddedInputType } from "../../../lib/types";
import "./FormInput.css";

export const FormInput = ({ input }: { input: AddedInputType }) => {
  console.log({input})
  const [value, setValue] = useState(input.properties?.[`default-value`]?.value || "");

  function renderInput() {
    switch (input.input_type_name) {
      case "text": {
        return (
          <input
            type={"Text"}
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            minLength={parseInt(input.properties?.[`min`]?.value || "0")}
            maxLength={parseInt(input.properties?.[`max`]?.value || "0")}
          />
        );
      }
      case "Textarea": {
        return (
          <textarea
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            minLength={parseInt(input.properties?.[`min`]?.value || "0")}
            maxLength={parseInt(input.properties?.[`max`]?.value || "0")}
          />
        );
      }
      case "Number": {
        return (
          <input
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            type="number"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            min={input.properties?.[`min`]?.value}
            max={input.properties?.[`max`]?.value}
            step={input.properties?.[`step`]?.value}
          />
        );
      }
      case "Email": {
        return (
          <input
            type="email"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
          />
        );
      }
      case "URL": {
        return (
          <input
            type="url"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
          />
        );
      }
      case "Telephone": {
        return (
          <input
            type="tel"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
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
          />
        );
      }
      case "Datetime": {
        return (
          <input
            type="datetime"
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            min={input.properties?.[`min`]?.value}
            max={input.properties?.[`max`]?.value}
          />
        );
      }
      case "Color": {
        return (
          <div className="input-wrapper">
            <p>sadf</p>
            <input type="color" defaultValue={input.properties?.[`default-value`]?.value} />
          </div>
        );
      }
      default: {
        return (
          <input
            type={"text"}
            placeholder={input.properties?.[`placeholder`]?.value || "..."}
            defaultValue={input.properties?.[`default-value`]?.value}
            minLength={parseInt(input.properties?.[`min`]?.value || "0")}
            maxLength={parseInt(input.properties?.[`max`]?.value || "0")}
          />
        );
      }
    }
  }

  return (
    <div className="input-container">
      <p className="question">{input.metadata_question}</p>
      {input.metadata_description && (
        <p className="question-description">{input.metadata_description}</p>
      )}
      {renderInput()}
    </div>
  );
};

