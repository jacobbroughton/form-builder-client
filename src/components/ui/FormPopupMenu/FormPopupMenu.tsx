import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AllFormsType } from "../../../lib/types";
import { UserContext } from "../../../providers/UserContextProvider";
import { EditIcon } from "../icons/EditIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { TrashIcon } from "../icons/TrashIcon";
import "./FormPopupMenu.css";
import { copyUrlToClipboard, handleCatchError } from "../../../utils/usefulFunctions";
import { usePublish } from "../../../hooks/usePublish";
import { ErrorContext } from "../../../providers/ErrorContextProvider";

export function FormPopupMenu ({
  form,
  isDraft,
  setFormPopupToggled,
  handleDeleteClick,
}: {
  form: AllFormsType;
  isDraft: boolean;
  setFormPopupToggled: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteClick: () => void;
}): JSX.Element  {
  const ref = useRef<HTMLDivElement>(null);
  const { publish } = usePublish();
  const { user } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sharedTextShowing, setSharedTextShowing] = useState(false);

  function handleShare() {
    copyUrlToClipboard(location);
    setSharedTextShowing(true);

    setTimeout(() => {
      setSharedTextShowing(false);
    }, 3000);
  }

  async function handlePublishForm() {
    try {
      if (!form) throw new Error("No draft form found when trying to delete");

      if (!form.id) throw new Error("No form id provided");

      const data = await publish({
        draftFormId: form.id,
      });

      navigate(`/form/${data[0].id}`);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

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
      <button type="button" onClick={handleShare} disabled={sharedTextShowing}>
        <ShareIcon /> {sharedTextShowing ? "Copied to clipboard" : "Share"}
      </button>
      {isDraft && (
        <button type="button" onClick={() => handlePublishForm()}>
          <ShareIcon /> Publish
        </button>
      )}
    </div>
  );
};
