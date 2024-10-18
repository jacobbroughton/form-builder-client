import { PrevSubmissionType } from "../../../lib/types";
export function SubmitMessage({
  canResubmitForm,
  submitCooldownCountdown,
  prevSubmissions,
}: {
  canResubmitForm: boolean;
  submitCooldownCountdown: number;
  prevSubmissions: PrevSubmissionType[];
}) {
  return canResubmitForm ? (
    <p className="small-text">
      You can submit again in{" "}
      <i>
        <strong>{submitCooldownCountdown}</strong>
      </i>{" "}
      seconds
    </p>
  ) : (
    <p className="small-text">
      Form submitted on{" "}
      {new Date(
        prevSubmissions[prevSubmissions.length - 1]?.created_at
      ).toLocaleDateString()}
    </p>
  );
}
