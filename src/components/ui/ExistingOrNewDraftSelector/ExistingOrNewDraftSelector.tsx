import { timeAgo } from "../../../utils/usefulFunctions";

const ExistingOrNewDraftSelector = ({
  draftForms,
  setPrevSavedForm,
  draft,
  setDraft,
  setCurrentView,
  createNewDraft,
}) => {
  return (
    <div className="existing-or-new-draft-view">
      <p>Would you like to create a new draft or modify an existing one?</p>
      <div className="options">
        <div className="modify-container">
          <p className="small-text">Modify an existing draft</p>
          <div className="draft-options">
            {draftForms.map((formOption) => (
              <button
                onClick={() => {
                  console.log(formOption);
                  setPrevSavedForm({
                    form: formOption,
                    inputs: [],
                  });

                  setDraft({
                    inputs: [],
                    form: formOption,
                  });

                  setCurrentView("metadata-inputs");
                }}
              >
                <p className="title">{formOption.title}</p>
                <p className="created-date">Created {timeAgo(formOption.created_at)}</p>
              </button>
            ))}
          </div>
        </div>
        <button
          className="create-new-draft"
          onClick={() => {
            createNewDraft();

            setCurrentView("metadata-inputs");
          }}
        >
          + Create a new draft
        </button>
      </div>
    </div>
  );
};
export default ExistingOrNewDraftSelector;
