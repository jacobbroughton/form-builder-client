import { useGetAnsweredForms } from "../../../hooks/useGetAnsweredForms";
import { useGetMyForms } from "../../../hooks/useGetMyForms";
import { useGetPublicForms } from "../../../hooks/useGetPublicForms";
import { useRecentFormViews } from "../../../hooks/useRecentFormViews";
import FormsContainer from "../../ui/FormsContainer/FormsContainer";
import RecentFormsContainer from "../../ui/RecentFormsContainer/RecentFormsContainer";
import "./Dashboard.css";

export const Dashboard = () => {
  const { getMyForms } = useGetMyForms();
  const { getPublicForms } = useGetPublicForms();
  const { getAnsweredForms } = useGetAnsweredForms();
  const { recentFormViews } = useRecentFormViews();

  return (
    <main className="forms">
      <aside>
        <RecentFormsContainer recentFormViews={recentFormViews} />
      </aside>
      <div className="container">
        <div className="mobile-recents-list-container">
          <RecentFormsContainer recentFormViews={recentFormViews} />
        </div>
        <FormsContainer label="Public Forms" getFormsFunc={getPublicForms} />
        <FormsContainer label="My Forms" getFormsFunc={getMyForms} />
        <FormsContainer label="Answered Forms" getFormsFunc={getAnsweredForms} />
      </div>
    </main>
  );
};
