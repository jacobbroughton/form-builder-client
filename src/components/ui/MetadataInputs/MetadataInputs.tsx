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
import { DeleteModal } from "../DeleteModal/DeleteModal";
import FormGroupContainer from "../FormGroupContainer/FormGroupContainer";
import AddedInputsList from "../AddedInputsList/AddedInputsList";

export const MetadataInputs = ({
  form,
  setForm,
}: {
  form: AllFormsType | null;
  setForm: React.Dispatch<React.SetStateAction<AllFormsType | null>>;
}) => {
  if (!form) return <p>No form found</p>;

  return (
    <div className="metadata-inputs">
      <form className="title-and-description" onSubmit={(e) => e.preventDefault()}>
        <FormGroupContainer
          label="Form name"
          placeholder="Title"
          type="Short Answer"
          inputValue={form.title}
          disabled={false}
          isRequired={true}
          handleChange={(e) => {
            e.preventDefault();
            setForm({
              ...form,
              title: e.target.value,
            });
          }}
        />

        <FormGroupContainer
          label="Description"
          placeholder="Description"
          type="Paragraph"
          inputValue={form.description || ""}
          disabled={false}
          isRequired={false}
          handleChange={(e) => {
            e.preventDefault();
            setForm({
              ...form!,
              description: e.target.value,
            });
          }}
        />
      </form>
      {/* {form.inputs.length === 0 ? (
        <NoPromptsMessage
          formId={form.id}
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
      )} */}
      {/* <AddedInputsList form={form} setForm={setForm} isForDraft={isForDraft}/> */}
    </div>
  );
};
