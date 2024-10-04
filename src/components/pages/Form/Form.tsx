import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useGetPrevFormSubmission } from "../../../hooks/useGetPrevFormSubmission.ts";
import { useSubmitForm } from "../../../hooks/useSubmitInputs";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { FormContext } from "../../../providers/FormProvider.tsx";
import { UserContext } from "../../../providers/UserContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import DeleteModal from "../../ui/DeleteModal/DeleteModal.tsx";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { FormInput } from "../../ui/FormInput/FormInput";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import NoUserMessage from "../../ui/NoUserMessage/NoUserMessage";
import { CheckIcon } from "../../ui/icons/CheckIcon";
import ClockRotateLeft from "../../ui/icons/ClockRotateLeft.tsx";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import "./Form.css";
import { useGetInputSubmissions } from "../../../hooks/useGetInputSubmissions.ts";
import PrevSubmissionsModal from "../../ui/PrevSubmissionsModal/PrevSubmissionsModal.tsx";
import PasscodeCover from "../../ui/PasscodeCover/PasscodeCover.tsx";

export const Form = () => {
  const { deletePublishedForm } = useDeletePublishedForm();
  const { submitForm } = useSubmitForm();
  const { getPrevFormSubmissions, loading: prevFormSubmissionsLoading } =
    useGetPrevFormSubmission();
  const { getInputSubmissions, loading: inputSubmissionsLoading } =
    useGetInputSubmissions();
  const { formId } = useParams();
  const { user } = useContext(UserContext);
  const { form, needsPasskeyValidation, formLoading, inputs, setInputs } =
    useContext(FormContext);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const [DeleteModalShowing, setDeleteModalShowing] = useState<boolean>(false);
  const [prevSubmissionsModalShowing, setPrevSubmissionsModalShowing] =
    useState<boolean>(false);
  const [prevSubmissions, setPrevSubmissions] = useState([]);
  const [latestInputSubmissions, setLatestInputSubmissions] = useState(null);
  const [submitCooldownToggled, setSubmitCooldownToggled] = useState(false);
  const [submitCooldownCountdown, setSubmitCooldownCountdown] = useState(5);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

      const inputSubmissions = await getInputSubmissions({
        submissionId: data.id,
        bypass: false,
      });

      setPrevSubmissions([...prevSubmissions, data]);
      setLatestInputSubmissions(inputSubmissions);

      setSubmitCooldownToggled(true);
      setSubmitCooldownCountdown(5);
      setFormSubmitted(true);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    async function getFormSubmissions(): Promise<void> {
      try {
        const formSubmissions = await getPrevFormSubmissions({ formId: form.id });
        console.log({ formSubmissions });

        // if (formSubmissions[0]) {
        const inputSubmissions = await getInputSubmissions({
          submissionId: formSubmissions[0]?.id,
          bypass: true,
        });
        setLatestInputSubmissions(inputSubmissions);
        console.log("Makes it here");
        setFormSubmitted(formSubmissions[0] ? true : false);
        // }

        setPrevSubmissions(formSubmissions);
      } catch (error) {
        handleCatchError(error, setError, null);
      }
    }
    if (form && user) getFormSubmissions();
  }, [form]);

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

  return (
    <main className="published-form">
      <div className="container">
        {formLoading ? (
          <p>Form loading...</p>
        ) : !form ? (
          <p>No form found</p>
        ) : (
          <>
            <div className="form-controls">
              {isFormCreator && <DraftPublishedTag draftOrPublished={"published"} />}

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
                      setDeleteModalShowing(true);
                    }}
                  />
                ) : (
                  false
                )}
              </div>
            </div>
            {form.can_resubmit && prevSubmissions?.length ? (
              <button
                className="previous-submission-info"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(prevSubmissionsModalShowing);
                  setPrevSubmissionsModalShowing(true);
                }}
              >
                <div className="icon-container">
                  <ClockRotateLeft />
                </div>
                <div className="content">
                  <p className="small-text">
                    You last submitted this form on{" "}
                    {new Date(
                      prevSubmissions[prevSubmissions.length - 1].created_at
                    ).toLocaleDateString()}{" "}
                    at{" "}
                    {new Date(
                      prevSubmissions[prevSubmissions.length - 1].created_at
                    ).toLocaleTimeString()}
                  </p>
                  <p>
                    <i>Click to view {prevSubmissions.length} previous submissions</i>
                  </p>
                </div>
              </button>
            ) : (
              false
            )}
            <div className={`heading ${inputs.length == 0 ? "no-margin-bottom" : ""}`}>
              <h1 className="title">{form.title}</h1>
              {form.description ? (
                <p className="description">{form.description}</p>
              ) : (
                false
              )}
            </div>
            {inputs.length ? (
              <>
                <div className="inputs">
                  {inputs.map((input) => (
                    <FormInput
                      readOnly={
                        (!form.can_resubmit && formSubmitted) ||
                        prevFormSubmissionsLoading // ||
                        // inputSubmissionsLoading
                      }
                      input={input}
                      inputs={inputs}
                      setInputs={setInputs}
                    />
                  ))}
                </div>
                {user ? (
                  submitCooldownToggled ? (
                    form.can_resubmit ? (
                      <p className="small-text">
                        You can submit again in{" "}
                        <i>
                          <strong>{submitCooldownCountdown}</strong>
                        </i>{" "}
                        seconds
                      </p>
                    ) : (
                      <p>
                        Form submitted on{" "}
                        {new Date(
                          prevSubmissions[prevSubmissions.length - 1].created_at
                        ).toLocaleDateString()}
                      </p>
                    )
                  ) : prevSubmissions?.length ? (
                    form.can_resubmit ? (
                      <button
                        className="submit-button"
                        type="button"
                        disabled={inputsUnchanged}
                        onClick={() => {
                          if (inputsUnchanged) return;
                          handleFormSubmit();
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
                      disabled={prevFormSubmissionsLoading || inputSubmissionsLoading}
                      className="submit-button"
                      type="button"
                      onClick={() => handleFormSubmit()}
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
