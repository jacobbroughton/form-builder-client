import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddedInputType, InputTypeType, PublishedFormType } from "../../../lib/types";
import { printError } from "../../../utils/usefulFunctions";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./EditPublishedForm.css";
import { getPublishedForm, updateForm } from "../../../utils/fetchRequests";
import { ErrorContext } from "../../../providers/ErrorContextProvider";

export const EditPublishedForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<{
    form: PublishedFormType | null;
    inputs: AddedInputType[];
  }>({
    form: null,
    inputs: [],
  });
  const [currentView, setCurrentView] = useState("metadata-inputs");
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );

  const { setError } = useContext(ErrorContexts);

  async function saveForm() {
    try {
      if (!form.form) return;

      const data = await updateForm({
        formId: form.form.id,
        title: form.form.title,
        description: form.form!.description,
        userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
        isForDraft: false,
      });

      setForm({
        inputs: form?.inputs,
        form: data,
      });

      navigate(`/form/${form.form.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }

      printError(error);
    }
  }

  function renderView() {
    switch (currentView) {
      case "metadata-inputs": {
        return (
          <MetadataInputs
            form={form}
            setForm={setForm}
            setCurrentView={setCurrentView}
            setPrevSavedForm={null}
            isForDraft={false}
            draftIdToFetch={null}
            saveForm={saveForm}
          />
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

  useEffect(() => {
    async function fetchFormForEdit() {
      try {
        const data = await getPublishedForm({ formId });

        setForm({
          form: data.form,
          inputs: data.inputs,
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }

        printError(error);
      }
    }

    fetchFormForEdit();
  }, []);

  return <main className="edit-form">{renderView()}</main>;
};
