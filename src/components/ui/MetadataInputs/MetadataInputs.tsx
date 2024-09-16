import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddedInputType, DraftFormType, PublishedFormType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import { InputPopupMenu } from "../InputPopupMenu/InputPopupMenu";
import "./MetadataInputs.css";
import { SaveIcon } from "../icons/SaveIcon";

export const MetadataInputs = ({
  form,
  setForm,
  setCurrentView,
  setPrevSavedForm,
  isForDraft,
  draftIdToFetch,
  saveForm,
}: {
  form: {
    form: DraftFormType | PublishedFormType | null;
    inputs: AddedInputType[];
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      form: DraftFormType | PublishedFormType | null;
      inputs: AddedInputType[];
    }>
  >;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  setPrevSavedForm: React.Dispatch<
    React.SetStateAction<{
      form: DraftFormType | null;
      inputs: AddedInputType[];
    }>
  > | null;
  isForDraft: boolean;
  draftIdToFetch: string | null;
  saveForm: () => void | null;
}) => {
  const [idForInputPopup, setIdForInputPopup] = useState<string | null>(null);
  const [inputPopupToggled, setInputPopupToggled] = useState(false);
  const navigate = useNavigate();

  async function handleChangeDraftInputEnabledStatus(
    clickedInput: AddedInputType
  ): Promise<void> {
    try {
      const newActiveStatus = clickedInput.is_active ? false : true;

      const response = await fetch(
        `http://localhost:3001/form/change-input-enabled-status/${clickedInput.id}`,
        {
          method: "put",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            newActiveStatus,
            isDraft: isForDraft ? true : false,
          }),
        }
      );

      if (!response.ok)
        throw new Error("There was an error deleting this input from the draft form");

      await response.json();

      setForm({
        ...form,
        inputs: form.inputs.map((input) => ({
          ...input,
          ...(input.id === clickedInput.id && { is_active: newActiveStatus }),
        })),
      });
    } catch (error) {
      handleCatchError(error);
    }
  }

  async function handlePublishForm() {
    try {
      if (!isForDraft) return;

      const response = await fetch("http://localhost:3001/form/publish", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          draftFormId: form.form!.id,
          userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
        }),
      });

      if (!response.ok) throw new Error("Something went wrong when publishing this form");

      const data = await response.json();

      console.log(data);

      navigate(`/form/${data[0].id}`);
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    if (draftIdToFetch) {
      async function fetchFormToModify() {
        const response = await fetch(
          `http://localhost:3001/form/get-draft-form/${draftIdToFetch}`
        );

        if (!response.ok) throw new Error("There was a problem fetching the form");

        const data = await response.json();

        if (setPrevSavedForm) {
          setPrevSavedForm({
            form: data.form,
            inputs: data.inputs,
          });
        }

        setForm({
          form: data.form,
          inputs: data.inputs,
        });
      }

      fetchFormToModify();
    }
  }, []);

  if (!form.form) return <p>No form found</p>;

  return (
    <div className="metadata-inputs">
      <form className="title-and-description">
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
      </form>
      {form.inputs.length === 0 ? (
        <div className="no-items-yet">
          <p>You haven't added any items yet</p>
        </div>
      ) : (
        <div className="added-inputs">
          {form.inputs.map((input) => (
            <div className={`added-input ${input.is_active ? "" : "deleted"}`}>
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
                  console.log(input);
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
        </div>
      )}
      <button
        className="add-new-input"
        type="button"
        onClick={() => setCurrentView("input-types-selector")}
      >
        <PlusIcon /> Add new form item
      </button>

      {isForDraft ? (
        <button className="publish-button" onClick={() => handlePublishForm()}>
          <ShareIcon /> Publish Form
        </button>
      ) : (
        <button className="save-button" onClick={() => saveForm()}>
          <SaveIcon /> Save Form
        </button>
      )}
    </div>
  );
};
