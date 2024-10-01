import { useContext, useEffect, useState } from "react";
import FormsGrid from "../FormsGrid/FormsGrid";
import FormsList from "../FormsList/FormsList";
import SortIcon from "../icons/SortIcon";
import NoFormsMessage from "../NoFormsMessage/NoFormsMessage";
import { AllFormsType, SortOptionType } from "../../../lib/types";
import "./FormsContainer.css";
import SortFormsMenu from "../SortFormsMenu/SortFormsMenu";
import GridIcon from "../icons/GridIcon";
import ListIcon from "../icons/ListIcon";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { usegetMyForms } from "../../../hooks/usegetMyForms";

const FormsContainer = ({
  label,
  getFormsFunc,
}: {
  label: string;
  getFormsFunc: ({ sort }: { sort: string }) => Promise<AllFormsType[]>;
}) => {
  const [sortMenuToggled, setSortMenuToggled] = useState<boolean>(false);
  const [toggledView, setToggledView] = useState<string>(
    localStorage.getItem("formBuilderToggledView") || "grid"
  );

  const [selectedSort, setSelectedSort] = useState<SortOptionType>({
    id: 3,
    name: "Date: New-Old",
    value: "date-new-old",
  });
  const [forms, setForms] = useState<AllFormsType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const { setError } = useContext(ErrorContext);
  const { user } = useContext(UserContext);

  async function getForms() {
    try {
      setLoading(true);

      const fetchedForms = await getFormsFunc({
        sort: selectedSort.value,
      });

      setForms(fetchedForms);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    if (user) {
      getForms();
    }
  }, [selectedSort, user]);

  return (
    // loading ? (
    //   <p>Loading...</p>
    // ) : (
    <div>
      <div className="forms-container">
        <section className="header">
          <p className="small-text">
            {label} (Sorted by {selectedSort.name.toLowerCase()})
          </p>
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
    </div>
  );
};
export default FormsContainer;
