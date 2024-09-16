import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddedInputType, DraftFormType, InputTypeType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import { StagedItemForm } from "../../ui/StagedItemForm/StagedItemForm";
import "./EditDraftForm.css";

export const EditDraftForm = () => {
  const { formId } = useParams();

  const [draft, setDraft] = useState<{
    form: DraftFormType | null;
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

  async function saveDraft() {
    try {
      console.log("saveDraft", { draft });
      const response = await fetch("http://localhost:3001/form/update-form", {
        method: "put",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          draftFormId: draft.form!.id,
          title: draft.form!.title,
          description: draft.form!.description,
          userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
        }),
      });

      if (!response.ok) throw new Error("An error occured while updating the form draft");

      const data = await response.json();

      setDraft({
        inputs: draft?.inputs,
        form: data,
      });
    } catch (error) {
      handleCatchError(error);
    }
  }

  function renderView() {
    switch (currentView) {
      case "metadata-inputs": {
        return (
          <MetadataInputs
            form={draft}
            setForm={setDraft}
            setCurrentView={setCurrentView}
            setPrevSavedForm={null}
            isForDraft={true}
            draftIdToFetch={null}
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
        const response = await fetch(
          `http://localhost:3001/form/get-draft-form/${formId}`
        );

        if (!response.ok) throw new Error("There was an error fetching draft form");

        const data = await response.json();

        setDraft({
          form: data.form,
          inputs: data.inputs,
        });

        console.log("fetched draft form to edit", data);
      } catch (error) {
        handleCatchError(error);
      }
    }

    fetchFormForEdit();
  }, []);

  return (
    <main className="edit-form">
      {renderView()}
    </main>
  );
};
