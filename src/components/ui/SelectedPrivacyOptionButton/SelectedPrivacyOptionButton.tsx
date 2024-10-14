import { EditIcon } from "../icons/EditIcon";
import "./SelectedPrivacyOptionButton.css";

const SelectedPrivacyOptionButton = ({ handleClick, selectedPrivacyOption }) => {
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
};
export default SelectedPrivacyOptionButton;
