import { XIcon } from "../icons/XIcon";
import { useEffect, useRef } from "react";
import "./PrevSubmissionsModal.css";

const PrevSubmissionsModal = ({
  setPrevSubmissionsModalShowing,
  prevSubmissions = [],
}: {
  setPrevSubmissionsModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
  prevSubmissions: [];
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          <h1>Your Previous Submissions</h1>
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
              <li>
                <button type="button">View Answers</button>
              </li>
            ))}
          </ul>
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
      <div className="delete-modal-overlay"></div>
    </>
  );
};
export default PrevSubmissionsModal;
