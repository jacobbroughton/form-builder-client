import { useState } from "react";
import { useGetAnsweredForms } from "../../../hooks/useGetAnsweredForms";
import { useGetMyForms } from "../../../hooks/useGetMyForms";
import { useGetPublicForms } from "../../../hooks/useGetPublicForms";
import { useRecentFormViews } from "../../../hooks/useRecentFormViews";
import FormsContainer from "../../ui/FormsContainer/FormsContainer";
import RecentFormsContainer from "../../ui/RecentFormsContainer/RecentFormsContainer";
import "./Dashboard.css";
import CircleIcon from "../../ui/icons/CircleIcon";
import FilledCircleIcon from "../../ui/icons/FilledCircleIcon";

export const Dashboard = () => {
  const { getMyForms } = useGetMyForms();
  const { getPublicForms } = useGetPublicForms();
  const { getAnsweredForms } = useGetAnsweredForms();
  const { recentFormViews } = useRecentFormViews();

  const formTypes = [
    {
      id: 1,
      label: "Public Forms",
      value: "public",
    },
    {
      id: 2,
      label: "My Forms",
      value: "created-by-me",
    },
    {
      id: 3,
      label: "Answered Forms",
      value: "answered",
    },
  ];

  const [selectedFormType, setSelectedFormType] = useState(formTypes[1]);

  return (
    <div className="forms">
      <aside>
        <RecentFormsContainer recentFormViews={recentFormViews} />
      </aside>
      <main>
        <div className="container">
          <div className="mobile-recents-list-container">
            <RecentFormsContainer recentFormViews={recentFormViews} />
          </div>
          <div className="forms-selector">
            {formTypes.map((formType) => (
              <button
                className={`${selectedFormType.id === formType.id ? "selected" : ""}`}
                key={formType.id}
                onClick={() => setSelectedFormType(formType)}
              >
                {selectedFormType.id === formType.id ? (
                  <FilledCircleIcon />
                ) : (
                  <CircleIcon />
                )}{" "}
                {formType.label}
              </button>
            ))}
          </div>
          {selectedFormType.id === 1 ? (
            <FormsContainer
              label="Unanswered Public Forms"
              getFormsFunc={getPublicForms}
            />
          ) : selectedFormType.id === 2 ? (
            <FormsContainer label="My Forms" getFormsFunc={getMyForms} />
          ) : selectedFormType.id === 3 ? (
            <FormsContainer label="Answered Forms" getFormsFunc={getAnsweredForms} />
          ) : (
            false
          )}
        </div>
      </main>
    </div>
  );
};
