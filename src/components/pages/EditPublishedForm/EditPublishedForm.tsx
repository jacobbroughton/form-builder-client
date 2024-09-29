import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useGetPublishedForm } from "../../../hooks/useGetPublishedForm";
import { useUpdatePublishedForm } from "../../../hooks/useUpdatePublishedForm";
import { AddedInputType, InputTypeType, PublishedFormType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { TrashIcon } from "../../ui/icons/TrashIcon";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import SavedStatus from "../../ui/SavedStatus/SavedStatus";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./EditPublishedForm.css";
import DeleteFormModal from "../../ui/DeleteFormModal/DeleteFormModal";
import ArrowRightIcon from "../../ui/icons/ArrowRightIcon";

export const EditPublishedForm = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const { setError } = useContext(ErrorContext);
  const { deletePublishedForm } = useDeletePublishedForm();
  const { getPublishedForm } = useGetPublishedForm();
  const { updatePublishedForm } = useUpdatePublishedForm();

  const [saved, setSaved] = useState(true);
  const [form, setForm] = useState<{
    form: PublishedFormType | null;
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

  async function saveForm() {
    try {
      const data = await updatePublishedForm({
        formId: form.form.id,
        title: form.form.title,
        description: form.form!.description,
      });

      setForm({
        inputs: form?.inputs,
        form: data,
      });

      setSaved(true);

      // navigate(`/form/${form.form.id}`);
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
              form={form}
              setForm={setForm}
              setCurrentView={setCurrentView}
              isForDraft={false}
            />
            <button
              className="action-button-with-icon red"
              // onClick={() => handleFormDelete()}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteFormModalShowing(true);
              }}
            >
              <TrashIcon /> Delete Form
            </button>
            <button
              className="action-button-with-icon "
              type="button"
              onClick={() => saveForm()}
              disabled={saved}
            >
              <SaveIcon /> Save Form
            </button>
            <button
              className="action-button-with-icon"
              onClick={async () => {
                await saveForm();
                navigate(`/form/${form.form?.id}`);
              }}
            >
              <ArrowRightIcon />{" "}
              <span
                style={{
                  ...(saved && {
                    color: "grey",
                  }),
                }}
              >
                Save &
              </span>{" "}
              Go to form
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
            form={form}
            setForm={setForm}
            setCurrentView={setCurrentView}
            stagedNewInputType={stagedNewInputType}
            setStagedNewInputType={setStagedNewInputType}
            isForDraft={false}
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

  async function handleFormDelete() {
    try {
      if (!form.form!.id) throw new Error("No form id provided");

      await deletePublishedForm({ formId: form.form!.id });

      navigate("/form-deleted");
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    if (form.form && prevSavedForm.form) {
      setSaved(
        !(
          form.form.title !== prevSavedForm.form.title ||
          form.form.description !== prevSavedForm.form.description
        )
      );
    }
  }, [
    form.form?.description,
    form.form?.title,
    prevSavedForm.form?.description,
    prevSavedForm.form?.title,
  ]);

  useEffect(() => {
    async function fetchFormForEdit() {
      try {
        const data = await getPublishedForm({ formId });

        setPrevSavedForm({
          form: data.form,
          inputs: data.inputs,
        });

        setForm({
          form: data.form,
          inputs: data.inputs,
        });
      } catch (error) {
        handleCatchError(error, setError, null);
      }
    }

    fetchFormForEdit();
  }, []);

  return (
    <main className="edit-form">
      <DraftPublishedTag draftOrPublished="published" />
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
