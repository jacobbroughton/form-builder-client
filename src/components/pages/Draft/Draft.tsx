import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddedInputType, PublishedFormType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { FormInput } from "../../ui/FormInput/FormInput";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import "./Draft.css";

export const Draft = () => {
  const navigate = useNavigate();
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<AddedInputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const [deletedViewShowing, setDeletedViewShowing] = useState(false);
  const { setError } = useContext(ErrorContext);

  async function handleFormDelete(): Promise<void> {
    try {
      await deleteDraftForm({ formId });

      setDeletedViewShowing(true);

      navigate("/");
    } catch (error) {
      handleCatchError(error, setError);
    }
  }

  useEffect(() => {
    async function getForm(): Promise<void> {
      try {
        setFormLoading(true);

        const data = await getDraftForm({ formId });

        setForm(data.form);
        setInputs(data.inputs);
        setFormLoading(false);
      } catch (error) {
        handleCatchError(error, setError);
      }
    }

    getForm();
  }, []);

  return (
    <main className="draft-form">
      {formLoading ? (
        <p>Form loading...</p>
      ) : !form ? (
        <p>No form found</p>
      ) : deletedViewShowing ? (
        <p>This form has been deleted.</p>
      ) : (
        <>
          <div className="form-controls">
            <DraftPublishedTag draftOrPublished="draft" />
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
                  isDraft={true}
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
            {form.description ? <p className="description">{form.description}</p> : false}
          </div>
          {inputs.length ? (
            <div className="inputs">
              {inputs.map((input) => (
                <FormInput input={input} />
              ))}
            </div>
          ) : (
            <NoPromptsMessage formId={form.id} isDraft={true} />
          )}
        </>
      )}
    </main>
  );
};
