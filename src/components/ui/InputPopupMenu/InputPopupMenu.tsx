import { useEffect, useRef } from "react";
import "./InputPopupMenu.css";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";

const InputPopupMenu = ({ setIdForInputPopup, setInputPopupToggled }): JSX.Element => {
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      console.log(e.target);
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
      <button>
        <EditIcon /> Edit
      </button>
      <button>
        <TrashIcon /> Delete
      </button>
    </div>
  );
};
export default InputPopupMenu;
