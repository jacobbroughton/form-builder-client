import { useCallback, useContext, useState } from "react";
import { useAddNewInputToDraftForm } from "../../../hooks/useAddNewInputToDraftForm";
import { useAddNewInputToPublishedForm } from "../../../hooks/useAddNewInputToPublishedForm";
import { useInputTypeProperties } from "../../../hooks/useInputTypeProperties";
import { InputType, InputTypeType, MultipleChoiceOptionType } from "../../../lib/types";
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
import { LinearScaleForAdmin } from "../LinearScaleForAdmin/LinearScaleForAdmin";
import { MultipleChoiceForAdmin } from "../MultipleChoiceForAdmin/MultipleChoiceForAdmin";
import ActionButtonWithIcon from "../ActionButtonWithIcon/ActionButtonWithIcon";

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
  const [descriptionToggled, setDescriptionToggled] = useState(false);

  const [options, setOptions] = useState<MultipleChoiceOptionType[]>([
    {
      id: 1,
      label: "",
    },
    {
      id: 2,
      label: "",
    },
    {
      id: 3,
      label: "",
    },
  ]);

  const [minLinearScale, setMinLinearScale] = useState(1);
  const [maxLinearScale, setMaxLinearScale] = useState(10);

  const handleAddNewInput = useCallback(async (): Promise<void> => {
    try {
      const properties = inputTypeProperties[stagedNewInputType!.id];

      let data;

      if (isForDraft) {
        data = await addNewInputToDraftForm({
          inputTypeId: stagedNewInputType?.id,
          inputMetadataQuestion: stagedInputTitle,
          inputMetadataDescription: descriptionToggled ? stagedInputDescription : "",
          properties,
          options,
          linearScale: { min: minLinearScale, max: maxLinearScale },
          formId: formId,
          isRequired,
        });
      } else {
        data = await addNewInputToPublishedForm({
          inputTypeId: stagedNewInputType?.id,
          inputMetadataQuestion: stagedInputTitle,
          inputMetadataDescription: descriptionToggled ? stagedInputDescription : "",
          properties,
          options,
          linearScale: { min: minLinearScale, max: maxLinearScale },
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
  }, [
    inputTypeProperties,
    stagedInputTitle,
    stagedInputDescription,
    isRequired,
    descriptionToggled,
    options,
    isRequired,
    minLinearScale,
    maxLinearScale,
  ]);

  function handleInputReset(): void {
    setStagedInputTitle("Untitled Question");
    setStagedInputDescription("");
    setStagedNewInputType(null);
  }

  const noMultipleChoiceOptionsEmpty =
    options.filter((option) => option.label === "").length === 0;

  if (!formId) return <p>Form id not provided</p>;

  if (!stagedNewInputType) return <p>No staged new input type</p>;

  return (
    <div className="staged-input-form">
      <div className="row">
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
            {descriptionToggled && (
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
            )}
            <button
              className="description-toggle"
              type="button"
              onClick={() => setDescriptionToggled(!descriptionToggled)}
            >
              {descriptionToggled ? "Remove" : "Add"} Description{" "}
              {descriptionToggled ? "-" : "+"}
            </button>

            {stagedNewInputType.name === "Linear Scale" && (
              <LinearScaleForAdmin
                minLinearScale={minLinearScale}
                setMinLinearScale={setMinLinearScale}
                maxLinearScale={maxLinearScale}
                setMaxLinearScale={setMaxLinearScale}
              />
            )}

            {stagedNewInputType.name === "Multiple Choice" && (
              <MultipleChoiceForAdmin options={options} setOptions={setOptions} />
            )}

            {inputTypeProperties[stagedNewInputType.id] && (
              <InputPropertiesContainer
                inputTypeId={stagedNewInputType.id}
                inputTypeProperties={inputTypeProperties}
                setInputTypeProperties={setInputTypeProperties}
              />
            )}

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
            <ActionButtonWithIcon
              label="Back"
              icon={<ArrowLeftIcon />}
              iconPlacement="before"
              handleClick={() => setCurrentView("input-types-selector")}
              color="none"
              disabled={false}
            />

            <ActionButtonWithIcon
              label="Done, add to form"
              disabled={
                !stagedInputTitle ||
                (stagedNewInputType.name === "Multiple Choice"
                  ? !noMultipleChoiceOptionsEmpty
                  : false)
              }
              icon={<CheckIcon />}
              iconPlacement="before"
              color="green-icon"
              handleClick={handleAddNewInput}
            />
          </div>
        </div>
        <InputTypeInfo inputType={stagedNewInputType} />
      </div>
    </div>
  );
};
