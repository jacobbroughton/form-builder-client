import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
import { CircleIcon } from "../icons/CircleIcon";
import { FilledCircleIcon } from "../icons/FilledCircleIcon";
import { PrivacyOptionType } from "../../../lib/types";
import "./PrivacyOptions.css";

export function PrivacyOptions({
  privacyOptions,
  setPrivacyOptions,
  error,
  loading,
  privacyPasskey,
  setPrivacyPasskey,
}: {
  privacyOptions: PrivacyOptionType[];
  setPrivacyOptions: React.Dispatch<React.SetStateAction<PrivacyOptionType[]>>;
  error: string | null;
  loading: boolean;
  privacyPasskey: string;
  setPrivacyPasskey: React.Dispatch<React.SetStateAction<string>>;
}) {
  function handlePrivacyOptionClick(clickedPrivacyOption: PrivacyOptionType) {
    if (!clickedPrivacyOption.needs_passkey && privacyPasskey !== "")
      setPrivacyPasskey("");
    setPrivacyOptions(
      privacyOptions.map((privacyOption) => ({
        ...privacyOption,
        checked: privacyOption.id == clickedPrivacyOption.id,
      }))
    );
  }

  const selectedOption = privacyOptions?.find((privacyOption) => privacyOption.checked);

  return (
    <>
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
            <button
              onClick={() => handlePrivacyOptionClick(privacyOption)}
              key={privacyOption.id}
              className={`${privacyOption.checked ? "selected" : ""}`}
            >
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
      {selectedOption?.needs_passkey && (
        <div className="passkey-section">
          <div className="heading">
            <p>Enter a passkey *</p>
            <p className="small-text">
              Users will need to fill this out before seeing/filling out the form.
            </p>
            <p className="small-text">
              <i>You'll need to share this with them.</i>
            </p>
          </div>
          <input
            value={privacyPasskey}
            placeholder="Passkey"
            onChange={(e) => setPrivacyPasskey(e.target.value)}
          />
        </div>
      )}
    </>
  );
}
