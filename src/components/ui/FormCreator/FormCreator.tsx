import "./FormCreator.css";
import { elapseTime } from "../../../utils/usefulFunctions";

export function FormCreator({
  creatorInfo,
}: {
  creatorInfo: {
    profile_picture: string;
    username: string;
    created_at: string;
  };
}) {
  return (
    <div className="form-creator-container">
      <div className="profile-picture-container">
        <img src={creatorInfo?.profile_picture} />
      </div>
      <p className="small-text bold">@{creatorInfo?.username} </p>
      <p className="tiny-text">
        {new Date(creatorInfo?.created_at as string).toLocaleDateString()} |{" "}
        {elapseTime(creatorInfo?.created_at || "")} ago
      </p>
    </div>
  );
}
