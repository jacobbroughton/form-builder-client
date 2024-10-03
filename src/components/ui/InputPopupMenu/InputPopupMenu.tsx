import { useEffect, useRef } from "react";
import { AddedInputType } from "../../../lib/types";
import { CheckIcon } from "../icons/CheckIcon";
import { EditIcon } from "../icons/EditIcon";
import { TrashIcon } from "../icons/TrashIcon";
import "./InputPopupMenu.css";
import EyeSlashIcon from "../icons/EyeSlashIcon";
import EyeIcon from "../icons/EyeIcon";
import { useDeleteInput } from "../../../hooks/useDeleteInput";

export const InputPopupMenu = ({
  input,
  setIdForInputPopup,
  setInputPopupToggled,
  handleChangeDraftInputEnabledStatus,
  handleDeleteClick,
}: {
  input: AddedInputType;
  setIdForInputPopup: React.Dispatch<React.SetStateAction<string | null>>;
  setInputPopupToggled: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeDraftInputEnabledStatus: () => Promise<void>;
  handleDeleteClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { deleteInput } = useDeleteInput();

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
      <button type="button">
        <EditIcon /> Edit
      </button>
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
};
