import { useContext, useState } from "react";
import { useAddNewInputToDraftForm } from "../../../hooks/useAddNewInputToDraftForm";
import { useAddNewInputToPublishedForm } from "../../../hooks/useAddNewInputToPublishedForm";
import { useInputTypeProperties } from "../../../hooks/useInputTypeProperties";
import { AllFormsType, InputType, InputTypeType } from "../../../lib/types";
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
  form,
  setForm,
  setCurrentView,
  stagedNewInputType,
  setStagedNewInputType,
  isForDraft,
}: {
  form: { form: AllFormsType | null; inputs: InputType[] };
  setForm: React.Dispatch<
    React.SetStateAction<{
      form: AllFormsType | null;
      inputs: InputType[];
    }>
  >;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  stagedNewInputType: InputTypeType | null;
  setStagedNewInputType: React.Dispatch<React.SetStateAction<InputTypeType | null>>;
  isForDraft: boolean;
}) => {
  const { addNewInputToDraftForm } = useAddNewInputToDraftForm();
  const { addNewInputToPublishedForm } = useAddNewInputToPublishedForm();
  const { inputTypeProperties } = useInputTypeProperties();

  const { setError } = useContext(ErrorContext);

  const [stagedInputTitle, setStagedInputTitle] = useState<string>("Untitled Question");
  const [stagedInputDescription, setStagedInputDescription] = useState<string>("");
  const [isRequired, setIsRequired] = useState(false);

  async function handleAddNewInput(): Promise<void> {
    try {
      const properties = inputTypeProperties[stagedNewInputType!.id];

      let data;

      if (isForDraft) {
        data = await addNewInputToDraftForm({
          inputTypeId: stagedNewInputType?.id,
          inputMetadataQuestion: stagedInputTitle,
          inputMetadataDescription: stagedInputDescription,
          properties,
          formId: form.form!.id,
          isRequired,
        });
      } else {
        data = await addNewInputToPublishedForm({
          inputTypeId: stagedNewInputType?.id,
          inputMetadataQuestion: stagedInputTitle,
          inputMetadataDescription: stagedInputDescription,
          properties,
          formId: form.form!.id,
          isRequired,
        });
      }

      setForm({
        ...form,
        inputs: [...form.inputs, data],
      });

      handleInputReset();

      setCurrentView("metadata-inputs");
    } catch (error) {
      console.log("error here");
      handleCatchError(error, setError, null);
    }
  }

  function handleInputReset(): void {
    setStagedInputTitle("Untitled Question");
    setStagedInputDescription("");
    setStagedNewInputType(null);
  }

  if (!form.form) return <p>Form not found</p>;

  if (!stagedNewInputType) return <p>No staged new input type</p>;

  return (
    <div className="staged-input-form">
      <form className="staged-input-form">
        <InputTypeInfo inputType={stagedNewInputType} />

        <FormGroupContainer
          label="Question/Prompt"
          type="input"
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
          type="textarea"
          placeholder="Description"
          inputValue={stagedInputDescription}
          isRequired={false}
          handleChange={(e) => {
            e.preventDefault();
            setStagedInputDescription(e.target.value);
          }}
        />

        <InputPropertiesContainer inputTypeId={stagedNewInputType.id} />

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
  );
};
