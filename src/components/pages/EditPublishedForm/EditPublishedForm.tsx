import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
import { usePublishedForm } from "../../../hooks/usePublishedForm";
import { useUpdatePublishedForm } from "../../../hooks/useUpdatePublishedForm";
import {
  DraftFormType,
  InputType,
  InputTypeType,
  PublishedFormType,
} from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DeleteModal } from "../../ui/DeleteModal/DeleteModal";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../../ui/icons/ArrowRightIcon";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { TrashIcon } from "../../ui/icons/TrashIcon";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import PrivacyOptions from "../../ui/PrivacyOptions/PrivacyOptions";
import SavedStatus from "../../ui/SavedStatus/SavedStatus";
import SelectedPrivacyOptionButton from "../../ui/SelectedPrivacyOptionButton/SelectedPrivacyOptionButton";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./EditPublishedForm.css";
import CatchView from "../../ui/CatchView/CatchView";
import ActionButtonWithIcon from "../../ui/ActionButtonWithIcon/ActionButtonWithIcon";

export const EditPublishedForm = () => {
  const navigate = useNavigate();
  const { initialView } = useParams();
  const { setError } = useContext(ErrorContext);
  const { deletePublishedForm } = useDeletePublishedForm();
  const { form: initialPublishedForm, inputs } = usePublishedForm();
  const { updatePublishedForm } = useUpdatePublishedForm();

  const {
    getPrivacyOptions,
    privacyOptions,
    setPrivacyOptions,
    loading: privacyOptionsLoading,
    error: privacyOptionsError,
  } = useGetPrivacyOptions();

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
        privacyId: privacyOptions.find((privacyOption) => privacyOption.checked)!.id,
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
              <ActionButtonWithIcon
                label="Delete Form"
                color="red"
                icon={<TrashIcon />}
                iconPlacement="before"
                handleClick={(e) => {
                  e.stopPropagation();
                  setDeleteModalShowing(true);
                }}
              />

              <ActionButtonWithIcon
                label="Save Form"
                color="none"
                icon={<SaveIcon />}
                iconPlacement="before"
                handleClick={() => saveForm()}
                disabled={saved}
              />

              <ActionButtonWithIcon
                label="Save & Go to form"
                color="none"
                icon={<ArrowRightIcon />}
                iconPlacement="before"
                handleClick={async () => {
                  await saveForm();
                  navigate(`/form/${form.form?.id}`);
                }}
                disabled={saved}
              />
            </div>
          </>
        );
      }
      case "privacy-selector": {
        return (
          <>
            <ActionButtonWithIcon
              label="Back"
              color="none"
              icon={<ArrowLeftIcon />}
              iconPlacement="before"
              handleClick={() => {
                if (
                  selectedPrivacyOption?.needs_passkey &&
                  privacyPasskey !== "" &&
                  !selectedPrivacyOption?.needs_passkey
                )
                  setPrivacyPasskey("");
                setPrivacyOptions(privacyOptions);
                setCurrentView("metadata-inputs");
              }}
              disabled={false}
            />

            <PrivacyOptions
              privacyOptions={privacyOptions}
              setPrivacyOptions={setPrivacyOptions}
              loading={privacyOptionsLoading}
              error={privacyOptionsError}
              setPrivacyPasskey={setPrivacyPasskey}
              privacyPasskey={privacyPasskey}
            />

           

            <ActionButtonWithIcon
              label="Confirm & Continue"
              color="none"
              icon={<ArrowRightIcon />}
              iconPlacement="before"
              handleClick={() => {
                if (privacyOptions?.needs_passkey && privacyPasskey === "") return;
                setPrivacyOptions(privacyOptions);
                setReflectFormPrivacyOption(false);
                setCurrentView("metadata-inputs");
              }}
              disabled={privacyOptions?.needs_passkey && privacyPasskey === ""}
            />
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
          <>
            <StagedInputForm
              form={form}
              setForm={setForm}
              setCurrentView={setCurrentView}
              stagedNewInputType={stagedNewInputType}
              setStagedNewInputType={setStagedNewInputType}
              isForDraft={false}
            />
          </>
        );
      }
      default: {
        return <CatchView />;
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
        { formFormTitle: form.form.title, prevSavedFormTitle: prevSavedForm.form.title },
        {
          formFormDescription: form.form.description,
          prevSavedFormDesc: prevSavedForm.form.description,
        },
        {
          selectedPrivacyOptionId: selectedPrivacyOption?.id,
          formFormPrivacyId: form.form.privacy_id,
        },
        { privacyPasskey: privacyPasskey, formFormPasskey: form.form.passkey }
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
    if (initialPublishedForm) {
      getPrivacyOptions(initialPublishedForm.privacy_id);
      setPrivacyPasskey(initialPublishedForm.passkey);
    }
  }, [initialPublishedForm]);

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
    if (reflectFormPrivacyOption) {
      console.log(form.form);
      setPrivacyOptions(
        privacyOptions.map((privacyOption) => ({
          ...privacyOption,
          checked: privacyOption.id === form.form?.privacy_id,
        }))
      );
    }
  }, [form, reflectFormPrivacyOption]);

  return (
    <main className="edit-published-form">
      <div className="container">
        {renderView()}
        {DeleteModalShowing ? (
          <DeleteModal
            handleDeleteClick={() => handleFormDelete()}
            setDeleteModalShowing={setDeleteModalShowing}
            handleDeleteClick={() => alert("Delete clicked")}
          />
        ) : (
          false
        )}
      </div>
    </main>
  );
};
