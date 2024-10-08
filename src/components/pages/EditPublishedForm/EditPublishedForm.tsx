import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
import { useGetPublishedForm } from "../../../hooks/useGetPublishedForm";
import { useUpdatePublishedForm } from "../../../hooks/useUpdatePublishedForm";
import {
  DraftFormType,
  InputType,
  InputTypeType,
  PrivacyOptionType,
  PublishedFormType,
} from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import DeleteModal from "../../ui/DeleteModal/DeleteModal";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import ArrowRightIcon from "../../ui/icons/ArrowRightIcon";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { TrashIcon } from "../../ui/icons/TrashIcon";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import PrivacyOptions from "../../ui/PrivacyOptions/PrivacyOptions";
import SavedStatus from "../../ui/SavedStatus/SavedStatus";
import SelectedPrivacyOptionButton from "../../ui/SelectedPrivacyOptionButton/SelectedPrivacyOptionButton";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./EditPublishedForm.css";

export const EditPublishedForm = () => {
  const navigate = useNavigate();
  const { initialView } = useParams();
  const { setError } = useContext(ErrorContext);
  const { deletePublishedForm } = useDeletePublishedForm();
  const { form: initialPublishedForm, inputs } = useGetPublishedForm();
  const { updatePublishedForm } = useUpdatePublishedForm();

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
  const [form, setForm] = useState<{
    form: PublishedFormType | null;
    inputs: InputType[];
  }>({
    form: null,
    inputs: [],
  });
  const [prevSavedForm, setPrevSavedForm] = useState<{
    form: DraftFormType | null;
    inputs: InputType[];
  }>({
    form: null,
    inputs: [],
  });
  const [currentView, setCurrentView] = useState(initialView || "metadata-inputs");
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );
  const [DeleteModalShowing, setDeleteModalShowing] = useState<boolean>(false);

  async function saveForm() {
    try {
      if (!form) throw new Error("No form was found when attempting to save");
      if (!form.form) throw new Error("Form.form was found when attempting to save");
      const data = await updatePublishedForm({
        formId: form.form.id,
        title: form.form.title,
        description: form.form.description,
        privacyId: stagedPrivacyOptions.find((privacyOption) => privacyOption.checked)!
          .id,
        privacyPasskey,
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
            <DraftPublishedTag draftOrPublished="published" />
            <SavedStatus saved={saved} />
            <MetadataInputs
              form={form}
              setForm={setForm}
              setCurrentView={setCurrentView}
              isForDraft={false}
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
                // onClick={() => handleFormDelete()}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModalShowing(true);
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
          <p className="small-text">
            Hmm...not sure where you were trying to go, but it probably isn't here
          </p>
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
      console.log(
        selectedPrivacyOption?.id,
        form.form.privacy_id,
        privacyPasskey,
        form.form.passkey
      );
      const condition =
        form.form.title !== prevSavedForm.form.title ||
        form.form.description !== prevSavedForm.form.description ||
        selectedPrivacyOption?.id !== form.form.privacy_id ||
        privacyPasskey !== form.form.passkey;

      setSaved(!condition);
    }
  }, [
    form.form?.description,
    form.form?.title,
    prevSavedForm.form?.description,
    prevSavedForm.form?.title,
    selectedPrivacyOption?.id,
    privacyPasskey,
  ]);

  useEffect(() => {
    if (form) {
      console.log("here");
      getPrivacyOptions(form.privacy_id);
      setPrivacyPasskey(form.passkey);
    }
  }, [form]);

  useEffect(() => {
    setPrevSavedForm({
      form: initialPublishedForm,
      inputs: inputs,
    });

    setForm({
      form: initialPublishedForm,
      inputs: inputs,
    });
  }, [initialPublishedForm]);

  useEffect(() => {
    if (reflectFormPrivacyOption)
      setStagedPrivacyOptions(
        privacyOptions.map((privacyOption) => ({
          ...privacyOption,
          checked: privacyOption.id === form.form?.privacy_id,
        }))
      );
  }, [privacyOptions, form, reflectFormPrivacyOption]);

  return (
    <main className="edit-published-form">
      <div className="container">
        {renderView()}
        {DeleteModalShowing ? (
          <DeleteModal
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
