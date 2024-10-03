import { XIcon } from "../icons/XIcon";
import { useEffect, useRef } from "react";
import "./DeleteModal.css";

const DeleteModal = ({
  label = "",
  setDeleteModalShowing,
  handleDeleteClick,
}: {
  label: string;
  setDeleteModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteClick: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as HTMLDivElement)) {
        setDeleteModalShowing(false);
      }
    }

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <div className="delete-modal" ref={modalRef}>
        <div className="header">
          <h1>{label || "Delete?"}</h1>
          <button
            onClick={(e) => {
              e.preventDefault();
              setDeleteModalShowing(false);
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
              setDeleteModalShowing(false);
            }}
          >
            Cancel
          </button>
          <button
            className="delete"
            onClick={() => {
              handleDeleteClick();
              setDeleteModalShowing(false);
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
export default DeleteModal;
