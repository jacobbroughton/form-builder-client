import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../providers/UserContextProvider";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import "./NoPromptsMessage.css";
import { PlusIcon } from "../icons/PlusIcon";

export const NoPromptsMessage = ({
  formId,
  isDraft,
  handleClick,
}: {
  formId: string;
  isDraft: boolean;
  handleClick: () => void;
}) => {
  const userContext = useContext(UserContext);

  return (
    <button className="no-prompts-message" onClick={handleClick}>
      <div className="icon-container">
        <PlusIcon />
      </div>
      <div className="content">
        {/* <EmotionlessFace /> */}

        <p className="small-text bold">This form doesn't have any prompts...</p>
        <p className="small-text">
          <i>Click to add one</i>
        </p>
      </div>
      {userContext.user?.isAdmin ? (
        <Link
          to={isDraft ? `/edit-draft-form/${formId}` : `/edit-published-form/${formId}`}
        >
          Add a prompt <ArrowRightIcon />
        </Link>
      ) : (
        false
      )}
    </button>
  );
};
