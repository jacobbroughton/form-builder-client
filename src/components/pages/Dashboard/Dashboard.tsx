import { useContext, useEffect, useState } from "react";
import { AllFormsType, DraftFormType, SortOptionType } from "../../../lib/types";
import { getAllForms } from "../../../utils/fetchRequests";
import { printError } from "../../../utils/usefulFunctions";
import FormsGrid from "../../ui/FormsGrid/FormsGrid";
import FormsList from "../../ui/FormsList/FormsList";
import GridIcon from "../../ui/icons/GridIcon";
import ListIcon from "../../ui/icons/ListIcon";
import SortIcon from "../../ui/icons/SortIcon";
import NoFormsMessage from "../../ui/NoFormsMessage/NoFormsMessage";
import SortFormsMenu from "../../ui/SortFormsMenu/SortFormsMenu";
import "./Dashboard.css";
import { UserContext } from "../../../providers/UserContextProvider";
import { ErrorContext } from "../../../providers/ErrorContextProvider";

export const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<AllFormsType[]>([]);
  const [sortMenuToggled, setSortMenuToggled] = useState<boolean>(false);
  const [toggledView, setToggledView] = useState<string>(
    localStorage.getItem("formBuilderToggledView") || "grid"
  );
  const [selectedSort, setSelectedSort] = useState<SortOptionType>({
    id: 3,
    name: "Date: New-Old",
    value: "date-new-old",
  });
  const { setError } = useContext(ErrorContext);

  async function getForms() {
    try {
      setLoading(true);

      const data = await getAllForms({
        userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
        sort: selectedSort.value,
      });

      setForms(data);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }

      printError(error);
    }
  }

  useEffect(() => {
    getForms();
  }, [selectedSort]);

  return (
    <main className="forms">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="forms-container">
            {/* <p className="section-heading">Published</p> */}
            <section className="header">
              <p className="small-text">Recent Forms</p>
              <div className="controls">
                <div className="button-container">
                  <button
                    className="view-toggle-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem(
                        "formBuilderToggledView",
                        toggledView === "grid" ? "list" : "grid"
                      );
                      setToggledView(toggledView === "grid" ? "list" : "grid");
                    }}
                  >
                    {toggledView === "grid" ? <GridIcon /> : <ListIcon />}
                  </button>
                </div>
                <div className="button-container">
                  <button
                    className="sort-toggle-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortMenuToggled(!sortMenuToggled);
                    }}
                  >
                    <SortIcon />
                  </button>
                  {sortMenuToggled && (
                    <SortFormsMenu
                      selectedSort={selectedSort}
                      setSortMenuToggled={setSortMenuToggled}
                      setSelectedSort={setSelectedSort}
                    />
                  )}
                </div>
              </div>
            </section>
            {forms.length ? (
              toggledView === "grid" ? (
                <FormsGrid setForms={setForms} forms={forms} />
              ) : (
                <FormsList setForms={setForms} forms={forms} />
              )
            ) : (
              <NoFormsMessage />
            )}
          </div>
        </>
      )}
    </main>
  );
};
