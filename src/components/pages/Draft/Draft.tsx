import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { InputType, PublishedFormType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DeleteModal } from "../../ui/DeleteModal/DeleteModal";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import "./Draft.css";
import FormGroupContainer from "../../ui/FormGroupContainer/FormGroupContainer";

export const Draft = () => {
  const navigate = useNavigate();
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState<boolean>(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<InputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState<boolean>(false);
  const [DeleteModalShowing, setDeleteModalShowing] = useState<boolean>(false);
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
                      setDeleteModalShowing(true);
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
                  <FormGroupContainer
                    label="Form name"
                    placeholder="Title"
                    type="input"
                    inputValue={input.value}
                    isRequired={false}
                    handleChange={(e) => {
                      setInputs(
                        inputs.map((localInput) => ({
                          ...localInput,
                          ...(localInput.id === input.id && {
                            value: e.target.value,
                          }),
                        }))
                      );
                    }}
                  />
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
        {DeleteModalShowing ? (
          <DeleteModal
            label="Delete draft?"
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
