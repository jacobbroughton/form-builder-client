import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../../../utils/usefulFunctions";
import { PublishedFormType, DraftFormType } from "../../../lib/types";
import "./Forms.css";

const Forms = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<{
    drafts: DraftFormType[];
    published: PublishedFormType[];
  }>({
    drafts: [],
    published: [],
  });

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
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
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
            <p className="section-heading">Published</p>
            <div className="form-grid">
              {forms.published.length ? (
                forms.published.map((form) => (
                  <Link to={`/form/${form.id}`} className="form-grid-item">
                    <p className="name">{form.title}</p>
                    <p className="created-date">Created {timeAgo(form.published_at)}</p>
                  </Link>
                ))
              ) : (
                <p className="small-text">No published forms currently</p>
              )}
            </div>
          </section>
          <section>
            <p className="section-heading">Drafts</p>
            <div className="form-grid">
              {forms.drafts.length ? (
                forms.drafts.map((form) => (
                  <Link to={`/draft/${form.id}`} className="form-grid-item">
                    <p className="name">{form.title}</p>
                    <p className="created-date">Created {timeAgo(form.created_at)}</p>
                  </Link>
                ))
              ) : (
                <p className="small-text">No drafts currently</p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
};
export default Forms;
