import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { EditIcon } from "../icons/EditIcon";
import { TrashIcon } from "../icons/TrashIcon";
import "./FormPopupMenu.css";

export const FormPopupMenu = ({
  formId,
  isDraft,
  setFormPopupToggled,
  handleFormDelete,
}: {
  formId: string;
  isDraft: boolean;
  setFormPopupToggled: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormDelete: () => Promise<void>;
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as HTMLDivElement)) {
        setFormPopupToggled(false);
      }
    }

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  });

  return (
    <div ref={ref} className="form-popup-menu">
      <Link
        className="edit-link"
        to={isDraft ? `/edit-draft-form/${formId}` : `/edit-published-form/${formId}`}
      >
        <EditIcon /> Edit
      </Link>

      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setFormPopupToggled(false);
          handleFormDelete();
        }}
        type="button"
      >
        <TrashIcon /> Delete
      </button>
    </div>
  );
};
