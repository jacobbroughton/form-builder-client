import { useEffect, useState } from "react";
import { InputTypeType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { XIcon } from "../icons/XIcon";
import "./InputTypeSelector.css";

export const InputTypeSelector = ({
  setCurrentView,
  setStagedNewInputType,
}: {
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  setStagedNewInputType: React.Dispatch<React.SetStateAction<InputTypeType | null>>;
}) => {
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
    <div className='input-type-selector'>
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
    </div>
  );
};

