import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import ThreeDotsIcon from "../icons/ThreeDotsIcon";
import InputPopupMenu from "../InputPopupMenu/InputPopupMenu";
import { useNavigate } from "react-router-dom";
import { handleCatchError } from "../../../utils/usefulFunctions";

const MetadataInputs = ({
  saved,
  autoSaveCountdown,
  draft,
  setDraft,
  setCurrentView,
}) => {
  const [idForInputPopup, setIdForInputPopup] = useState<number | null>(null);
  const [inputPopupToggled, setInputPopupToggled] = useState(false);
  const navigate = useNavigate();

  async function handleChangeDraftInputEnabledStatus(clickedInput): Promise<void> {
    try {
      const newActiveStatus = clickedInput.is_active ? false : true;

      const response = await fetch(
        `http://localhost:3001/form/change-draft-input-enabled-status/${clickedInput.id}`,
        {
          method: "put",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            newActiveStatus,
          }),
        }
      );

      if (!response.ok)
        throw new Error("There was an error deleting this input from the draft form");

      const data = await response.json();

      setDraft({
        ...draft,
        inputs: draft.inputs.map((input) => ({
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
      console.log("Draft before publish", draft);
      const response = await fetch("http://localhost:3001/form/publish", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          draftFormId: draft!.form.id,
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

  return (
    <>
      <p className="saved-status">
        <span className={`${saved ? "saved" : ""}`}></span>
        {saved ? "Saved Draft" : "Unsaved"}{" "}
        {!saved ? `(Autosaving in ${autoSaveCountdown}s)` : false}
      </p>
      <form className="title-and-description">
        <input
          value={draft.form.title}
          onChange={(e) =>
            setDraft({
              ...draft,
              form: {
                ...draft.form,
                title: e.target.value,
              },
            })
          }
          placeholder="Title"
        />
        <textarea
          value={draft.form.description}
          onChange={(e) =>
            setDraft({
              ...draft,
              form: {
                ...draft.form,
                description: e.target.value,
              },
            })
          }
          placeholder="Description"
        />
      </form>
      {draft.inputs.length === 0 ? (
        <div className="no-items-yet">
          <p>You haven't added any items yet</p>
        </div>
      ) : (
        <div className="added-inputs">
          {draft.inputs.map((input) => (
            <div className={`added-input ${input.is_active ? "" : "deleted"}`}>
              <p className="name">{input.metadata_name}</p>
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

      <button className="publish-button" onClick={() => handlePublishForm()}>
        <ShareIcon /> Publish Form
      </button>
    </>
  );
};
export default MetadataInputs;
