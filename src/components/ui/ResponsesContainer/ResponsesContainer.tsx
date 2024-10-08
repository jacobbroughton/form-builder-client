import { useContext, useState } from "react";
import { FormContext } from "../../../providers/FormProvider";
import "./ResponsesContainer.css";

const ResponsesContainer = () => {
  const { responses } = useContext(FormContext);
  const [selectedSubmission, setSelectedSubmission] = useState(
    responses.shallowSubmissionsList[0]
  );

  return (
    <div className="responses-container">
      <h3>Responses</h3>
      <div className="row">
        <ul className="users-list">
          {responses.shallowSubmissionsList.map((submissionChoice) => (
            <li
              className={`${
                selectedSubmission.id === submissionChoice.id ? "selected" : ""
              }`}
            >
              <button
                onClick={() => setSelectedSubmission(submissionChoice)}
                style={{
                  ...(selectedSubmission.id === submissionChoice.id && {
                    textDecoration: "underline",
                  }),
                }}
              >
                {submissionChoice.username || submissionChoice.email}{" "}
              </button>
            </li>
          ))}
        </ul>
        <ul className="responses-list">
          {responses.submissionsWithInfo[selectedSubmission.id].inputs.map(
            (inputInfo) => (
              <li className="input-container">
                <div className="prompt-section">
                  <label>Question:</label>
                  <p className='small-text'>{inputInfo.metadata_question}</p>
                </div>
                {inputInfo.metadata_description && (
                  <div className="prompt-section">
                    <label>Question Description:</label>
                    <p className='small-text'>{inputInfo.metadata_description}</p>
                  </div>
                )}
                <div className="prompt-section">
                  <label>User's Answer:</label>
                  <p className='small-text'>
                    <i>"{inputInfo.value}"</i>
                  </p>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};
export default ResponsesContainer;
