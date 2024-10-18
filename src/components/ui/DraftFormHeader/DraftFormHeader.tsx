import { useContext, useState } from "react";
import { DraftFormType } from "../../../lib/types";
import { DraftPublishedTag } from "../DraftPublishedTag/DraftPublishedTag";
import { FormPopupMenu } from "../FormPopupMenu/FormPopupMenu";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import "./DraftFormHeader.css";
import { ActionButtonWithIcon } from "../ActionButtonWithIcon/ActionButtonWithIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { usePublish } from "../../../hooks/usePublish";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "../../../providers/ErrorContextProvider";

export function DraftFormHeader({
  form,
  setDeleteModalShowing,
}: {
  form: DraftFormType;
  setDeleteModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { publish } = usePublish();
  const { setError } = useContext(ErrorContext);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const navigate = useNavigate();

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
        <ActionButtonWithIcon
          icon={<ShareIcon />}
          label="Publish"
          color="green"
          iconPlacement="before"
          disabled={false}
          handleClick={async () => {
            try {
              const data = await publish({
                draftFormId: form.id,
              });

              if (!data[0]) throw new Error("No form was found after publishing");

              navigate(`/form/${data[0].id}`);
            } catch (error) {
              handleCatchError(error, setError, null);
            }
          }}
        />
      </div>
    </header>
  );
}
