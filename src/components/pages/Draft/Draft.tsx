import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { InputType, PublishedFormType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DeleteModal } from "../../ui/DeleteModal/DeleteModal";
import { DraftFormHeader } from "../../ui/DraftFormHeader/DraftFormHeader";
import FormGroupContainer from "../../ui/FormGroupContainer/FormGroupContainer";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import "./Draft.css";

export const Draft = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState<boolean>(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<InputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState<boolean>(false);
  const [DeleteModalShowing, setDeleteModalShowing] = useState<boolean>(false);
  const [view, setView] = useState<string>(queryParams.get("view") || "form");
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
      {form && (
        <DraftFormHeader form={form} setDeleteModalShowing={setDeleteModalShowing} />
      )}
      <div className="row">
        <div className="container">
          {formLoading ? (
            <p>Form loading...</p>
          ) : !form ? (
            <p>No form found</p>
          ) : (
            <>
              {inputs.length ? (
                <div className="inputs">
                  {inputs.map((input) => (
                    <FormGroupContainer
                      label={input.metadata_question}
                      description={input.metadata_description}
                      placeholder={input.properties?.[`placeholder`]?.value || "..."}
                      disabled={false}
                      type={input.input_type_name}
                      inputValue={input.value}
                      isRequired={input.is_required}
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
      </div>
    </main>
  );
};
