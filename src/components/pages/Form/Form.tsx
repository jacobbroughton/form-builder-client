import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useGetPublishedForm } from "../../../hooks/useGetPublishedForm";
import { AddedInputType, PublishedFormType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { FormInput } from "../../ui/FormInput/FormInput";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import { CheckIcon } from "../../ui/icons/CheckIcon";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import "./Form.css";
import DeleteFormModal from "../../ui/DeleteFormModal/DeleteFormModal";

export const Form = () => {
  const { deletePublishedForm } = useDeletePublishedForm();
  const { getPublishedForm } = useGetPublishedForm();
  const { formId } = useParams();
  const { user } = useContext(UserContext);
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<AddedInputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const [deleteFormModalShowing, setDeleteFormModalShowing] = useState<boolean>(false);

  const { setError } = useContext(ErrorContext);
  const navigate = useNavigate();

  async function handleFormDelete(): Promise<void> {
    try {
      await deletePublishedForm({ formId });

      navigate("/form-deleted");
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handleFormSubmit() {}

  useEffect(() => {
    async function getForm(): Promise<void> {
      try {
        setFormLoading(true);

        const data = await getPublishedForm({ formId });

        setForm(data.form);
        setInputs(data.inputs);
        setFormLoading(false);
      } catch (error) {
        handleCatchError(error, setError, null);
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
      ) : (
        <>
          <div className="form-controls">
            {user ? <DraftPublishedTag draftOrPublished={"published"} /> : false}
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
                  isDraft={false}
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
          <div className={`heading ${inputs.length == 0 ? "no-margin-bottom" : ""}`}>
            <h1 className="title">{form.title}</h1>
            {form.description ? <p className="description">{form.description}</p> : false}
          </div>
          {inputs.length ? (
            <>
              <div className="inputs">
                {inputs.map((input) => (
                  <FormInput input={input} />
                ))}
              </div>
              <button
                className="submit-button"
                type="button"
                onClick={() => handleFormSubmit()}
              >
                <CheckIcon /> Submit
              </button>
            </>
          ) : (
            <NoPromptsMessage formId={form.id} isDraft={false} />
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
    </main>
  );
};
