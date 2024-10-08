import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useSubmitForm } from "../../../hooks/useSubmitInputs";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { FormContext } from "../../../providers/FormProvider.tsx";
import { UserContext } from "../../../providers/UserContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import DeleteModal from "../../ui/DeleteModal/DeleteModal.tsx";
import FormHeader from "../../ui/FormHeader/FormHeader.tsx";
import { FormInput } from "../../ui/FormInput/FormInput";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import NoUserMessage from "../../ui/NoUserMessage/NoUserMessage";
import PasscodeCover from "../../ui/PasscodeCover/PasscodeCover.tsx";
import PrevSubmissionsModal from "../../ui/PrevSubmissionsModal/PrevSubmissionsModal.tsx";
import PreviousSubmissionsButton from "../../ui/PreviousSubmissionsButton/PreviousSubmissionsButton.tsx";
import SubmitMessage from "../../ui/SubmitMessage/SubmitMessage.tsx";
import { CheckIcon } from "../../ui/icons/CheckIcon";
import "./Form.css";
import ResponsesContainer from "../../ui/ResponsesContainer/ResponsesContainer.tsx";

export const Form = () => {
  const { deletePublishedForm } = useDeletePublishedForm();
  const { submitForm } = useSubmitForm();
  const { formId } = useParams();
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
  const [submitCooldownToggled, setSubmitCooldownToggled] = useState(false);
  const [submitCooldownCountdown, setSubmitCooldownCountdown] = useState(5);
  const [view, setView] = useState("form");

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

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const data = await submitForm({ formId: form.id, inputs });

      handleSubmissionsOnSubmit(data);

      setSubmitCooldownToggled(true);
      setSubmitCooldownCountdown(5);
      // setFormSubmitted(true);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    const cooldownInterval = setInterval(() => {
      if (submitCooldownCountdown) {
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

  const inputsUnchanged =
    inputs.filter((input) => input.value === latestInputSubmissions?.[input.id].value)
      .length === inputs.length;

  const isFormCreator = form?.created_by_id === user?.id;

  if (!isFormCreator && needsPasskeyValidation) return <PasscodeCover />;

  if (formLoading) return <p>Form loading...</p>;

  if (!form) return <p>No form found...</p>;

  return (
    <main className="published-form">
      <FormHeader
        form={form}
        setDeleteModalShowing={setDeleteModalShowing}
        view={view}
        setView={setView}
      />
      <div className="container">
        {view === "form" ? (
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
                  {inputs.map((input) => (
                    <FormInput
                      readOnly={!form.can_resubmit && formSubmitted}
                      input={input}
                      inputs={inputs}
                      setInputs={setInputs}
                    />
                  ))}
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
                        disabled={inputsUnchanged}
                        onClick={(e) => {
                          if (inputsUnchanged) return;
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
                      disabled={false}
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
                formId={form.id}
                isDraft={false}
                handleClick={() => {
                  navigate(`/edit-published-form/${form.id}/input-types-selector`);
                  // setCurrentView("input-types-selector");
                }}
                isFormAdmin={form.created_by_id == user.id}
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
    </main>
  );
};
