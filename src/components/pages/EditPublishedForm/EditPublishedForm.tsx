import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
import { usePublishedForm } from "../../../hooks/usePublishedForm";
import { useUpdatePublishedForm } from "../../../hooks/useUpdatePublishedForm";
import { InputType, InputTypeType, PublishedFormType } from "../../../lib/types";
import { CurrentViewContext } from "../../../providers/CurrentViewProvider";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import ActionButtonWithIcon from "../../ui/ActionButtonWithIcon/ActionButtonWithIcon";
import AddedInputsList from "../../ui/AddedInputsList/AddedInputsList";
import CatchView from "../../ui/CatchView/CatchView";
import { DeleteModal } from "../../ui/DeleteModal/DeleteModal";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../../ui/icons/ArrowRightIcon";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { TrashIcon } from "../../ui/icons/TrashIcon";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import PrivacyOptions from "../../ui/PrivacyOptions/PrivacyOptions";
import SelectedPrivacyOptionButton from "../../ui/SelectedPrivacyOptionButton/SelectedPrivacyOptionButton";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./EditPublishedForm.css";

export const EditPublishedForm = () => {
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);
  const { deletePublishedForm } = useDeletePublishedForm();
  const { form: initialPublishedForm, inputs: initialPublishedInputs } =
    usePublishedForm();
  const { updatePublishedForm } = useUpdatePublishedForm();

  const {
    getPrivacyOptions,
    privacyOptions,
    setPrivacyOptions,
    loading: privacyOptionsLoading,
    error: privacyOptionsError,
  } = useGetPrivacyOptions();

  const [privacyPasskey, setPrivacyPasskey] = useState<string>("");
  const [reflectFormPrivacyOption, setReflectFormPrivacyOption] = useState(true);

  const [saved, setSaved] = useState(true);
  // const [form, setForm] = useState<{
  //   form: PublishedFormType | null;
  //   inputs: InputType[];
  // }>({
  //   form: null,
  //   inputs: [],
  // });
  // const [prevSavedForm, setPrevSavedForm] = useState<{
  //   form: DraftFormType | null;
  //   inputs: InputType[];
  // }>({
  //   form: null,
  //   inputs: [],
  // });
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<InputType[]>([]);
  const [prevSavedForm, setPrevSavedForm] = useState<PublishedFormType | null>(null);
  const [prevSavedInputs, setPrevSavedInputs] = useState<InputType[]>([]);
  const { currentView, setCurrentView } = useContext(CurrentViewContext);
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );
  const [DeleteModalShowing, setDeleteModalShowing] = useState<boolean>(false);

  async function saveForm() {
    try {
      if (!form) throw new Error("No form was found when attempting to save");

      const data = await updatePublishedForm({
        formId: form.id,
        title: form.title,
        description: form.description,
        privacyId: privacyOptions.find((privacyOption) => privacyOption.checked)!.id,
        privacyPasskey,
      });

      setForm(data);
      // setForm({
      //   inputs: form?.inputs,
      //   form: data,
      // });

      setSaved(true);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  const selectedPrivacyOption = privacyOptions.find(
    (privacyOption) => privacyOption.checked
  );

  function renderView() {
    if (!form) return <p>No form during renderView</p>;

    switch (currentView) {
      case "metadata-inputs": {
        return (
          <>
            {/* <DraftPublishedTag draftOrPublished="published" /> */}
            {/* <SavedStatus saved={saved} /> */}
            <MetadataInputs form={form} setForm={setForm} />
            <AddedInputsList inputs={inputs} setInputs={setInputs} isForDraft={false} />
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
                label={`${saved ? "" : "Save & "}Go to Form`}
                color="none"
                icon={<ArrowRightIcon />}
                iconPlacement="before"
                handleClick={async () => {
                  await saveForm();
                  navigate(`/form/${form?.id}`);
                }}
                disabled={false}
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
                if (selectedPrivacyOption?.needs_passkey && privacyPasskey === "") return;
                setPrivacyOptions(privacyOptions);
                setReflectFormPrivacyOption(false);
                setCurrentView("metadata-inputs");
              }}
              disabled={
                (selectedPrivacyOption?.needs_passkey && privacyPasskey === "") || false
              }
            />
          </>
        );
      }
      case "input-types-selector": {
        return <InputTypeSelector setStagedNewInputType={setStagedNewInputType} />;
      }
      case "staged-input-form": {
        return (
          <>
            <StagedInputForm
              formId={form.id}
              inputs={inputs}
              setInputs={setInputs}
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
      if (!form!.id) throw new Error("No form id provided");

      await deletePublishedForm({ formId: form!.id });

      navigate("/form-deleted");
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    if (form && prevSavedForm) {
      const condition =
        form.title !== prevSavedForm.title ||
        form.description !== prevSavedForm.description ||
        selectedPrivacyOption?.id !== form.privacy_id ||
        privacyPasskey !== form.passkey;

      setSaved(!condition);
    }
  }, [form, prevSavedForm, selectedPrivacyOption?.id, privacyPasskey]);

  useEffect(() => {
    if (initialPublishedForm) {
      getPrivacyOptions(initialPublishedForm.privacy_id);
      setPrivacyPasskey(initialPublishedForm.passkey);
    }
  }, [initialPublishedForm]);

  useEffect(() => {
    setPrevSavedForm(initialPublishedForm);
    setPrevSavedInputs(initialPublishedInputs);
    setForm(initialPublishedForm);
    setInputs(initialPublishedInputs);

    // setPrevSavedForm({
    //   form: initialPublishedForm,
    //   inputs: inputs,
    // });

    // setForm({
    //   form: initialPublishedForm,
    //   inputs: inputs,
    // });
  }, [initialPublishedForm]);

  useEffect(() => {
    if (reflectFormPrivacyOption) {
      console.log(form);
      setPrivacyOptions(
        privacyOptions.map((privacyOption) => ({
          ...privacyOption,
          checked: privacyOption.id === form?.privacy_id,
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
            label="Delete Form?"
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
