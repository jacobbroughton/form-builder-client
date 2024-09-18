import { DraftFormType } from "../../../lib/types";
import { timeAgo } from "../../../utils/usefulFunctions";
import { PlusIcon } from "../icons/PlusIcon";
import "./ExistingOrNewDraftSelector.css";

export const ExistingOrNewDraftSelector = ({
  draftForms,
  setDraftIdToFetch,
  setCurrentView,
  createNewDraft,
}: {
  draftForms: DraftFormType[];
  setDraftIdToFetch: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  createNewDraft: () => void;
}) => {
  function handleCreateNewDraftClick() {
    createNewDraft();

    setCurrentView("metadata-inputs");
  }

  return (
    <div className="existing-or-new-draft-view">
      <p>Would you like to create a new draft or modify an existing one?</p>
      <div className="options">
        <button className="create-new-draft" onClick={handleCreateNewDraftClick}>
          Create a new draft{" "}
          <span className="plus-container">
            <PlusIcon />
          </span>
        </button>
        <div className="modify-container">
          <p className="small-text">Modify an existing draft</p>
          <div className="draft-options">
            {draftForms.map((formOption) => (
              <button
                onClick={() => {
                  setDraftIdToFetch(formOption.id);

                  setCurrentView("metadata-inputs");
                }}
              >
                <p className="title">{formOption.id}</p>
                <p className="title">{formOption.title}</p>
                <p className="created-date">Created {timeAgo(formOption.created_at)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
