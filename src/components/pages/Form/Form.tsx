import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddedInputType, PublishedFormType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { FormInput } from "../../ui/FormInput/FormInput";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import "./Form.css";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import { deletePublishedForm, getPublishedForm } from "../../../utils/fetchRequests";
import { PlanetIcon } from "../../ui/icons/PlanetIcon";

export const Form = () => {
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<AddedInputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const [deletedViewShowing, setDeletedViewShowing] = useState(false);

  async function handleFormDelete(): Promise<void> {
    try {
      const data = await deletePublishedForm({ formId });

      setDeletedViewShowing(true);

      console.log("Deleted form", data);
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    async function getForm(): Promise<void> {
      try {
        setFormLoading(true);

        const data = await getPublishedForm({ formId });

        setForm(data.form);
        setInputs(data.inputs);
        setFormLoading(false);
      } catch (error) {
        handleCatchError(error);
      }
    }

    getForm();
  }, []);

  return (
    <main className="published-form">
      {formLoading ? (
        <p>Form loading...</p>
      ) : !form ? (
        <p>No form found</p>
      ) : deletedViewShowing ? (
        <p>This form has been deleted.</p>
      ) : (
        <>
          <div className="form-controls">
            <div className="published-status">
              <PlanetIcon /> Published
            </div>
            <div className="menu-toggle-button-container">
              <button
                className="menu-toggle-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormPopupMenuToggled(!formPopupMenuToggled);
                }}
              >
                <ThreeDotsIcon />
              </button>
              {formPopupMenuToggled ? (
                <FormPopupMenu
                  formId={form.id}
                  isDraft={false}
                  setFormPopupToggled={setFormPopupMenuToggled}
                  handleFormDelete={() => handleFormDelete()}
                />
              ) : (
                false
              )}
            </div>
          </div>
          <div className="heading">
            <h1 className="title">{form.title}</h1>
            <p className="description">{form.description}</p>
          </div>
          <div className="inputs">
            {inputs.length ? (
              inputs.map((input) => <FormInput input={input} />)
            ) : (
              <NoPromptsMessage formId={form.id} isDraft={false} />
            )}
          </div>
        </>
      )}
    </main>
  );
};
