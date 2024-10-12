import { useCallback, useContext, useState } from "react";
import { useAddNewInputToDraftForm } from "../../../hooks/useAddNewInputToDraftForm";
import { useAddNewInputToPublishedForm } from "../../../hooks/useAddNewInputToPublishedForm";
import { useInputTypeProperties } from "../../../hooks/useInputTypeProperties";
import { InputType, InputTypeType } from "../../../lib/types";
import { CurrentViewContext } from "../../../providers/CurrentViewProvider";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import FormGroupContainer from "../FormGroupContainer/FormGroupContainer";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";
import { CheckIcon } from "../icons/CheckIcon";
import InputPropertiesContainer from "../InputPropertiesContainer/InputPropertiesContainer";
import InputTypeInfo from "../InputTypeInfo/InputTypeInfo";
import SingleSelectToggle from "../SingleSelectToggle/SingleSelectToggle";
import "./StagedInputForm.css";

export const StagedInputForm = ({
  formId,
  inputs,
  setInputs,
  stagedNewInputType,
  setStagedNewInputType,
  isForDraft,
}: {
  formId: string;
  inputs: InputType[];
  setInputs: React.Dispatch<React.SetStateAction<InputType[]>>;
  stagedNewInputType: InputTypeType | null;
  setStagedNewInputType: React.Dispatch<React.SetStateAction<InputTypeType | null>>;
  isForDraft: boolean;
}) => {
  const { addNewInputToDraftForm } = useAddNewInputToDraftForm();
  const { addNewInputToPublishedForm } = useAddNewInputToPublishedForm();
  const { inputTypeProperties, setInputTypeProperties } = useInputTypeProperties();

  const { setError } = useContext(ErrorContext);
  const { setCurrentView } = useContext(CurrentViewContext);

  const [stagedInputTitle, setStagedInputTitle] = useState<string>("Untitled Question");
  const [stagedInputDescription, setStagedInputDescription] = useState<string>("");
  const [isRequired, setIsRequired] = useState(false);

  const handleAddNewInput = useCallback(async (): Promise<void> => {
    try {
      const properties = inputTypeProperties[stagedNewInputType!.id];

      console.log({ inputTypeProperties, properties });

      let data;

      if (isForDraft) {
        data = await addNewInputToDraftForm({
          inputTypeId: stagedNewInputType?.id,
          inputMetadataQuestion: stagedInputTitle,
          inputMetadataDescription: stagedInputDescription,
          properties,
          formId: formId,
          isRequired,
        });
      } else {
        data = await addNewInputToPublishedForm({
          inputTypeId: stagedNewInputType?.id,
          inputMetadataQuestion: stagedInputTitle,
          inputMetadataDescription: stagedInputDescription,
          properties,
          formId: formId,
          isRequired,
        });
      }

      setInputs([...inputs, data]);

      handleInputReset();

      setCurrentView("metadata-inputs");
    } catch (error) {
      console.log("error here");
      handleCatchError(error, setError, null);
    }
  }, [inputTypeProperties]);

  function handleInputReset(): void {
    setStagedInputTitle("Untitled Question");
    setStagedInputDescription("");
    setStagedNewInputType(null);
  }

  if (!formId) return <p>Form id not provided</p>;

  if (!stagedNewInputType) return <p>No staged new input type</p>;

  return (
    <div className="staged-input-form">
      <div className="row">
        <InputTypeInfo inputType={stagedNewInputType} />
        <div className="staged-input-form-container">
          <form className="staged-input-form">
            <FormGroupContainer
              label="Question/Prompt"
              description=""
              disabled={false}
              type="Short Answer"
              placeholder="Question"
              inputValue={stagedInputTitle}
              isRequired={true}
              handleChange={(e) => {
                e.preventDefault();
                setStagedInputTitle(e.target.value);
              }}
            />
            <FormGroupContainer
              label="Description"
              description=""
              disabled={false}
              type="Paragraph"
              placeholder="Description"
              inputValue={stagedInputDescription}
              isRequired={false}
              handleChange={(e) => {
                e.preventDefault();
                setStagedInputDescription(e.target.value);
              }}
            />

            <InputPropertiesContainer
              inputTypeId={stagedNewInputType.id}
              inputTypeProperties={inputTypeProperties}
              setInputTypeProperties={setInputTypeProperties}
            />

            <SingleSelectToggle
              label="Required?"
              options={[
                { label: "Yes", value: true, checkedCondition: isRequired },
                { label: "No", value: false, checkedCondition: !isRequired },
              ]}
              onChange={(value) => setIsRequired(value as boolean)}
            />
          </form>

          <div className="navigation-buttons">
            <button
              className="navigation-button back"
              type="button"
              onClick={() => setCurrentView("input-types-selector")}
            >
              <ArrowLeftIcon /> Back
            </button>
            <button
              className="navigation-button done"
              type="button"
              onClick={handleAddNewInput}
            >
              <CheckIcon /> Done, add to form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
