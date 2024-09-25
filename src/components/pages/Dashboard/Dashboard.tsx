import { useContext, useEffect, useState } from "react";
import { useGetAllForms } from "../../../hooks/useGetAllForms";
import { AllFormsType, SortOptionType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import FormsGrid from "../../ui/FormsGrid/FormsGrid";
import FormsList from "../../ui/FormsList/FormsList";
import GridIcon from "../../ui/icons/GridIcon";
import ListIcon from "../../ui/icons/ListIcon";
import SortIcon from "../../ui/icons/SortIcon";
import NoFormsMessage from "../../ui/NoFormsMessage/NoFormsMessage";
import SortFormsMenu from "../../ui/SortFormsMenu/SortFormsMenu";
import "./Dashboard.css";

export const Dashboard = () => {
  const { getAllForms } = useGetAllForms();
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
  const { user } = useContext(UserContext);

  async function getForms() {
    try {
      setLoading(true);

      const data = await getAllForms({
        sort: selectedSort.value,
      });

      setForms(data);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    if (user) {
      console.log(user);
      getForms();
    }
  }, [selectedSort]);

  return (
    <main className="forms">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="forms-container">
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
                  disabled={forms.length == 0}
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
