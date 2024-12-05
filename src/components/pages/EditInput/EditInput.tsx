import { useContext, useState } from "react";
import { useInputForEdit } from "../../../hooks/useInputForEdit";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { FormGroupContainer } from "../../ui/FormGroupContainer/FormGroupContainer";
import { InputPropertiesContainer } from "../../ui/InputPropertiesContainer/InputPropertiesContainer";
import { InputTypeInfo } from "../../ui/InputTypeInfo/InputTypeInfo";
import { SingleSelectToggle } from "../../ui/SingleSelectToggle/SingleSelectToggle";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { useInputTypeProperties } from "../../../hooks/useInputTypeProperties";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import { ActionLinkWithIcon } from "../../ui/ActionLinkWithIcon/ActionLinkWithIcon";
import "./EditInput.css";
import { LinearScaleForAdmin } from "../../ui/LinearScaleForAdmin/LinearScaleForAdmin";
import { MultipleChoiceForAdmin } from "../../ui/MultipleChoiceForAdmin/MultipleChoiceForAdmin";

export function EditInput() {
  const {
    inputType,
    initialInput,
    updatedInput,
    setUpdatedInput,
    loading: inputLoading,
    editInput,
  } = useInputForEdit();
  const { setError } = useContext(ErrorContext);

  console.log({ initialInput, updatedInput });

  const { inputTypeProperties, setInputTypeProperties } = useInputTypeProperties();

  if (inputLoading) return <p>Input loading...</p>;

  if (!initialInput || !updatedInput) return <p>No input found</p>;

  const saveDisabled =
    initialInput.info.metadata_question === updatedInput.info.metadata_question &&
    initialInput.info.metadata_description === updatedInput.info.metadata_description &&
    initialInput.info.is_required === updatedInput.info.is_required;

  return (
    <main className="edit-input">
      <div className="row">
        <div className="container">
          <ActionLinkWithIcon
            icon={<ArrowLeftIcon />}
            iconPlacement="before"
            label="Back"
            url={`/edit-published-form/${updatedInput.info.form_id}`}
            color="none"
          />
          <form onSubmit={editInput}>
            <FormGroupContainer
              label="Prompt / Question"
              description=""
              placeholder="Prompt / Question"
              inputValue={updatedInput.info.metadata_question}
              handleChange={(e) =>
                setUpdatedInput({
                  ...updatedInput,
                  info: {
                    ...updatedInput.info,
                    metadata_question: e.target.value,
                  },
                })
              }
              isRequired={true}
              disabled={false}
              type="Short Answer"
              canHide={false}
            />

            <FormGroupContainer
              label="Description"
              description=""
              placeholder="Description"
              inputValue={updatedInput.info.metadata_description}
              handleChange={(e) =>
                setUpdatedInput({
                  ...updatedInput,
                  info: {
                    ...updatedInput.info,
                    metadata_description: e.target.value,
                  },
                })
              }
              isRequired={true}
              disabled={false}
              type="Paragraph"
              canHide={false}
            />
            {initialInput.info.input_type_name === "Linear Scale" ? (
              <LinearScaleForAdmin
                minLinearScale={updatedInput.linearScale.min}
                setMinLinearScale={setMinLinearScale}
                maxLinearScale={updatedInput.linearScale.max}
                setMaxLinearScale={setMaxLinearScale}
              />
            ) : initialInput.info.input_type_name === "Multiple Choice" ? (
              <MultipleChoiceForAdmin
                options={updatedInput.options}
                setOptions={(option) => null}
              />
            ) : (
              false
            )}

            {inputType &&
              !["Linear Scale", "Multiple Choice"].includes(inputType.name) && (
                <InputPropertiesContainer
                  inputTypeId={inputType.id}
                  inputTypeProperties={inputTypeProperties}
                  setInputTypeProperties={setInputTypeProperties}
                />
              )}

            <SingleSelectToggle
              label="Required?"
              options={[
                {
                  label: "Yes",
                  value: true,
                  checkedCondition: updatedInput.info.is_required,
                },
                {
                  label: "No",
                  value: false,
                  checkedCondition: !updatedInput.info.is_required,
                },
              ]}
              onChange={(value) => {
                setUpdatedInput({
                  ...updatedInput,
                  info: {
                    ...updatedInput.info,
                    is_required: value,
                  },
                });
              }}
            />
            <button
              className="action-button-with-icon"
              disabled={saveDisabled}
              type="submit"
            >
              <SaveIcon />
              Save
            </button>
          </form>
        </div>
        <InputTypeInfo inputType={inputType} />
      </div>
    </main>
  );
}
