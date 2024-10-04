import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { usePublish } from "../../../hooks/usePublish";
import { useUpdateDraftForm } from "../../../hooks/useUpdateDraftForm";
import {
  AddedInputType,
  DraftFormType,
  InputTypeType,
  PrivacyOptionType,
} from "../../../lib/types";
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
import DeleteModal from "../../ui/DeleteModal/DeleteModal";
import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
import { EditIcon } from "../../ui/icons/EditIcon";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import PrivacyOptions from "../../ui/PrivacyOptions/PrivacyOptions";
import ArrowRightIcon from "../../ui/icons/ArrowRightIcon";
import SelectedPrivacyOptionButton from "../../ui/SelectedPrivacyOptionButton/SelectedPrivacyOptionButton";

export const EditDraftForm = () => {
  const navigate = useNavigate();
  const { formId, initialView } = useParams();
  const { setError } = useContext(ErrorContext);
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { publish } = usePublish();
  const { updateDraftForm } = useUpdateDraftForm();

  const {
    getPrivacyOptions,
    privacyOptions,
    setPrivacyOptions,
    loading: privacyOptionsLoading,
    error: privacyOptionsError,
  } = useGetPrivacyOptions();

  const [stagedPrivacyOptions, setStagedPrivacyOptions] = useState<PrivacyOptionType[]>(
    []
  );
  const [privacyPasskey, setPrivacyPasskey] = useState("");
  const [reflectFormPrivacyOption, setReflectFormPrivacyOption] = useState(true);

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

  const [currentView, setCurrentView] = useState(initialView || "metadata-inputs");
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );
  const [DeleteModalShowing, setDeleteModalShowing] = useState<boolean>(false);

  async function saveDraft(): Promise<void> {
    try {
      console.log(draft);
      const data = await updateDraftForm({
        formId: draft.form!.id,
        title: draft.form!.title,
        description: draft.form!.description,
        privacyId: stagedPrivacyOptions.find((privacyOption) => privacyOption.checked)!
          .id,
        privacyPasskey,
      });

      setPrevSavedForm({
        inputs: draft?.inputs,
        form: data,
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

  const stagedSelectedPrivacyOption = stagedPrivacyOptions.find(
    (privacyOption) => privacyOption.checked
  );

  const selectedPrivacyOption = privacyOptions.find(
    (privacyOption) => privacyOption.checked
  );

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
            {selectedPrivacyOption ? (
              <SelectedPrivacyOptionButton
                handleClick={() => setCurrentView("privacy-selector")}
                selectedPrivacyOption={selectedPrivacyOption}
              />
            ) : (
              false
            )}
            <div className="form-buttons">
              <button
                className="action-button-with-icon red"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModalShowing(true);
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
            </div>
          </>
        );
      }
      case "privacy-selector": {
        return (
          <>
            <button
              className="action-button-with-icon"
              onClick={() => {
                console.log(
                  stagedSelectedPrivacyOption?.needs_passkey,
                  privacyPasskey,
                  !selectedPrivacyOption?.needs_passkey
                );
                if (
                  stagedSelectedPrivacyOption?.needs_passkey &&
                  privacyPasskey !== "" &&
                  !selectedPrivacyOption?.needs_passkey
                )
                  setPrivacyPasskey("");
                setStagedPrivacyOptions(privacyOptions);
                setCurrentView("metadata-inputs");
              }}
            >
              <ArrowLeftIcon /> Back
            </button>
            <PrivacyOptions
              privacyOptions={stagedPrivacyOptions}
              setPrivacyOptions={setStagedPrivacyOptions}
              loading={privacyOptionsLoading}
              error={privacyOptionsError}
              setPrivacyPasskey={setPrivacyPasskey}
              privacyPasskey={privacyPasskey}
            />

            <button
              className="action-button-with-icon"
              disabled={
                stagedSelectedPrivacyOption?.needs_passkey && privacyPasskey === ""
              }
              onClick={() => {
                if (stagedSelectedPrivacyOption?.needs_passkey && privacyPasskey === "")
                  return;
                console.log({ stagedPrivacyOptions });
                setPrivacyOptions(stagedPrivacyOptions);
                setReflectFormPrivacyOption(false);
                setCurrentView("metadata-inputs");
              }}
            >
              Confirm & Continue <ArrowRightIcon />
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
      case "staged-input-form": {
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
          <p className="small-text">Hmm...not sure where you were trying to go, but it probably isn't here</p>
        );
      }
    }
  }

  useEffect(() => {
    async function fetchFormForEdit() {
      try {
        const data = await getDraftForm({ formId });

        console.log(data);

        setPrevSavedForm({
          form: data.form,
          inputs: data.inputs,
        });

        setDraft({
          form: data.form,
          inputs: data.inputs,
        });

        getPrivacyOptions(data.form.privacy_id);

        setPrivacyPasskey(data.form.passkey);
      } catch (error) {
        handleCatchError(error, setError, null);
      }
    }

    fetchFormForEdit();
  }, []);

  useEffect(() => {
 
    if (draft.form && prevSavedForm.form) {
      const condition =
        draft.form.title !== prevSavedForm.form.title ||
        draft.form.description !== prevSavedForm.form.description ||
        selectedPrivacyOption?.id !== draft.form.privacy_id ||
        privacyPasskey !== draft.form.passkey;

      setSaved(!condition);
    }
  }, [
    draft.form?.description,
    draft.form?.title,
    prevSavedForm.form?.description,
    prevSavedForm.form?.title,
    selectedPrivacyOption?.id,
    privacyPasskey,
  ]);

  useEffect(() => {
    if (reflectFormPrivacyOption)
      setStagedPrivacyOptions(
        privacyOptions.map((privacyOption) => ({
          ...privacyOption,
          checked: privacyOption.id === draft.form?.privacy_id,
        }))
      );
  }, [privacyOptions, draft, reflectFormPrivacyOption]);

  return (
    <main className="edit-draft-form">
      <div className="container">
        <DraftPublishedTag draftOrPublished="draft" />
        {renderView()}
        {DeleteModalShowing ? (
          <DeleteModal
            label="Delete draft?"
            handleDeleteClick={() => handleFormDelete()}
            setDeleteModalShowing={setDeleteModalShowing}
          />
        ) : (
          false
        )}
      </div>
    </main>
  );
};
