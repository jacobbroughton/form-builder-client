import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { usePublish } from "../../../hooks/usePublish";
import { useUpdateDraftForm } from "../../../hooks/useUpdateDraftForm";
import { AddedInputType, DraftFormType, InputTypeType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import SavedStatus from "../../ui/SavedStatus/SavedStatus";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { ShareIcon } from "../../ui/icons/ShareIcon";
import { TrashIcon } from "../../ui/icons/TrashIcon";
import "./EditDraftForm.css";
import DeleteFormModal from "../../ui/DeleteFormModal/DeleteFormModal";

export const EditDraftForm = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const { setError } = useContext(ErrorContext);
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { publish } = usePublish();
  const { updateDraftForm } = useUpdateDraftForm();

  const [saved, setSaved] = useState(true);
  const [draft, setDraft] = useState<{
    form: DraftFormType | null;
    inputs: AddedInputType[];
  }>({
    form: null,
    inputs: [],
  });

  const [prevSavedForm, setPrevSavedForm] = useState<{
    form: DraftFormType | null;
    inputs: AddedInputType[];
  }>({
    form: null,
    inputs: [],
  });

  const [currentView, setCurrentView] = useState("metadata-inputs");
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );
  const [deleteFormModalShowing, setDeleteFormModalShowing] = useState<boolean>(false);

  async function saveDraft(): Promise<void> {
    try {
      console.log(draft);
      const data = await updateDraftForm({
        formId: draft.form!.id,
        title: draft.form!.title,
        description: draft.form!.description
      });

      setDraft({
        inputs: draft?.inputs,
        form: data,
      });

      setSaved(true);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handlePublishForm() {
    try {
      const data = await publish({
        draftFormId: draft.form!.id,
      });

      navigate(`/form/${data[0].id}`);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handleFormDelete() {
    try {
      if (!draft.form!.id) throw new Error("No form id provided");

      await deleteDraftForm({ formId: draft.form!.id });

      navigate("/form-deleted");
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  function renderView() {
    switch (currentView) {
      case "metadata-inputs": {
        return (
          <>
            <SavedStatus saved={saved} />
            <MetadataInputs
              form={draft}
              setForm={setDraft}
              setCurrentView={setCurrentView}
              isForDraft={true}
            />
            <button
              className="action-button-with-icon red"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteFormModalShowing(true);
              }}
            >
              <TrashIcon /> Delete Draft
            </button>

            <button
              className="action-button-with-icon save-button"
              // disabled={saved}
              onClick={() => saveDraft()}
            >
              <SaveIcon /> Save Draft
            </button>

            <button
              className="action-button-with-icon green publish-button"
              onClick={() => handlePublishForm()}
            >
              <ShareIcon /> Publish Form
            </button>
          </>
        );
      }
      case "input-types-selector": {
        return (
          <InputTypeSelector
            setCurrentView={setCurrentView}
            setStagedNewInputType={setStagedNewInputType}
          />
        );
      }
      case "staged-item-form": {
        return (
          <StagedInputForm
            form={draft}
            setForm={setDraft}
            setCurrentView={setCurrentView}
            stagedNewInputType={stagedNewInputType}
            setStagedNewInputType={setStagedNewInputType}
            isForDraft={true}
          />
        );
      }
      default: {
        return (
          <p>Hmm...not sure where you were trying to go, but it probably isn't here</p>
        );
      }
    }
  }

  useEffect(() => {
    async function fetchFormForEdit() {
      try {
        const data = await getDraftForm({ formId });

        setPrevSavedForm({
          form: data.form,
          inputs: data.inputs,
        });

        setDraft({
          form: data.form,
          inputs: data.inputs,
        });
      } catch (error) {
        handleCatchError(error, setError, null);
      }
    }

    fetchFormForEdit();
  }, []);

  useEffect(() => {
    if (draft.form && prevSavedForm.form) {
      setSaved(
        !(
          draft.form.title !== prevSavedForm.form.title ||
          draft.form.description !== prevSavedForm.form.description
        )
      );
    }
  }, [
    draft.form?.description,
    draft.form?.title,
    prevSavedForm.form?.description,
    prevSavedForm.form?.title,
  ]);

  return (
    <main className="edit-form">
      <DraftPublishedTag draftOrPublished="draft" />
      {renderView()}
      {deleteFormModalShowing ? (
        <DeleteFormModal
          handleDeleteClick={() => handleFormDelete()}
          setDeleteFormModalShowing={setDeleteFormModalShowing}
        />
      ) : (
        false
      )}
    </main>
  );
};
