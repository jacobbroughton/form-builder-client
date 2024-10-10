import { useContext, useState } from "react";
import { FormContext } from "../../../providers/FormProvider";
import "./ResponsesContainer.css";
import CircleIcon from "../icons/CircleIcon";
import FilledCircleIcon from "../icons/FilledCircleIcon";
import FormGroupContainer from "../FormGroupContainer/FormGroupContainer";

const ResponsesContainer = () => {
  const {
    form: { num_responses },
    responses,
    loading,
  } = useContext(FormContext);
  const [selectedSubmission, setSelectedSubmission] = useState(
    responses.shallowSubmissionsList?.[0] || null
  );

  return (
    <div className="responses-container">
      {loading && <p>Responses loading...</p>}
      {!responses.shallowSubmissionsList && !responses.submissionsWithInfo && (
        <p className="small-text">No responses found</p>
      )}
      {(responses.shallowSubmissionsList || responses.submissionsWithInfo) && (
        <div className="row">
          <div className="users-list-container">
            <p className="small-text bold">
              Responses <i>({num_responses})</i>
            </p>
            <ul className="users-list">
              {responses.shallowSubmissionsList.map((submissionChoice) => (
                <li
                  className={`${
                    selectedSubmission.id === submissionChoice.id ? "selected" : ""
                  }`}
                >
                  <button
                    onClick={() => setSelectedSubmission(submissionChoice)}
                    title={submissionChoice.username || submissionChoice.email}
                  >
                    {selectedSubmission.id === submissionChoice.id ? (
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
            {responses.submissionsWithInfo[selectedSubmission.id].inputs?.map(
              (inputInfo) => (
                <li className="input-container">
                  <FormGroupContainer
                    label={inputInfo.metadata_question}
                    description={inputInfo.metadata_description}
                    disabled={true}
                    isRequired={inputInfo.is_required}
                    type={inputInfo.input_type_name}
                    inputValue={inputInfo.value}
                  />
                </li>
                // <li className="input-container">
                //   <div className="prompt-section">
                //     <label>Question:</label>
                //     <p className="small-text">{inputInfo.metadata_question}</p>
                //   </div>
                //   {inputInfo.metadata_description && (
                //     <div className="prompt-section">
                //       <label>Question Description:</label>
                //       <p className="small-text">{inputInfo.metadata_description}</p>
                //     </div>
                //   )}
                //   <div className="prompt-section">
                //     <label>User's Answer:</label>
                //     <p className="small-text">
                //       <i>"{inputInfo.value}"</i>
                //     </p>
                //   </div>
                // </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
export default ResponsesContainer;
