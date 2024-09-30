import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { AddedInputType, PublishedFormType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import DeleteFormModal from "../../ui/DeleteFormModal/DeleteFormModal";
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
  const [formLoading, setFormLoading] = useState<boolean>(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<AddedInputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState<boolean>(false);
  const [deleteFormModalShowing, setDeleteFormModalShowing] = useState<boolean>(false);
  const { setError } = useContext(ErrorContext);

  async function handleFormDelete(): Promise<void> {
    try {
      await deleteDraftForm({ formId });

      navigate("/form-deleted");
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    async function getForm(): Promise<void> {
      try {
        setFormLoading(true);

        const data = await getDraftForm({ formId });

        setForm(data.form);
        setInputs(data.inputs);
      } catch (error) {
        handleCatchError(error, setError, null);
      } finally {
        setFormLoading(false);
      }
    }

    getForm();
  }, []);

  return (
    <main className="draft-form">
      <div className="container">
        {formLoading ? (
          <p>Form loading...</p>
        ) : !form ? (
          <p>No form found</p>
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
                    form={form}
                    isDraft={true}
                    setFormPopupToggled={setFormPopupMenuToggled}
                    handleDeleteClick={() => {
                      setDeleteFormModalShowing(true);
                    }}
                  />
                ) : (
                  false
                )}
              </div>
            </div>
            <div className="heading">
              <h1 className="title">{form.title}</h1>
              {form.description ? (
                <p className="description">{form.description}</p>
              ) : (
                false
              )}
            </div>
            {inputs.length ? (
              <div className="inputs">
                {inputs.map((input) => (
                  <FormInput input={input} inputs={inputs} setInputs={setInputs} />
                ))}
              </div>
            ) : (
              <NoPromptsMessage
                formId={form.id}
                isDraft={true}
                handleClick={() => {
                  navigate(`/edit-draft-form/${form.id}/input-types-selector`);
                }}
              />
            )}
          </>
        )}
        {deleteFormModalShowing ? (
          <DeleteFormModal
            handleDeleteClick={() => handleFormDelete()}
            setDeleteFormModalShowing={setDeleteFormModalShowing}
          />
        ) : (
          false
        )}
      </div>
    </main>
  );
};
