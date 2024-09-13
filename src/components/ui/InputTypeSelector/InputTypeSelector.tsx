import { useEffect, useState } from "react";
import XIcon from "../icons/XIcon";
import { InputTypeType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";

const InputTypeSelector = ({ setCurrentView, setStagedNewInputType }) => {
  const [inputTypes, setInputTypes] = useState<InputTypeType[]>([]);

  async function getInputTypes(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3001/form/item-types");

      if (!response.ok) throw new Error("An error occured while fetching form types");

      const data = await response.json();

      setInputTypes(data);
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    getInputTypes();
  }, []);

  return (
    <>
      <div className="navigation-buttons">
        <button
          className="navigation-button cancel"
          type="button"
          onClick={() => setCurrentView("metadata-inputs")}
        >
          <XIcon /> Cancel
        </button>
      </div>
      <div className="input-types-selector">
        {inputTypes.map((inputType) => (
          <>
            <button
              type="button"
              onClick={() => {
                setStagedNewInputType(inputType);
                setCurrentView("staged-item-form");
              }}
            >
              <p className="name">{inputType.name}</p>
              <p className="description">{inputType.description}</p>
            </button>
          </>
        ))}
      </div>
    </>
  );
};
export default InputTypeSelector;
