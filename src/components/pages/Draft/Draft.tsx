import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { InputType, PublishedFormType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DeleteModal } from "../../ui/DeleteModal/DeleteModal";
import { DraftFormHeader } from "../../ui/DraftFormHeader/DraftFormHeader";
import FormCreator from "../../ui/FormCreator/FormCreator";
import FormGroupContainer from "../../ui/FormGroupContainer/FormGroupContainer";
import { MultipleChoiceForUser } from "../../ui/MultipleChoiceForUser/MultipleChoiceForUser";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import "./Draft.css";
import { LinearScaleForUser } from "../../ui/LinearScaleForUser/LinearScaleForUser";

export const Draft = () => {
  const navigate = useNavigate();
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState<boolean>(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<InputType[]>([]);
  const [selectedLinearScaleNumber, setSelectedLinearScaleNumber] = useState<
    number | null
  >(null);

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
                  {inputs.map((input) =>
                    input.input_type_name === "Multiple Choice" ? (
                      <MultipleChoiceForUser
                        question={input.metadata_question}
                        description={input.metadata_description}
                        isRequired={input.is_required}
                        options={input.options}
                        handleOptionClick={(option) => {
                          console.log(inputs);
                          setInputs(
                            inputs.map((input) => ({
                              ...input,
                              ...(option.input_id === input.id && {
                                options: input.options.map((innerOption) => ({
                                  ...innerOption,
                                  checked: innerOption.id === option.id,
                                })),
                              }),
                            }))
                          );
                        }}
                        disabled={false}
                      />
                    ) : input.input_type_name === "Linear Scale" ? (
                      <LinearScaleForUser
                        question={input.metadata_question}
                        description={input.metadata_description}
                        isRequired={input.is_required}
                        minLinearScale={input.linearScale?.min}
                        maxLinearScale={input.linearScale?.max}
                        selectedLinearScaleNumber={selectedLinearScaleNumber}
                        setSelectedLinearScaleNumber={setSelectedLinearScaleNumber}
                      />
                    ) : (
                      <FormGroupContainer
                        label={input.metadata_question}
                        description={input.metadata_description}
                        isRequired={input.is_required}
                        placeholder={input.properties?.[`placeholder`]?.value || "..."}
                        disabled={false}
                        type={input.input_type_name}
                        inputValue={input.value}
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
                    )
                  )}
                </div>
              ) : (
                <NoPromptsMessage
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
        <FormCreator
          creatorInfo={{
            profile_picture: form?.created_by_profile_picture || "",
            username: form?.created_by_username || "",
            created_at: form?.created_at || "",
          }}
        />
      </div>
    </main>
  );
};
