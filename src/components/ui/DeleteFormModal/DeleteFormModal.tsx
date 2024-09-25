import { XIcon } from "../icons/XIcon";
import { useEffect, useRef } from "react";
import "./DeleteFormModal.css";

const DeleteFormModal = ({
  setDeleteFormModalShowing,
  handleDeleteClick,
}: {
  setDeleteFormModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteClick: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as HTMLDivElement)) {
        setDeleteFormModalShowing(false);
      }
    }

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <div className="delete-modal" ref={modalRef}>
        <div className="header">
          <h1>Delete Form?</h1>
          <button
            onClick={(e) => {
              e.preventDefault();
              setDeleteFormModalShowing(false);
            }}
          >
            <XIcon />
          </button>
        </div>
        <div className="content">
          <p>This can't be undone</p>
        </div>
        <div className="controls">
          <button
            onClick={() => {
              setDeleteFormModalShowing(false);
            }}
          >
            Cancel
          </button>
          <button
            className="delete"
            onClick={() => {
              handleDeleteClick();
              setDeleteFormModalShowing(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="delete-modal-overlay"></div>
    </>
  );
};
export default DeleteFormModal;
