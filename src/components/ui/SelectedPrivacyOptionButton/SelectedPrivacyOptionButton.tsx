import { EditIcon } from "../icons/EditIcon";
import { PrivacyOptionType } from "../../../lib/types";
import "./SelectedPrivacyOptionButton.css";

export function SelectedPrivacyOptionButton({
  handleClick,
  selectedPrivacyOption,
}: {
  handleClick: () => void;
  selectedPrivacyOption: PrivacyOptionType;
}) {
  return (
    <button className="selected-privacy-option-button" onClick={handleClick}>
      <div className="content">
        <p className="small-text bold">{selectedPrivacyOption.name}</p>
        <p className="small-text">
          <i>{selectedPrivacyOption.description}</i>
        </p>
      </div>
      <div className="icon-container">
        <EditIcon />
      </div>
    </button>
  );
}
