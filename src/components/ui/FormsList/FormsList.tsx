import { useState } from "react";
import { Link } from "react-router-dom";
import { AllFormsType } from "../../../lib/types";
import { FormPopupMenu } from "../FormPopupMenu/FormPopupMenu";
import { DraftIcon } from "../icons/DraftIcon";
import { PlanetIcon } from "../icons/PlanetIcon";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import "./FormsList.css";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import DeleteFormModal from "../DeleteFormModal/DeleteFormModal";

const FormsList = ({
  forms,
  setForms,
}: {
  forms: AllFormsType[];
  setForms: React.Dispatch<React.SetStateAction<AllFormsType[]>>;
}) => {
  const { deleteDraftForm } = useDeleteDraftForm();
  const { deletePublishedForm } = useDeletePublishedForm();
  const [popupMenuToggled, setPopupMenuToggled] = useState<boolean>(false);
  const [idForPopupMenu, setIdForPopupMenu] = useState<string | null>(null);
  const [deleteFormModalShowing, setDeleteFormModalShowing] = useState(false);
  const [formStagedForDeletion, setFormStagedForDeletion] = useState<AllFormsType | null>(
    null
  );

  return (
    <>
      <section className="form-list">
        {forms.map((form) => (
          <div className="form-list-item" key={form.id}>
            <Link
              to={form.is_draft ? `/draft/${form.id}` : `/form/${form.id}`}
              className="form-list-item-link"
            >
              {form.is_draft ? (
                <div className="icon-container draft" title="This form is still a draft">
                  <DraftIcon />
                </div>
              ) : (
                <div className="icon-container public" title="This form is public">
                  <PlanetIcon />
                </div>
              )}
              <p className="name">{form.title}</p>

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
                  handleDeleteClick={() => {
                    setFormStagedForDeletion(form);
                    setDeleteFormModalShowing(true)
                  }}
                />
              ) : (
                false
              )}
            </div>
          </div>
        ))}
      </section>
      {deleteFormModalShowing ? (
        <DeleteFormModal
          handleDeleteClick={async () => {
            if (!formStagedForDeletion) return;

            if (formStagedForDeletion.is_draft) {
              await deleteDraftForm({ formId: formStagedForDeletion.id });
            } else {
              await deletePublishedForm({ formId: formStagedForDeletion.id });
            }

            setForms(forms.filter((f) => f.id !== formStagedForDeletion.id));
            setDeleteFormModalShowing(false)
          }}
          setDeleteFormModalShowing={setDeleteFormModalShowing}
        />
      ) : (
        false
      )}
    </>
  );
};
export default FormsList;
