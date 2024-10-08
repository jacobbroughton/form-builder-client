import { useInputForEdit } from "../../../hooks/useInputForEdit";
import "./EditInput.css";
const EditInput = () => {
  const {
    initialInput,
    updatedInput,
    setUpdatedInput,
    loading: inputLoading,
  } = useInputForEdit();

  if (inputLoading) return <p>Input loading...</p>;

  if (!initialInput || !updatedInput) return <p>No input found</p>;

  const saveDisabled =
    initialInput.metadata_question === updatedInput.metadata_question &&
    initialInput.metadata_description === updatedInput.metadata_description;

  return (
    <main className="edit-input">
      <div className="container">
        <h1>Edit Input</h1>
        <input
          value={updatedInput.metadata_question}
          onChange={(e) =>
            setUpdatedInput({
              ...updatedInput,
              metadata_question: e.target.value,
            })
          }
        />
        <input
          value={updatedInput.metadata_description}
          onChange={(e) =>
            setUpdatedInput({
              ...updatedInput,
              metadata_description: e.target.value,
            })
          }
        />
        <button disabled={saveDisabled}>Save</button>
      </div>
    </main>
  );
};
export default EditInput;
