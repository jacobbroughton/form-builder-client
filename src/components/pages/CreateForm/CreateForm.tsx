import { useEffect, useState } from "react";
import { InputTypeType, AddedInputType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import ExistingOrNewDraftSelector from "../../ui/ExistingOrNewDraftSelector/ExistingOrNewDraftSelector";
import MetadataInputs from "../../ui/MetadataInputs/MetadataInputs";
import StagedItemForm from "../../ui/StagedItemForm/StagedItemForm";
import InputTypeSelector from "../../ui/InputTypeSelector/InputTypeSelector";
import "./CreateForm.css";

const CreateForm = () => {
  const [draft, setDraft] = useState<{
    form: { title: string; description: string };
    inputs: [];
  }>({
    form: {
      title: "Untitled",
      description: "",
    },
    inputs: [],
  });

  const [prevSavedForm, setPrevSavedForm] = useState({
    form: { title: "Untitled", description: "" },
    inputs: [],
  });

  const [initiallyLoading, setInitiallyLoading] = useState(false);
  const [currentView, setCurrentView] = useState("existing-or-new-draft");
  const [saved, setSaved] = useState(true);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(2);
  const [needsAutoSave, setNeedsAutoSave] = useState(false);

  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );

  const [draftForms, setDraftForms] = useState([]);

  let isStoring = false;

  async function createNewDraft(): Promise<void> {
    try {
      if (isStoring) return;
      isStoring = true;

      const response = await fetch("http://localhost:3001/form/store-initial-draft", {
        method: "post",
        body: JSON.stringify({
          userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error("An error occured while storing initial form draft");

      const data = await response.json();

      console.log("Stored initial draft", data);

      setPrevSavedForm({
        form: data,
        inputs: [],
      });

      setDraft({
        form: data,
        inputs: [],
      });
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    // if (currentView == "existing-or-new-draft") {
    getDraftForms();
    // }
  }, []);

  async function saveDraft() {
    try {
      console.log("saveDraft", { draft });
      const response = await fetch("http://localhost:3001/form/update-draft", {
        method: "put",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          draftFormId: draft!.form?.id,
          title: draft.form.title,
          description: draft.form.description,
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

  async function getDraftForms() {
    try {
      setInitiallyLoading(true);
      const response = await fetch(
        `http://localhost:3001/form/get-draft-forms/75c75c02-b39b-4f33-b940-49aa20b9eda4`
      );

      if (!response.ok) throw new Error("There was a problem fetching forms");

      const data = await response.json();

      console.log("Got draft forms");

      setDraftForms(data);

      if (!data.length) {
        console.log("swag");
        createNewDraft();
        setCurrentView("metadata-inputs");
      }

      setInitiallyLoading(false);
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    async function autoSaveDraft(): Promise<void> {
      try {
        setPrevSavedForm({
          form: draft.form,
          inputs: draft.inputs,
        });

        saveDraft();

        setSaved(true);
        setNeedsAutoSave(false);
        setAutoSaveCountdown(2);
      } catch (error) {
        if (typeof error === "string") {
          console.log(error.toUpperCase());
        } else if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }

    const interval1 = setInterval(() => {
      if (needsAutoSave) {
        autoSaveDraft();
      }
    }, 2000);

    return () => {
      clearInterval(interval1);
    };
  }, [needsAutoSave, draft.form.description, draft.form.title]);

  useEffect(() => {
    const interval2 = setInterval(() => {
      if (!saved) {
        setAutoSaveCountdown((prev) => (prev -= 1));
      }
    }, 1000);
    return () => {
      clearInterval(interval2);
    };
  }, [saved]);

  useEffect(() => {
    if (
      draft.form.title !== prevSavedForm.form.title ||
      draft.form.description !== prevSavedForm.form.description
    ) {
      setSaved(false);
      setNeedsAutoSave(true);
    }
  }, [
    draft.form.description,
    draft.form.title,
    prevSavedForm.form.description,
    prevSavedForm.form.title,
  ]);

  function renderView() {
    switch (currentView) {
      case "existing-or-new-draft": {
        return (
          <ExistingOrNewDraftSelector
            draftForms={draftForms}
            setPrevSavedForm={setPrevSavedForm}
            setDraft={setDraft}
            setCurrentView={setCurrentView}
            createNewDraft={createNewDraft}
          />
        );
      }
      case "metadata-inputs": {
        return (
          <MetadataInputs
            saved={saved}
            autoSaveCountdown={autoSaveCountdown}
            draft={draft}
            setDraft={setDraft}
            setCurrentView={setCurrentView}
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
            draft={draft}
            setDraft={setDraft}
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

  return (
    <main className="create-form">
      {initiallyLoading ? <p>Loading...</p> : renderView()}
    </main>
  );
};
export default CreateForm;
