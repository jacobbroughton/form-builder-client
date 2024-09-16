import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  handleFormDelete: () => void;
}): JSX.Element => {
  const navigate = useNavigate();
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
      <button
        type="button"
        onClick={() =>
          navigate(
            isDraft ? `/edit-draft-form/${formId}` : `/edit-published-form/${formId}`
          )
        }
      >
        <EditIcon /> Edit
      </button>
      <button
        onClick={() => {
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

