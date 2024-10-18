import { useContext, useEffect, useState } from "react";
import { AllFormsType, SortOptionType } from "../../../lib/types";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { FormsGrid } from "../FormsGrid/FormsGrid";
import { FormsList } from "../FormsList/FormsList";
import { GridIcon } from "../icons/GridIcon";
import { ListIcon } from "../icons/ListIcon";
import { SortIcon } from "../icons/SortIcon";
import { NoFormsMessage } from "../NoFormsMessage/NoFormsMessage";
import { SortFormsMenu } from "../SortFormsMenu/SortFormsMenu";
import "./FormsContainer.css";

export function FormsContainer({
  label,
  forms,
  setSort,
  loading
}: {
  label: string;
  forms: AllFormsType[];
  setSort: React.Dispatch<
    React.SetStateAction<SortOptionType>
  >;
  loading: boolean;
}) {
  const [sortMenuToggled, setSortMenuToggled] = useState<boolean>(false);
  const [toggledView, setToggledView] = useState<string>(
    localStorage.getItem("formBuilderToggledView") || "grid"
  );

  const [selectedSort, setSelectedSort] = useState<SortOptionType>({
    id: 3,
    name: "Date: New-Old",
    value: "date-new-old",
  });
  // const [forms, setForms] = useState<AllFormsType[]>([]);

  // const [loading, setLoading] = useState<boolean>(true);

  // const { setError } = useContext(ErrorContext);
  // const { user } = useContext(UserContext);

  // async function getForms() {
  //   try {
  //     setLoading(true);

  //     const fetchedForms = await getFormsFunc({
  //       sort: selectedSort.value,
  //     });

  //     setForms(fetchedForms);

  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);

  //     handleCatchError(error, setError, null);
  //   }
  // }

  // useEffect(() => {
  //   if (user) {
  //     getForms();
  //   }
  // }, [label, selectedSort, user]);

  return loading ? (
    <div className="forms-loading-container">
      <p className="small-text text-subtle">&nbsp;</p>
      {[...new Array(3)].map((i) => (
        <div className="skeleton">&nbsp;</div>
      ))}
    </div>
  ) : (
    <div>
      <div className="forms-container">
        <section className="header">
          <p className="small-text text-subtle">
            {label} (Sorted by {selectedSort.name.toLowerCase()})
          </p>
          <div className="controls">
            <div className="button-container">
              <button
                className="view-toggle-button"
                disabled={forms.length == 0}
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
                  setSelectedSort={setSort}
                />
              )}
            </div>
          </div>
        </section>
        {forms.length ? (
          toggledView === "grid" ? (
            <FormsGrid forms={forms} />
          ) : (
            <FormsList forms={forms} />
          )
        ) : (
          <NoFormsMessage labelForSwitch={label} />
        )}
      </div>
    </div>
  );
}
