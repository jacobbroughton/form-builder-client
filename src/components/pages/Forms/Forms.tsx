import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DraftFormType, PublishedFormType } from "../../../lib/types";
import { handleCatchError, timeAgo } from "../../../utils/usefulFunctions";
import "./Forms.css";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import { DraftIcon } from "../../ui/icons/DraftIcon";
import { PlanetIcon } from "../../ui/icons/PlanetIcon";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";

interface AllFormsType extends DraftFormType {
  is_draft: boolean;
  relevant_dt: string;
}

export const Forms = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<AllFormsType[]>([]);
  const [popupMenuToggled, setPopupMenuToggled] = useState<boolean>(false);
  const [idForPopupMenu, setIdForPopupMenu] = useState<string | null>(null);

  async function getForms() {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3001/form/get-forms/75c75c02-b39b-4f33-b940-49aa20b9eda4`
      );

      if (!response.ok) throw new Error("There was a problem fetching forms");

      const data = await response.json();

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
          <section className="forms-container">
            {/* <p className="section-heading">Published</p> */}
            <div className="form-grid">
              {forms.length ? (
                forms.map((form) => (
                  <Link
                    to={form.is_draft ? `/draft/${form.id}` : `/form/${form.id}`}
                    className="form-grid-item"
                  >
                    <div className="content">
                      <p className="name">{form.title}</p>
                    </div>
                    <div className="controls">
                      <div className="left-side">
                        {form.is_draft ? (
                          <div
                            className="icon-container draft"
                            title="This form is still a draft"
                          >
                            <DraftIcon />
                          </div>
                        ) : (
                          <div
                            className="icon-container public"
                            title="This form is public"
                          >
                            <PlanetIcon />
                          </div>
                        )}
                        <p className="created-date">
                          {new Date(form.relevant_dt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="menu-button-container">
                        <button
                          className="menu-button"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log("swag");
                          }}
                        >
                          <ThreeDotsIcon />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="small-text">No published forms currently</p>
              )}
            </div>
          </section>
          {/* <section>
            <p className="section-heading">Drafts</p>
            <div className="form-grid">
              {forms.drafts.length ? (
                forms.drafts.map((form) => (
                  <Link to={`/draft/${form.id}`} className="form-grid-item">
                    <div className="content">
                      <p className="name">{form.title}</p>
                    </div>
                    <div className="controls">
                      <div className="left-side">
                        <div
                          className="icon-container draft"
                          title="This form is still a draft"
                        >
                          <DraftIcon />
                        </div>
                        <p className="created-date">
                          {new Date(form.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="menu-button-container">
                        <button
                          className="menu-button"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIdForPopupMenu(form.id);
                            setPopupMenuToggled(
                              idForPopupMenu === form.id ? !popupMenuToggled : true
                            );
                          }}
                        >
                          <ThreeDotsIcon />
                        </button>
                        {idForPopupMenu == form.id && popupMenuToggled ? (
                          <FormPopupMenu
                            formId={form.id}
                            isDraft={true}
                            setFormPopupToggled={setPopupMenuToggled}
                            handleFormDelete={() => console.log("delete form", form.id)}
                          />
                        ) : (
                          false
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="small-text">No drafts currently</p>
              )}
            </div>
          </section> */}
        </>
      )}
    </main>
  );
};
