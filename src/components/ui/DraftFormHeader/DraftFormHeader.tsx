import { useState } from "react";
import { DraftFormType } from "../../../lib/types";
import { DraftPublishedTag } from "../DraftPublishedTag/DraftPublishedTag";
import { FormPopupMenu } from "../FormPopupMenu/FormPopupMenu";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import "./DraftFormHeader.css";

export const DraftFormHeader = ({
  form,
  setDeleteModalShowing,
}: {
  form: DraftFormType;
  setDeleteModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);

  return (
    <header>
      <div className="row">
        <div className="text">
          <h1 className="title">{form?.title}</h1>
          {form?.description && <p className="description">{form.description}</p>}
        </div>
        {Boolean(form) && (
          <div className="form-controls">
            <div className="menu-toggle-button-container">
              <button
                className="menu-toggle-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormPopupMenuToggled(!formPopupMenuToggled);
                }}
              >
                <ThreeDotsIcon />
              </button>
              {formPopupMenuToggled && (
                <FormPopupMenu
                  form={form}
                  isDraft={true}
                  setFormPopupToggled={setFormPopupMenuToggled}
                  handleDeleteClick={() => {
                    setDeleteModalShowing(true);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="row">
        <DraftPublishedTag draftOrPublished={"draft"} />
      </div>
    </header>
  );
};
