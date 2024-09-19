import { Link } from "react-router-dom";
import { EmotionlessFace } from "../icons/EmotionlessFace";
import "./NoPromptsMessage.css";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import { useContext } from "react";
import { UserContext } from "../../../UserContextProvider";

export const NoPromptsMessage = ({
  formId,
  isDraft,
}: {
  formId: string;
  isDraft: boolean;
}) => {

  const userContext = useContext(UserContext)

  return (
    <div className="no-prompts-message">
      <div className="top-section">
        <EmotionlessFace />
        <p>Hmm... This form appears to not have any prompts...</p>
      </div>
      {userContext.user?.isAdmin ? <Link
        to={isDraft ? `/edit-draft-form/${formId}` : `/edit-published-form/${formId}`}
      >
        Add a prompt <ArrowRightIcon />
      </Link> : false}
    </div>
  );
};
