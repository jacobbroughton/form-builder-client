import { InputType, InputTypeWithProperties } from "../../../lib/types";
import "./FormInput.css";

export const FormInput = ({
  readOnly,
  input,
  inputs,
  setInputs,
}: {
  readOnly: boolean;
  input: InputTypeWithProperties;
  inputs: InputTypeWithProperties[];
  setInputs: React.Dispatch<React.SetStateAction<InputType[]>>;
}) => {
  function renderInput() {
    switch (input.input_type_name) {
      case "Short Answer": {
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
      case "Paragraph": {
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
      // case "Number": {
      //   return (
      //     <input
      //       disabled={readOnly}
      //       type="number"
      //       placeholder={input.properties?.[`placeholder`]?.value || "..."}
      //       defaultValue={input.properties?.[`default-value`]?.value}
      //       min={input.properties?.[`min`]?.value}
      //       max={input.properties?.[`max`]?.value}
      //       step={input.properties?.[`step`]?.value || '1'}
      //       value={input.value}
      //       onChange={(e) => {
      //         console.log(e.target.value)
      //         setInputs(
      //           inputs.map((localInput) => ({
      //             ...localInput,
      //             ...(localInput.id === input.id && {
      //               value: e.target.value,
      //             }),
      //           }))
      //         );
      //       }}
      //     />
      //   );
      // }
      // case "Email": {
      //   return (
      //     <input
      //       disabled={readOnly}
      //       type="email"
      //       placeholder={input.properties?.[`placeholder`]?.value || "..."}
      //       defaultValue={input.properties?.[`default-value`]?.value}
      //       value={input.value}
      //       onChange={(e) => {
      //         setInputs(
      //           inputs.map((localInput) => ({
      //             ...localInput,
      //             ...(localInput.id === input.id && {
      //               value: e.target.value,
      //             }),
      //           }))
      //         );
      //       }}
      //     />
      //   );
      // }
      // case "URL": {
      //   return (
      //     <input
      //       disabled={readOnly}
      //       type="url"
      //       placeholder={input.properties?.[`placeholder`]?.value || "..."}
      //       defaultValue={input.properties?.[`default-value`]?.value}
      //       value={input.value}
      //       onChange={(e) => {
      //         setInputs(
      //           inputs.map((localInput) => ({
      //             ...localInput,
      //             ...(localInput.id === input.id && {
      //               value: e.target.value,
      //             }),
      //           }))
      //         );
      //       }}
      //     />
      //   );
      // }
      // case "Telephone": {
      //   return (
      //     <input
      //       disabled={readOnly}
      //       pattern="^(\+?1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$"
      //       type="tel"
      //       placeholder={input.properties?.[`placeholder`]?.value || "..."}
      //       defaultValue={input.properties?.[`default-value`]?.value}
      //       value={input.value}
      //       onChange={(e) => {
      //         if (!/^(\+?1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/.test(e.target.value)) alert("Nope")
      //         setInputs(
      //           inputs.map((localInput) => ({
      //             ...localInput,
      //             ...(localInput.id === input.id && {
      //               value: e.target.value,
      //             }),
      //           }))
      //         );
      //       }}
      //     />
      //   );
      // }
      case "Date": {
        return (
          <input
            disabled={readOnly}
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
            disabled={readOnly}
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
          <div className={`input-wrapper color ${readOnly ? "disabled" : ""}`}>
            <input
              disabled={readOnly}
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
            <p>{input.value}</p>
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
    <div className="form-input">
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
