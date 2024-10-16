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

export function EditInput() {
  const {
    inputType,
    initialInput,
    updatedInput,
    setInitialInput,
    setUpdatedInput,
    loading: inputLoading,
  } = useInputForEdit();
  const { setError } = useContext(ErrorContext);
  const [isRequired, setIsRequired] = useState(initialInput?.is_required || false);

  const { inputTypeProperties, setInputTypeProperties } = useInputTypeProperties();

  if (inputLoading) return <p>Input loading...</p>;

  if (!initialInput || !updatedInput) return <p>No input found</p>;

  console.log({ initialInput, updatedInput });

  const saveDisabled =
    initialInput.info.metadata_question === updatedInput.info.metadata_question &&
    initialInput.info.metadata_description === updatedInput.info.metadata_description &&
    initialInput.info.is_required === updatedInput.info.is_required;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/form/edit-input`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updatedInput),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("There was an error updating this input");
      }

      const data = await response.json();

      setInitialInput(updatedInput);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  return (
    <main className="edit-input">
      <div className="row">
        <div className="container">
          {/* <div className="heading">
            <h1>Edit Input</h1>
          </div> */}
          <ActionLinkWithIcon
            icon={<ArrowLeftIcon />}
            iconPlacement="before"
            // label="Back"
            label={updatedInput.info.form_id}
            url={`/edit-published-form/${updatedInput.info.form_id}`}
            color="none"
          />
          <form onSubmit={handleSubmit}>
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
            />

            {inputType && (
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
;
