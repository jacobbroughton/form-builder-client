import { DraftFormType } from "../../../lib/types";
import { timeAgo } from "../../../utils/usefulFunctions";
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
  return (
    <div className="existing-or-new-draft-view">
      <p>Would you like to create a new draft or modify an existing one?</p>
      <div className="options">
        <button
          className="create-new-draft"
          onClick={() => {
            createNewDraft();

            setCurrentView("metadata-inputs");
          }}
        >
          + Create a new draft
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

