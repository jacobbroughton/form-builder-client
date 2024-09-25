import { useContext, useEffect, useState } from "react";
import { InputTypeType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { XIcon } from "../icons/XIcon";
import "./InputTypeSelector.css";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { useGetInputTypes } from "../../../hooks/useGetInputTypes";

export const InputTypeSelector = ({
  setCurrentView,
  setStagedNewInputType,
}: {
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  setStagedNewInputType: React.Dispatch<React.SetStateAction<InputTypeType | null>>;
}) => {
  const { getInputTypes } = useGetInputTypes();
  const [inputTypes, setInputTypes] = useState<InputTypeType[]>([]);

  const { setError } = useContext(ErrorContext);

  async function getInputTypesLocal(): Promise<void> {
    try {
      const data = await getInputTypes();

      setInputTypes(data);
    } catch (error) {
      handleCatchError(error, setError);
    }
  }

  useEffect(() => {
    getInputTypesLocal();
  }, []);

  return (
    <div className="input-type-selector">
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
        {inputTypes.length === 0 ? (
          <p>No input types</p>
        ) : (
          inputTypes.map((inputType) => (
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
          ))
        )}
      </div>
    </div>
  );
};
