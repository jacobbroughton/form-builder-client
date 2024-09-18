import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DraftFormType, PublishedFormType } from "../../../lib/types";
import { handleCatchError, timeAgo } from "../../../utils/usefulFunctions";
import "./Forms.css";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import { DraftIcon } from "../../ui/icons/DraftIcon";
import { PlanetIcon } from "../../ui/icons/PlanetIcon";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import {
  deleteDraftForm,
  deletePublishedForm,
  getAllForms,
} from "../../../utils/fetchRequests";
import NoFormsMessage from "../../ui/NoFormsMessage/NoFormsMessage";
import GridIcon from "../../ui/icons/GridIcon";
import SortIcon from "../../ui/icons/SortIcon";
import ListIcon from "../../ui/icons/ListIcon";
import SortFormsMenu from "../../ui/SortFormsMenu/SortFormsMenu";
import FormsGrid from "../../ui/FormsGrid/FormsGrid";
import FormsList from "../../ui/FormsList/FormsList";

interface AllFormsType extends DraftFormType {
  is_draft: boolean;
  relevant_dt: string;
}

export const Forms = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<AllFormsType[]>([]);
  const [sortMenuToggled, setSortMenuToggled] = useState<boolean>(false);
  const [toggledView, setToggledView] = useState<string>(localStorage.getItem('formBuilderToggledView') || "grid");
  const [selectedSort, setSelectedSort] = useState<string>("Created ");

  async function getForms() {
    try {
      setLoading(true);

      const data = await getAllForms({ userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4" });
      setForms(data);

      setLoading(false);
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    getForms();
  }, []);

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
                      localStorage.setItem('formBuilderToggledView', toggledView === "grid" ? "list" : "grid")
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
                    <SortFormsMenu setSortMenuToggled={setSortMenuToggled} />
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
