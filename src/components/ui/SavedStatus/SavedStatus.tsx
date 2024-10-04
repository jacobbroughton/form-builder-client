import "./SavedStatus.css";

const SavedStatus = ({
  saved,
  autoSaveCountdown,
}: {
  saved: boolean;
  autoSaveCountdown?: number;
}) => {
  return (
    <p className="saved-status">
      <span className={`${saved ? "saved" : ""}`}></span>
      {saved ? "Saved" : "Unsaved"}{" "}
      {!saved && autoSaveCountdown !== undefined
        ? `(Autosaving in ${autoSaveCountdown}s)`
        : false}
    </p>
  );
};
export default SavedStatus;
