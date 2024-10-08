const SubmitMessage = ({ canResubmitForm, submitCooldownCountdown, prevSubmissions }) => {
  return canResubmitForm ? (
    <p className="small-text">
      You can submit again in{" "}
      <i>
        <strong>{submitCooldownCountdown}</strong>
      </i>{" "}
      seconds
    </p>
  ) : (
    <p>
      Form submitted on{" "}
      {new Date(
        prevSubmissions[prevSubmissions.length - 1]?.created_at
      ).toLocaleDateString()}
    </p>
  );
};
export default SubmitMessage;
