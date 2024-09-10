import { useEffect, useRef } from "react";
import "./InputPopupMenu.css";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";
import CheckIcon from "../icons/CheckIcon";

const InputPopupMenu = ({
  input,
  setIdForInputPopup,
  setInputPopupToggled,
  handleChangeDraftInputEnabledStatus,
}): JSX.Element => {
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
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
        <button onClick={() => handleChangeDraftInputEnabledStatus()} type="button">
          <TrashIcon /> Delete
        </button>
      ) : (
        <button onClick={() => handleChangeDraftInputEnabledStatus()} type="button">
          <CheckIcon /> Enable
        </button>
      )}
    </div>
  );
};
export default InputPopupMenu;
