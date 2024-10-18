import { Link } from "react-router-dom";
import { DraftIcon } from "../icons/DraftIcon";
import { PlanetIcon } from "../icons/PlanetIcon";
import React, { useState } from "react";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import { FormPopupMenu } from "../FormPopupMenu/FormPopupMenu";
import "./FormsGrid.css";
import { AllFormsType } from "../../../lib/types";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";

export function FormsGrid({
  forms,
}: {
  forms: AllFormsType[];
}) {
  const { deleteDraftForm } = useDeleteDraftForm();
  const { deletePublishedForm } = useDeletePublishedForm();
  const [popupMenuToggled, setPopupMenuToggled] = useState<boolean>(false);
  const [idForPopupMenu, setIdForPopupMenu] = useState<string | null>(null);

  return (
    <section className="form-grid">
      {forms.map((form) => (
        <div className="form-grid-item-container">
          <Link
            key={form.id}
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
                  <div className="icon-container public" title="This form is public">
                    <PlanetIcon />
                  </div>
                )}
                <p
                  className="created-date"
                  title={new Date(form.relevant_dt).toLocaleString()}
                >
                  {new Date(form.relevant_dt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Link>
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
                form={form}
                isDraft={form.is_draft}
                setFormPopupToggled={setPopupMenuToggled}
                handleFormDelete={async () => {
                  if (form.is_draft) {
                    await deleteDraftForm({ formId: form.id });
                  } else {
                    await deletePublishedForm({ formId: form.id });
                  }

                  // setForms(forms.filter((f) => f.id !== form.id));
                }}
              />
            ) : (
              false
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
