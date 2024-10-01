import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../providers/UserContextProvider";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import "./NoPromptsMessage.css";
import { PlusIcon } from "../icons/PlusIcon";
import { IsFormAdminContext } from "../../../providers/IsFormAdminProvider";

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
  const isFormAdmin = useContext(IsFormAdminContext);

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
  ) : (
    <p>This form doesn't have any prompts</p>
  );
};
