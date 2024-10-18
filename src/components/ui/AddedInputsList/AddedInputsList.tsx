import { useContext, useState } from "react";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { PlusIcon } from "../icons/PlusIcon";
import { useChangeInputEnabledStatus } from "../../../hooks/useChangeInputEnabledStatus";
import { useDeleteInput } from "../../../hooks/useDeleteInput";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { InputType } from "../../../lib/types";
import { NoPromptsMessage } from "../NoPromptsMessage/NoPromptsMessage";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import { InputPopupMenu } from "../InputPopupMenu/InputPopupMenu";
import { DeleteModal } from "../DeleteModal/DeleteModal";
import { CurrentViewContext } from "../../../providers/CurrentViewProvider";
import "./AddedInputsList.css";

export function AddedInputsList({
  inputs,
  setInputs,
  isForDraft,
}: {
  inputs: InputType[];
  setInputs: React.Dispatch<React.SetStateAction<InputType[]>>;
  isForDraft: boolean;
}) {
  const { changeInputEnabledStatus } = useChangeInputEnabledStatus();
  const { deleteInput } = useDeleteInput();
  const { setError } = useContext(ErrorContext);
  const { setCurrentView } = useContext(CurrentViewContext);

  const [idForInputPopup, setIdForInputPopup] = useState<string | null>(null);
  const [inputPopupToggled, setInputPopupToggled] = useState(false);
  const [inputStagedForDelete, setInputStagedForDelete] = useState<InputType | null>(
    null
  );
  const [deleteModalToggled, setDeleteModalToggled] = useState(false);

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

      setInputs(
        inputs.map((input) => ({
          ...input,
          ...(input.id === clickedInput.id && { is_active: newActiveStatus }),
        }))
      );
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handleInputDelete(clickedInput: InputType | null): Promise<void> {
    try {
      if (!clickedInput) throw new Error("No input was found for deletion");

      await deleteInput({ inputId: clickedInput.id });

      setInputs(inputs.filter((input) => input.id !== clickedInput.id));
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  return (
    <>
      {inputs.length === 0 ? (
        <NoPromptsMessage
          isDraft={isForDraft}
          handleClick={() => setCurrentView("input-types-selector")}
        />
      ) : (
        <div className="added-inputs">
          {inputs.map((input) => (
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
                {input.num_multiple_choice_options > 0 && (
                  <p>
                    {input.num_multiple_choice_options} option
                    {input.num_multiple_choice_options > 1 ? "s" : ""}
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
                  isForDraft={isForDraft}
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
    </>
  );
}
