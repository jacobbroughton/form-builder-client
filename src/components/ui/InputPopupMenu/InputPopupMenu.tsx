import { useEffect, useRef } from "react";
import { InputType } from "../../../lib/types";
import { Link } from "react-router-dom";
import { TrashIcon } from "../icons/TrashIcon";
import { EyeSlashIcon } from "../icons/EyeSlashIcon";
import { EyeIcon } from "../icons/EyeIcon";
import "./InputPopupMenu.css";
import { EditIcon } from "../icons/EditIcon";

export function InputPopupMenu({
  input,
  setIdForInputPopup,
  setInputPopupToggled,
  handleChangeDraftInputEnabledStatus,
  handleDeleteClick,
  isForDraft,
}: {
  input: InputType;
  setIdForInputPopup: React.Dispatch<React.SetStateAction<string | null>>;
  setInputPopupToggled: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeDraftInputEnabledStatus: () => Promise<void>;
  handleDeleteClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isForDraft: boolean;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as HTMLDivElement)) {
        setIdForInputPopup(null);
        setInputPopupToggled(false);
      }
    }

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  });

  return (
    <div ref={ref} className="input-popup-menu">
      <Link to={`/${isForDraft ? "edit-draft-input" : "edit-input"}/${input.id}`}>
        <EditIcon /> Edit
      </Link>
      {input.is_active ? (
        <button
          onClick={() => {
            // setInputPopupToggled(false);
            // setIdForInputPopup(null);
            handleChangeDraftInputEnabledStatus();
          }}
          type="button"
        >
          <EyeSlashIcon /> Disable
        </button>
      ) : (
        <button
          onClick={() => {
            // setInputPopupToggled(false);
            // setIdForInputPopup(null);
            handleChangeDraftInputEnabledStatus();
          }}
          type="button"
        >
          <EyeIcon /> Enable
        </button>
      )}
      <button
        onClick={(e) => {
          setInputPopupToggled(false);
          setIdForInputPopup(null);
          handleDeleteClick(e);
        }}
        type="button"
      >
        <TrashIcon /> Delete
      </button>
    </div>
  );
}
