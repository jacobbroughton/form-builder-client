import { useEffect, useRef, useState } from "react";
import { XIcon } from "../icons/XIcon";
import "./PrevSubmissionsModal.css";
import { useGetInputSubmissions } from "../../../hooks/useGetInputSubmissions";
import { InputType, PrevSubmissionType, PublishedFormType } from "../../../lib/types";

const PrevSubmissionsModal = ({
  form,
  inputs = [],
  setPrevSubmissionsModalShowing,
  prevSubmissions,
}: {
  form: PublishedFormType;
  inputs: InputType[];
  setPrevSubmissionsModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
  prevSubmissions: PrevSubmissionType[];
}) => {
  const { getInputSubmissions } = useGetInputSubmissions();
  const modalRef = useRef<HTMLDivElement>(null);
  const [currForm] = useState(form);
  const [currInputs] = useState<InputType[]>(inputs);
  const [selectedSubmission, setSelectedSubmission] = useState(prevSubmissions[0]);
  const [inputSubmissions, setInputSubmissions] = useState(null);

  async function handleSubmissionClick(clickedSubmission: PrevSubmissionType) {
    try {
      const inputs = await getInputSubmissions({
        submissionId: clickedSubmission.id,
        bypass: false,
      });
      console.log(inputs);
      setSelectedSubmission(clickedSubmission);
      setInputSubmissions(inputs);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function getInitialInputSubmissions() {
      try {
        const inputs = await getInputSubmissions({
          submissionId: selectedSubmission.id,
          bypass: false,
        });
        console.log(inputs);
        setInputSubmissions(inputs);
      } catch (error) {
        console.error(error);
      }
    }

    getInitialInputSubmissions();

    function handler(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as HTMLDivElement)) {
        setPrevSubmissionsModalShowing(false);
      }
    }

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <div className="prev-submissions-modal" ref={modalRef}>
        <div className="header">
          <div className="text">
            <h1>Your Previous Submissions</h1>
            <p className="small-text">Click one of the submissions to view answers</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setPrevSubmissionsModalShowing(false);
            }}
          >
            <XIcon />
          </button>
        </div>
        <div className="content">
          <ul className="submissions-list">
            {prevSubmissions.map((prevSubmission) => (
              <li key={prevSubmission.id}>
                <button
                  onClick={() => handleSubmissionClick(prevSubmission)}
                  className={`${
                    selectedSubmission.id == prevSubmission.id ? "selected" : ""
                  }`}
                >
                  <p className="small-text">
                    {new Date(prevSubmission.created_at).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
          <div className="form-mimic">
            <div className="heading">
              <h3>{currForm.title}</h3>
              <p className="small-text">{currForm.description}</p>
            </div>
            <div className="prompts">
              {currInputs.map((input) => (
                <div className="prompt-container">
                  <p className="small-text bold">{input.metadata_question}</p>
                  {input.metadata_description ? (
                    <p className="small-text">{input.metadata_description}</p>
                  ) : (
                    false
                  )}
                  <p className="answer small-text">
                    {inputSubmissions?.[input.id].value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="controls">
          <button
            onClick={() => {
              setPrevSubmissionsModalShowing(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="prev-submissions-modal-overlay"></div>
    </>
  );
};
export default PrevSubmissionsModal;
