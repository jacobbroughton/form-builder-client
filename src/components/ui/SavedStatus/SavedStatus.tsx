import "./SavedStatus.css";

export function SavedStatus({
  saved,
  autoSaveCountdown,
}: {
  saved: boolean;
  autoSaveCountdown?: number;
}) {
  return (
    <p className="saved-status">
      <span className={`${saved ? "saved" : ""}`}></span>
      {saved ? "Saved" : "Unsaved"}{" "}
      {!saved &&
        autoSaveCountdown !== undefined &&
        `(Autosaving in ${autoSaveCountdown}s)`}
    </p>
  );
}
