import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AllFormsType } from "../../../lib/types";
import { UserContext } from "../../../providers/UserContextProvider";
import { EditIcon } from "../icons/EditIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { TrashIcon } from "../icons/TrashIcon";
import "./FormPopupMenu.css";

export const FormPopupMenu = ({
  form,
  isDraft,
  setFormPopupToggled,
  handleDeleteClick,
}: {
  form: AllFormsType;
  isDraft: boolean;
  setFormPopupToggled: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteClick: () => void;
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);

  function handleShare() {}

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
      {user && user.id == form.created_by_id && (
        <>
          <Link
            className="edit-link"
            to={
              isDraft ? `/edit-draft-form/${form.id}` : `/edit-published-form/${form.id}`
            }
          >
            <EditIcon /> Edit
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setFormPopupToggled(false);
              handleDeleteClick();
              // handleFormDelete();
            }}
            type="button"
          >
            <TrashIcon /> Delete
          </button>
        </>
      )}
      <button type="button" onClick={handleShare}>
        <ShareIcon /> Share
      </button>
    </div>
  );
};
