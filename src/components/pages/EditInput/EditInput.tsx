import { useContext, useState } from "react";
import { useInputForEdit } from "../../../hooks/useInputForEdit";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import FormGroupContainer from "../../ui/FormGroupContainer/FormGroupContainer";
import InputPropertiesContainer from "../../ui/InputPropertiesContainer/InputPropertiesContainer";
import InputTypeInfo from "../../ui/InputTypeInfo/InputTypeInfo";
import SingleSelectToggle from "../../ui/SingleSelectToggle/SingleSelectToggle";
import "./EditInput.css";
import { SaveIcon } from "../../ui/icons/SaveIcon";

const EditInput = () => {
  const {
    inputType,
    initialInput,
    updatedInput,
    setUpdatedInput,
    loading: inputLoading,
  } = useInputForEdit();
  const { setError } = useContext(ErrorContext);
  const [isRequired, setIsRequired] = useState(initialInput?.is_required || false);

  if (inputLoading) return <p>Input loading...</p>;

  if (!initialInput || !updatedInput) return <p>No input found</p>;

  const saveDisabled =
    initialInput.metadata_question === updatedInput.metadata_question &&
    initialInput.metadata_description === updatedInput.metadata_description;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/form/edit-input`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          input: updatedInput,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("There was an error updating this input");
      }

      const data = await response.json();

      console.log(data);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  return (
    <main className="edit-input">
      <div className="row">
        <InputTypeInfo inputType={inputType} />
        <div className="container">
          <div className="heading">
            <h3>Edit Input</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <FormGroupContainer
              label="Prompt / Question"
              description=""
              placeholder="Prompt / Question"
              inputValue={updatedInput.metadata_question}
              handleChange={(e) =>
                setUpdatedInput({
                  ...updatedInput,
                  metadata_question: e.target.value,
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
              inputValue={updatedInput.metadata_description}
              handleChange={(e) =>
                setUpdatedInput({
                  ...updatedInput,
                  metadata_description: e.target.value,
                })
              }
              isRequired={true}
              disabled={false}
              type="Paragraph"
            />

            {inputType && <InputPropertiesContainer inputTypeId={inputType.id} />}

            <SingleSelectToggle
              label="Required?"
              options={[
                { label: "Yes", value: true, checkedCondition: isRequired },
                { label: "No", value: false, checkedCondition: !isRequired },
              ]}
              onChange={(value) => setIsRequired(value as boolean)}
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
      </div>
    </main>
  );
};
export default EditInput;
