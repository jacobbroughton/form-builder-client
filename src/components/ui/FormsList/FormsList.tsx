import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useDeletePublishedForm } from "../../../hooks/useDeletePublishedForm";
import { AllFormsType } from "../../../lib/types";
import { elapseTime } from "../../../utils/usefulFunctions";
import { DeleteModal } from "../DeleteModal/DeleteModal";
import { FormPopupMenu } from "../FormPopupMenu/FormPopupMenu";
import { DraftIcon } from "../icons/DraftIcon";
import { PlanetIcon } from "../icons/PlanetIcon";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import "./FormsList.css";

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
  const [DeleteModalShowing, setDeleteModalShowing] = useState(false);
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
                <span className="elapsed-time">
                  <i>{elapseTime(form.relevant_dt)}</i>
                </span>
                <span className="break">{"|"}</span>
                <span className="long-date">
                  {new Date(form.relevant_dt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
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
                    setDeleteModalShowing(true);
                  }}
                />
              ) : (
                false
              )}
            </div>
          </div>
        ))}
      </section>
      {DeleteModalShowing && (
        <DeleteModal
          label="Delete form?"
          handleDeleteClick={async () => {
            if (!formStagedForDeletion) return;

            if (formStagedForDeletion.is_draft) {
              await deleteDraftForm({ formId: formStagedForDeletion.id });
            } else {
              await deletePublishedForm({ formId: formStagedForDeletion.id });
            }

            setForms(forms.filter((f) => f.id !== formStagedForDeletion.id));
            setDeleteModalShowing(false);
          }}
          setDeleteModalShowing={setDeleteModalShowing}
        />
      )}
    </>
  );
};
export default FormsList;
