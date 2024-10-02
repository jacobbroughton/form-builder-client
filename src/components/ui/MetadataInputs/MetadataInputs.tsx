import { useContext, useState } from "react";
import { AddedInputType, AllFormsType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { PlusIcon } from "../icons/PlusIcon";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import { InputPopupMenu } from "../InputPopupMenu/InputPopupMenu";
import "./MetadataInputs.css";
import { useChangeInputEnabledStatus } from "../../../hooks/useChangeInputEnabledStatus";
import { NoPromptsMessage } from "../NoPromptsMessage/NoPromptsMessage";

export const MetadataInputs = ({
  form,
  setForm,
  setCurrentView,
  isForDraft,
}: {
  form: {
    form: AllFormsType | null;
    inputs: AddedInputType[];
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      form: AllFormsType | null;
      inputs: AddedInputType[];
    }>
  >;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  isForDraft: boolean;
}) => {
  const { changeInputEnabledStatus } = useChangeInputEnabledStatus();
  const [idForInputPopup, setIdForInputPopup] = useState<string | null>(null);
  const [inputPopupToggled, setInputPopupToggled] = useState(false);

  const { setError } = useContext(ErrorContext);

  async function handleChangeDraftInputEnabledStatus(
    clickedInput: AddedInputType
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

  if (!form.form) return <p>No form found</p>;

  return (
    <div className="metadata-inputs">
      <form className="title-and-description">
        <div className="form-group-container">
          <p className="small-text bold">Form name *</p>
          <input
            value={form.form.title}
            onChange={(e) =>
              setForm({
                ...form,
                form: {
                  ...form.form!,
                  title: e.target.value,
                },
              })
            }
            placeholder="Title"
          />
        </div>
        <div className="form-group-container">
          <p className="small-text bold">
            Description <span className="optional">(optional)</span>
          </p>
          <textarea
            value={form.form.description || ""}
            onChange={(e) => {
              setForm({
                ...form,
                form: {
                  ...form.form!,
                  description: e.target.value,
                },
              });
            }}
            placeholder="Description"
          />
        </div>
      </form>
      {form.inputs.length === 0 ? (
        <NoPromptsMessage
          formId={form.form.id}
          isDraft={isForDraft}
          handleClick={() => setCurrentView("input-types-selector")}
          isFormAdmin={true}
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
                {input.num_custom_properties ? (
                  <p>{input.num_custom_properties} custom properties</p>
                ) : (
                  false
                )}
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
    </div>
  );
};
