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
      
      {/* <AddedInputsList form={form} setForm={setForm} isForDraft={isForDraft}/> */}
    </div>
  );
};
