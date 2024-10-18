import { useContext, useEffect, useState } from "react";
import { FormContext } from "../../../providers/FormProvider";
import "./ResponsesContainer.css";
import { CircleIcon } from "../icons/CircleIcon";
import { FilledCircleIcon } from "../icons/FilledCircleIcon";
import { FormGroupContainer } from "../FormGroupContainer/FormGroupContainer";
import { MultipleChoiceForUser } from "../MultipleChoiceForUser/MultipleChoiceForUser";
import { LinearScaleForUser } from "../LinearScaleForUser/LinearScaleForUser";

// 4827a4cc-8d4b-11ef-b007-a29c91e292c3
// 50dd3bea-8d4b-11ef-80ff-a29c91e292c3

export function ResponsesContainer() {
  const {
    form: { num_responses },
    responses,
    responsesLoading,
  } = useContext(FormContext);

  const [selectedSubmission, setSelectedSubmission] = useState(
    responses.submissionsList?.[0] || null
  );

  useEffect(() => {
    if (responses.submissionsList?.length >= 1)
      setSelectedSubmission(responses.submissionsList[0]);
  }, [responses.submissionsList]);



  return (
    <div className="responses-container">
      {responsesLoading ? (
        <p>Responses loading...</p>
      ) : responses.submissionsList.length == 0 ? (
        <p className="small-text">No responses found</p>
      ) : !selectedSubmission ? (
        <p>No selected submission</p>
      ) : (
        (responses.submissionsList || responses.inputsBySubID) && (
          <div className="row">
            <div className="users-list-container">
              <p className="small-text bold">
                Responses <i>({num_responses})</i>
              </p>
              <ul className="users-list">
                {responses.submissionsList.map((submissionChoice) => (
                  <li
                    key={submissionChoice.id}
                    className={`${
                      selectedSubmission?.id === submissionChoice.id ? "selected" : ""
                    }`}
                  >
                    <button
                      onClick={() => setSelectedSubmission(submissionChoice)}
                      title={submissionChoice.username || submissionChoice.email}
                    >
                      {selectedSubmission?.id === submissionChoice.id ? (
                        <FilledCircleIcon />
                      ) : (
                        <CircleIcon />
                      )}{" "}
                      <p>{submissionChoice.username || submissionChoice.email}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="responses-list">
              {responses.inputsBySubID[selectedSubmission.id]?.map((inputInfo) => (
                <li className="input-container">
                  {inputInfo.input_type_name === "Multiple Choice" ? (
                    <MultipleChoiceForUser
                      question={inputInfo.metadata_question}
                      description={inputInfo.metadata_description}
                      isRequired={inputInfo.is_required}
                      options={inputInfo.options}
                      handleOptionClick={(option) => null}
                      disabled={true}
                    />
                  ) : inputInfo.input_type_name === "Linear Scale" ? (
                    <LinearScaleForUser
                      question={inputInfo.metadata_question}
                      description={inputInfo.metadata_description}
                      isRequired={inputInfo.is_required}
                      minLinearScale={inputInfo.linearScale?.min}
                      maxLinearScale={inputInfo.linearScale?.max}
                      value={inputInfo.linearScale?.existingValue || inputInfo.value}
                      onNumberSelect={(option) => null}
                      disabled={true}
                    />
                  ) : (
                    <FormGroupContainer
                      label={inputInfo.metadata_question}
                      description={inputInfo.metadata_description}
                      disabled={true}
                      isRequired={inputInfo.is_required}
                      type={inputInfo.input_type_name}
                      inputValue={inputInfo.value}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
