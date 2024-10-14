import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAddFormView } from "../../../hooks/useAddFormView.ts";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useSubmitForm } from "../../../hooks/useSubmitInputs";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { FormContext } from "../../../providers/FormProvider.tsx";
import { UserContext } from "../../../providers/UserContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { DeleteModal } from "../../ui/DeleteModal/DeleteModal.tsx";
import FormCreator from "../../ui/FormCreator/FormCreator.tsx";
import FormGroupContainer from "../../ui/FormGroupContainer/FormGroupContainer.tsx";
import FormHeader from "../../ui/FormHeader/FormHeader.tsx";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import NoUserMessage from "../../ui/NoUserMessage/NoUserMessage";
import PasscodeCover from "../../ui/PasscodeCover/PasscodeCover.tsx";
import PrevSubmissionsModal from "../../ui/PrevSubmissionsModal/PrevSubmissionsModal.tsx";
import PreviousSubmissionsButton from "../../ui/PreviousSubmissionsButton/PreviousSubmissionsButton.tsx";
import ResponsesContainer from "../../ui/ResponsesContainer/ResponsesContainer.tsx";
import SubmitMessage from "../../ui/SubmitMessage/SubmitMessage.tsx";
import { CheckIcon } from "../../ui/icons/CheckIcon";
import "./Form.css";
import { MultipleChoiceForUser } from "../../ui/MultipleChoiceForUser/MultipleChoiceForUser.tsx";
import { LinearScaleForUser } from "../../ui/LinearScaleForUser/LinearScaleForUser.tsx";

export const Form = () => {
  const { deletePublishedForm } = useDeletePublishedForm();
  const { addFormView } = useAddFormView();
  const { submitForm } = useSubmitForm();
  const { formId } = useParams();
  const [queryParams] = useSearchParams();
  const { user } = useContext(UserContext);
  const {
    form,
    needsPasskeyValidation,
    formLoading,
    inputs,
    setInputs,
    formSubmitted,
    prevSubmissions,
    latestInputSubmissions,
    handleSubmissionsOnSubmit,
  } = useContext(FormContext);

  const [DeleteModalShowing, setDeleteModalShowing] = useState<boolean>(false);
  const [prevSubmissionsModalShowing, setPrevSubmissionsModalShowing] =
    useState<boolean>(false);
  const [submitCooldownToggled, setSubmitCooldownToggled] = useState<boolean>(false);
  const [submitCooldownCountdown, setSubmitCooldownCountdown] = useState<number>(5);
  const [view, setView] = useState<string>(queryParams.get("view") || "form");
  const [selectedLinearScaleNumber, setSelectedLinearScaleNumber] = useState<
    number | null
  >(null);

  const { setError } = useContext(ErrorContext);
  const navigate = useNavigate();

  async function handleFormDelete(): Promise<void> {
    try {
      await deletePublishedForm({ formId });

      navigate("/form-deleted");
    } catch (error) {
      handleCatchError(`Form-: ${error}`, setError, null);
    }
  }

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    try {
      if (!form) throw new Error("No form present when submitting...");
      const data = await submitForm({ formId: form.id, inputs });

      handleSubmissionsOnSubmit(data);

      setSubmitCooldownToggled(true);
      setSubmitCooldownCountdown(5);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    const cooldownInterval = setInterval(() => {
      if (submitCooldownToggled && submitCooldownCountdown) {
        setSubmitCooldownCountdown((prev) => (prev -= 1));
      }
    }, 1000);

    return () => clearInterval(cooldownInterval);
  }, [submitCooldownToggled]);

  useEffect(() => {
    if (submitCooldownCountdown === 0) {
      setSubmitCooldownToggled(false);
      setSubmitCooldownCountdown(5);
    }
  }, [submitCooldownCountdown]);

  useEffect(() => {
    addFormView();
  }, []);

  const inputsUnchanged =
    inputs.filter(
      (input) => input.value === (latestInputSubmissions?.[input.id].value || "")
    ).length === inputs.length;

  const requiredInputsLength = inputs.filter((input) => input.is_required).length;

  const requiredInputsWithAnswersLength = inputs.filter(
    (input) => input.is_required && input.value !== ""
  ).length;

  const requiredInputsAnswered = requiredInputsLength === requiredInputsWithAnswersLength;

  const submitDisabled = inputsUnchanged || !requiredInputsAnswered;

  console.log({ inputs, latestInputSubmissions });

  const isFormCreator = form?.created_by_id === user?.id;

  if (!isFormCreator && needsPasskeyValidation) return <PasscodeCover />;

  return (
    <main className="published-form">
      {form && (
        <FormHeader
          setDeleteModalShowing={setDeleteModalShowing}
          view={view}
          setView={setView}
        />
      )}
      <div className="row">
        <div className="container">
          {formLoading ? (
            <p className="small-text">Form Loading...</p>
          ) : !form ? (
            <p>No form found...</p>
          ) : view === "form" ? (
            <>
              {form.can_resubmit && prevSubmissions?.length && (
                <PreviousSubmissionsButton
                  prevSubmissions={prevSubmissions}
                  setPrevSubmissionsModalShowing={setPrevSubmissionsModalShowing}
                />
              )}

              {inputs.length ? (
                <>
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
                          placeholder={input.properties?.[`placeholder`]?.value || "..."}
                          disabled={!form.can_resubmit && formSubmitted}
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
                      )
                    )}
                  </div>
                  {user ? (
                    submitCooldownToggled && prevSubmissions[0] ? (
                      <SubmitMessage
                        canResubmitForm={form.can_resubmit}
                        submitCooldownCountdown={submitCooldownCountdown}
                        prevSubmissions={prevSubmissions}
                      />
                    ) : prevSubmissions?.length ? (
                      form.can_resubmit ? (
                        <button
                          className="submit-button"
                          type="button"
                          disabled={submitDisabled}
                          onClick={(e) => {
                            if (submitDisabled) return;
                            handleFormSubmit(e);
                          }}
                        >
                          Re-submit
                        </button>
                      ) : (
                        <p className="small-text">
                          You submitted this form on{" "}
                          {new Date(
                            prevSubmissions[prevSubmissions.length - 1].created_at
                          ).toLocaleDateString()}
                        </p>
                      )
                    ) : (
                      <button
                        disabled={submitDisabled}
                        className="submit-button"
                        type="button"
                        onClick={(e) => handleFormSubmit(e)}
                      >
                        <CheckIcon /> Submit
                      </button>
                    )
                  ) : (
                    <NoUserMessage message="to submit this form" />
                  )}
                </>
              ) : (
                <NoPromptsMessage
                  isDraft={false}
                  handleClick={() =>
                    navigate(`/edit-published-form/${form.id}/input-types-selector`)
                  }
                />
              )}
            </>
          ) : view === "responses" ? (
            <ResponsesContainer />
          ) : (
            false
          )}
          {DeleteModalShowing ? (
            <DeleteModal
              label="Delete form?"
              handleDeleteClick={() => handleFormDelete()}
              setDeleteModalShowing={setDeleteModalShowing}
            />
          ) : prevSubmissionsModalShowing ? (
            <PrevSubmissionsModal
              form={form}
              inputs={inputs}
              setPrevSubmissionsModalShowing={setPrevSubmissionsModalShowing}
              prevSubmissions={prevSubmissions}
            />
          ) : (
            false
          )}
        </div>
        {view === "form" && (
          <FormCreator
            creatorInfo={{
              profile_picture: form?.created_by_profile_picture || "",
              username: form?.created_by_username || "",
              created_at: form?.created_at || "",
            }}
          />
        )}
      </div>
    </main>
  );
};
