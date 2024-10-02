import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { useGetPublishedForm } from "../../../hooks/useGetPublishedForm";
import { useSubmitForm } from "../../../hooks/useSubmitInputs";
import { AddedInputType, PublishedFormType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import DeleteFormModal from "../../ui/DeleteFormModal/DeleteFormModal";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { FormInput } from "../../ui/FormInput/FormInput";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import NoUserMessage from "../../ui/NoUserMessage/NoUserMessage";
import { CheckIcon } from "../../ui/icons/CheckIcon";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import "./Form.css";
import { useGetPrevFormSubmission } from "../../../hooks/useGetPrevFormSubmission.ts";
import ClockRotateLeft from "../../ui/icons/ClockRotateLeft.tsx";
import { FormContext } from "../../../providers/FormProvider.tsx";

export const Form = () => {
  const { deletePublishedForm } = useDeletePublishedForm();
  const { getPublishedForm } = useGetPublishedForm();
  const { submitForm } = useSubmitForm();
  const { getPrevFormSubmissions } = useGetPrevFormSubmission();
  const { formId } = useParams();
  const { user } = useContext(UserContext);
  const { form, formLoading, inputs, setInputs } = useContext(FormContext);
  // const [formLoading, setFormLoading] = useState(true);
  // const [form, setForm] = useState<PublishedFormType | null>(null);
  // const [inputs, setInputs] = useState<AddedInputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const [deleteFormModalShowing, setDeleteFormModalShowing] = useState<boolean>(false);
  const [prevSubmissions, setPrevSubmissions] = useState(null);
  const [latestInputSubmissions, setLatestInputSubmissions] = useState(null);
  const [submitCooldownToggled, setSubmitCooldownToggled] = useState(false);
  const [submitCooldownCountdown, setSubmitCooldownCountdown] = useState(5);

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

  async function handleFormSubmit() {
    try {
      const data = await submitForm({ formId: form.id, inputs });
      console.log("After submitting", data, [...prevSubmissions, data]);

      setPrevSubmissions([...prevSubmissions, data]);

      setSubmitCooldownToggled(true);
      setSubmitCooldownCountdown(5);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    async function getFormSubmissions(): Promise<void> {
      try {
        const submissions = await getPrevFormSubmissions({ formId: form.id });

        console.log({ submissions });

        setPrevSubmissions(submissions.submissions);
        setLatestInputSubmissions(submissions.latestInputSubmissions);
      } catch (error) {
        handleCatchError(error, setError, null);
      }
    }
    if (form) getFormSubmissions();
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

  console.log({ inputs, latestInputSubmissions, inputsUnchanged });

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
              <DraftPublishedTag draftOrPublished={"published"} />

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
                      handleFormDelete();
                      setDeleteFormModalShowing(false);
                    }}
                  />
                ) : (
                  false
                )}
              </div>
            </div>
            {prevSubmissions?.length ? (
              <button className="previous-submission-info">
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
                    <FormInput input={input} inputs={inputs} setInputs={setInputs} />
                  ))}
                </div>
                {user ? (
                  submitCooldownToggled ? (
                    <p className="small-text">
                      You can submit again in{" "}
                      <i>
                        <strong>{submitCooldownCountdown}</strong>
                      </i>{" "}
                      seconds
                    </p>
                  ) : prevSubmissions?.length ? (
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
                    <button
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
