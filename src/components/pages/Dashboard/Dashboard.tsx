import { Link } from "react-router-dom";
import { useGetAnsweredForms } from "../../../hooks/useGetAnsweredForms";
import { useGetMyForms } from "../../../hooks/useGetMyForms";
import { useGetPublicForms } from "../../../hooks/useGetPublicForms";
import { useRecentFormViews } from "../../../hooks/useRecentFormViews";
import FormsContainer from "../../ui/FormsContainer/FormsContainer";
import "./Dashboard.css";

export const Dashboard = () => {
  const { getMyForms } = useGetMyForms();
  const { getPublicForms } = useGetPublicForms();
  const { getAnsweredForms } = useGetAnsweredForms();
  const { recentFormViews } = useRecentFormViews();

  return (
    <main className="forms">
      <aside>
        <div className="recents-container">
          <p className="small-text bold">Recents</p>
          {recentFormViews.length > 0 ? (
            <ul className="recents-list">
              {recentFormViews.map((item, i) => (
                <li>
                  <Link to="/">
                    <div className="profile-picture-container">
                      <img src={item.profile_picture} />
                    </div>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small-text">...</p>
          )}
        </div>
      </aside>
      <div className="container">
        <FormsContainer label="Public Forms" getFormsFunc={getPublicForms} />
        <FormsContainer label="My Forms" getFormsFunc={getMyForms} />
        <FormsContainer label="Answered Forms" getFormsFunc={getAnsweredForms} />
      </div>
    </main>
  );
};
