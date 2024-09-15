import { useEffect, useRef } from "react";
import "./InputPopupMenu.css";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";
import CheckIcon from "../icons/CheckIcon";
import { AddedInputType } from "../../../lib/types";

const InputPopupMenu = ({
  input,
  setIdForInputPopup,
  setInputPopupToggled,
  handleChangeDraftInputEnabledStatus,
}: {
  input: AddedInputType;
  setIdForInputPopup: React.Dispatch<React.SetStateAction<string | null>>;
  setInputPopupToggled: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeDraftInputEnabledStatus: () => void;
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: React.MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as HTMLDivElement)) {
        setIdForInputPopup(null);
        setInputPopupToggled(false);
      }
    }

    document.addEventListener("click", () => handler);

    return () => document.removeEventListener("click", () => handler);
  });

  return (
    <div ref={ref} className="input-popup-menu">
      <button type="button">
        <EditIcon /> Edit
      </button>
      {input.is_active ? (
        <button
          onClick={() => {
            setInputPopupToggled(false);
            setIdForInputPopup(null);
            handleChangeDraftInputEnabledStatus();
          }}
          type="button"
        >
          <TrashIcon /> Delete
        </button>
      ) : (
        <button
          onClick={() => {
            setInputPopupToggled(false);
            setIdForInputPopup(null);
            handleChangeDraftInputEnabledStatus();
          }}
          type="button"
        >
          <CheckIcon /> Enable
        </button>
      )}
    </div>
  );
};
export default InputPopupMenu;
