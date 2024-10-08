import ClockRotateLeft from "../icons/ClockRotateLeft";

const PreviousSubmissionsButton = ({
  prevSubmissions,
  setPrevSubmissionsModalShowing,
}) => {
  return (
    <button
      className="previous-submission-info"
      onClick={(e) => {
        e.stopPropagation();
        setPrevSubmissionsModalShowing(true);
      }}
    >
      <div className="icon-container">
        <ClockRotateLeft />
      </div>
      <div className="content">
        <p className="small-text">
          You last submitted this form on{" "}
          {new Date(
            prevSubmissions[prevSubmissions.length - 1].created_at
          ).toLocaleDateString()}{" "}
          at{" "}
          {new Date(
            prevSubmissions[prevSubmissions.length - 1].created_at
          ).toLocaleTimeString()}
        </p>
        <p>
          <i>Click to view {prevSubmissions.length} previous submissions</i>
        </p>
      </div>
    </button>
  );
};
export default PreviousSubmissionsButton;
