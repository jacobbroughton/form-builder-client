import { Link } from "react-router-dom";
import { elapseTime } from "../../../utils/usefulFunctions";
import "./RecentFormsContainer.css";

type RecentFormViewType = {
  form_id: string;
  max_created_at: string;
  profile_picture: string;
  title: string;
};

const RecentFormsContainer = ({
  recentFormViews,
}: {
  recentFormViews: RecentFormViewType[];
}) => {
  return (
    <div className="recents-container">
      <p className="small-text bold">Recents</p>
      {recentFormViews.length > 0 ? (
        <ul className="recents-list">
          {recentFormViews.map((formView) => (
            <li>
              <Link to={`/form/${formView.form_id}`}>
                <div className="profile-picture-container">
                  <img src={formView.profile_picture} />
                </div>
                <span className="title">{formView.title}</span>{" "}
                <span className="elapsed-time tiny-text">
                  {elapseTime(formView.max_created_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="small-text">...</p>
      )}
    </div>
  );
};
export default RecentFormsContainer;
