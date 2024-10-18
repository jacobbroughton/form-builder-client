import { useState } from "react";
import { useGetAnsweredForms } from "../../../hooks/useAnsweredForms";
import { useGetMyForms } from "../../../hooks/useMyForms";
import { useGetPublicForms } from "../../../hooks/usePublicforms";
import { useRecentFormViews } from "../../../hooks/useRecentFormViews";
import { FormsContainer } from "../../ui/FormsContainer/FormsContainer";
import { RecentFormsContainer } from "../../ui/RecentFormsContainer/RecentFormsContainer";
import "./Dashboard.css";
import { CircleIcon } from "../../ui/icons/CircleIcon";
import { FilledCircleIcon } from "../../ui/icons/FilledCircleIcon";

export function Dashboard() {
  const {
    forms: myForms,
    setSelectedSort: setSelectedSortGetMyForms,
    loading: myFormsLoading,
  } = useGetMyForms();
  const {
    forms: publicForms,
    setSelectedSort: setSelectedSortGetPublicForms,
    loading: publicFormsLoading,
  } = useGetPublicForms();
  const {
    forms: answeredForms,
    setSelectedSort: setSelectedSortGetAnsweredForms,
    loading: answeredFormsLoading,
  } = useGetAnsweredForms();
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
          {recentFormViews.length >= 1 && (
            <div className="mobile-recents-list-container">
              <RecentFormsContainer recentFormViews={recentFormViews} />
            </div>
          )}
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
              forms={publicForms}
              setSort={setSelectedSortGetPublicForms}
              loading={publicFormsLoading}
            />
          ) : selectedFormType.id === 2 ? (
            <FormsContainer
              label="My Forms"
              forms={myForms}
              setSort={setSelectedSortGetMyForms}
              loading={myFormsLoading}
            />
          ) : selectedFormType.id === 3 ? (
            <FormsContainer
              label="Answered Forms"
              forms={answeredForms}
              setSort={setSelectedSortGetAnsweredForms}
              loading={answeredFormsLoading}
            />
          ) : (
            false
          )}
        </div>
      </main>
    </div>
  );
}
