import { useContext, useState } from "react";
import { InputType, AllFormsType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { PlusIcon } from "../icons/PlusIcon";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import { InputPopupMenu } from "../InputPopupMenu/InputPopupMenu";
import "./MetadataInputs.css";
import { useChangeInputEnabledStatus } from "../../../hooks/useChangeInputEnabledStatus";
import { NoPromptsMessage } from "../NoPromptsMessage/NoPromptsMessage";
import { useDeleteInput } from "../../../hooks/useDeleteInput";
import  {DeleteModal} from "../DeleteModal/DeleteModal";
import FormGroupContainer from "../FormGroupContainer/FormGroupContainer";

export const MetadataInputs = ({
  form,
  setForm,
  setCurrentView,
  isForDraft,
}: {
  form: {
    form: AllFormsType | null;
    inputs: InputType[];
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      form: AllFormsType | null;
      inputs: InputType[];
    }>
  >;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  isForDraft: boolean;
}) => {
  const { changeInputEnabledStatus } = useChangeInputEnabledStatus();
  const { deleteInput } = useDeleteInput();
  const [idForInputPopup, setIdForInputPopup] = useState<string | null>(null);
  const [inputPopupToggled, setInputPopupToggled] = useState(false);
  const [inputStagedForDelete, setInputStagedForDelete] = useState<InputType | null>(
    null
  );
  const [deleteModalToggled, setDeleteModalToggled] = useState(false);

  const { setError } = useContext(ErrorContext);

  async function handleChangeDraftInputEnabledStatus(
    clickedInput: InputType
  ): Promise<void> {
    try {
      const newActiveStatus = clickedInput.is_active ? false : true;

      await changeInputEnabledStatus(
        {
          inputId: clickedInput.id,
        },
        {
          newActiveStatus,
          isDraft: isForDraft ? true : false,
        }
      );

      setForm({
        ...form,
        inputs: form.inputs.map((input) => ({
          ...input,
          ...(input.id === clickedInput.id && { is_active: newActiveStatus }),
        })),
      });
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handleInputDelete(clickedInput: InputType | null): Promise<void> {
    try {
      if (!clickedInput) throw new Error("No input was found for deletion");

      await deleteInput({ inputId: clickedInput.id });

      setForm({
        ...form,
        inputs: form.inputs.filter((input) => input.id !== clickedInput.id),
      });
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  if (!form.form) return <p>No form found</p>;

  return (
    <div className="metadata-inputs">
      <form className="title-and-description" onSubmit={(e) => e.preventDefault()}>
        <FormGroupContainer
          label="Form name"
          placeholder="Title"
          type="Short Answer"
          inputValue={form.form.title}
          isRequired={true}
          handleChange={(e) => {
            e.preventDefault();
            setForm({
              ...form,
              form: {
                ...form.form!,
                title: e.target.value,
              },
            });
          }}
        />

        <FormGroupContainer
          label="Description"
          placeholder="Description"
          type="Paragraph"
          inputValue={form.form.description || ""}
          isRequired={false}
          handleChange={(e) => {
            e.preventDefault();
            setForm({
              ...form,
              form: {
                ...form.form!,
                description: e.target.value,
              },
            });
          }}
        />
      </form>
      {form.inputs.length === 0 ? (
        <NoPromptsMessage
          formId={form.form.id}
          isDraft={isForDraft}
          handleClick={() => setCurrentView("input-types-selector")}
        />
      ) : (
        <div className="added-inputs">
          {form.inputs.map((input) => (
            <div
              className={`added-input ${input.is_active ? "" : "deleted"}`}
              key={input.id}
            >
              <p className="name">{input.metadata_question}</p>
              <div className="tags">
                <p>{input.input_type_name || "Unnamed"}</p>
                {input.num_custom_properties > 0 && (
                  <p>
                    {input.num_custom_properties} custom propert
                    {input.num_custom_properties > 1 ? "ies" : "y"}
                  </p>
                )}
                {input.is_required && <p>Required</p>}
              </div>
              <button
                className="popup-menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdForInputPopup(input.id);
                  setInputPopupToggled(
                    idForInputPopup == input.id ? !inputPopupToggled : true
                  );
                }}
              >
                <ThreeDotsIcon />
              </button>
              {idForInputPopup == input.id && inputPopupToggled ? (
                <InputPopupMenu
                  input={input}
                  setIdForInputPopup={setIdForInputPopup}
                  setInputPopupToggled={setInputPopupToggled}
                  handleChangeDraftInputEnabledStatus={() =>
                    handleChangeDraftInputEnabledStatus(input)
                  }
                  handleDeleteClick={(e) => {
                    e.stopPropagation();
                    setInputStagedForDelete(input);
                    setDeleteModalToggled(true);
                  }}
                  handleEditClick={(e) => {
                    e.stopPropagation();
                    setCurrentView("staged-input-form");
                    console.log(input);
                  }}
                />
              ) : (
                false
              )}
            </div>
          ))}
          <button
            className="add-new-input"
            type="button"
            onClick={() => setCurrentView("input-types-selector")}
          >
            <p className="small-text bold">Add a new input</p>
            <div className="icon-container">
              <PlusIcon />
            </div>
          </button>
        </div>
      )}
      {deleteModalToggled && (
        <DeleteModal
          label="Delete input?"
          setDeleteModalShowing={setDeleteModalToggled}
          handleDeleteClick={() => handleInputDelete(inputStagedForDelete)}
        />
      )}
    </div>
  );
};
