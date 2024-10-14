import { useContext } from "react";
import { FormContext } from "../../../providers/FormProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { PlusIcon } from "../icons/PlusIcon";
import "./NoPromptsMessage.css";

export const NoPromptsMessage = ({
  isDraft,
  handleClick,
}: {
  isDraft: boolean;
  handleClick: () => void;
}) => {
  const { user } = useContext(UserContext);
  const { form } = useContext(FormContext);

  const isFormAdmin = form?.created_by_id == user?.id;

  return isDraft || isFormAdmin ? (
    <button className="no-prompts-message" onClick={handleClick}>
      <div className="icon-container">
        <PlusIcon />
      </div>
      <div className="content">
        <p className="small-text bold">
          This form doesn't have any prompts.
        </p>
        <p><i>Click to add one</i></p>
      </div>
    </button>
  ) : (
    <p className="small-text">This form doesn't have any prompts</p>
  );
};
