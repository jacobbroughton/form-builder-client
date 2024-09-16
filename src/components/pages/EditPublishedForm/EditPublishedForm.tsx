import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddedInputType, InputTypeType, PublishedFormType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import { StagedItemForm } from "../../ui/StagedItemForm/StagedItemForm";
import "./EditPublishedForm.css";

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
  const [initiallyLoading, setInitiallyLoading] = useState(false);
  const [currentView, setCurrentView] = useState("metadata-inputs");
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );

  async function saveForm() {
    try {
      if (!form.form) return;

      const response = await fetch("http://localhost:3001/form/update-form", {
        method: "put",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          formId: form.form.id,
          title: form.form.title,
          description: form.form!.description,
          userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
          isForDraft: false,
        }),
      });

      if (!response.ok) throw new Error("An error occured while updating the form form");

      const data = await response.json();

      setForm({
        inputs: form?.inputs,
        form: data,
      });

      navigate(`/form/${form.form.id}`);
    } catch (error) {
      handleCatchError(error);
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
          <StagedItemForm
            form={form}
            setForm={setForm}
            setCurrentView={setCurrentView}
            stagedNewInputType={stagedNewInputType}
            setStagedNewInputType={setStagedNewInputType}
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
        const response = await fetch(
          `http://localhost:3001/form/get-published-form/${formId}`
        );

        if (!response.ok) throw new Error("There was an error fetching form form");

        const data = await response.json();

        setForm({
          form: data.form,
          inputs: data.inputs,
        });

        console.log("fetched published form to edit", data);
      } catch (error) {
        handleCatchError(error);
      }
    }

    fetchFormForEdit();
  }, []);

  return <main className="edit-form">{renderView()}</main>;
};
