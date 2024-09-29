import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
import CircleIcon from "../icons/CircleIcon";
import FilledCircleIcon from "../icons/FilledCircleIcon";
import { PrivacyOptionType } from "../../../lib/types";
import "./PrivacyOptions.css";

const PrivacyOptions = ({ privacyOptions, setPrivacyOptions, error, loading }) => {
  function handlePrivacyOptionClick(clickedPrivacyOption: PrivacyOptionType) {
    setPrivacyOptions(
      privacyOptions.map((privacyOption) => ({
        ...privacyOption,
        checked: privacyOption.id == clickedPrivacyOption.id,
      }))
    );
  }

  return (
    <div className="privacy-options">
      <div className="heading">
        <p>Select a privacy option for this form</p>
      </div>

      {error ? (
        <p className="small-text red error">asdf{error}</p>
      ) : loading ? (
        <p className="small-text loading">Privacy Options Loading...</p>
      ) : (
        privacyOptions?.map((privacyOption) => (
          <button onClick={() => handlePrivacyOptionClick(privacyOption)}>
            <div className="radio-container">
              {privacyOption.checked ? <FilledCircleIcon /> : <CircleIcon />}
            </div>
            <div className="content">
              <p>{privacyOption.name}</p>
              <p>{privacyOption.description}</p>
            </div>
          </button>
        ))
      )}
    </div>
  );
};
export default PrivacyOptions;
