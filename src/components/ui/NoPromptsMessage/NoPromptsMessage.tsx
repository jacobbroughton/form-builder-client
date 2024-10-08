import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../providers/UserContextProvider";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import { PlusIcon } from "../icons/PlusIcon";
import "./NoPromptsMessage.css";

export const NoPromptsMessage = ({
  formId,
  isDraft,
  handleClick,
  isFormAdmin,
}: {
  formId: string;
  isDraft: boolean;
  handleClick: () => void;
  isFormAdmin: boolean;
}) => {
  const userContext = useContext(UserContext);

  return isDraft || isFormAdmin ? (
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
      {isFormAdmin && (
        <Link
          to={isDraft ? `/edit-draft-form/${formId}` : `/edit-published-form/${formId}`}
        >
          Add a prompt <ArrowRightIcon />
        </Link>
      )}
    </button>
  ) : (
    <p className="small-text">This form doesn't have any prompts</p>
  );
};
