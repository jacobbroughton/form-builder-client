import { useContext, useState } from "react";
import { PublishedFormType } from "../../../lib/types";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import { FormPopupMenu } from "../FormPopupMenu/FormPopupMenu";
import { UserContext } from "../../../providers/UserContextProvider";
import { DraftPublishedTag } from "../DraftPublishedTag/DraftPublishedTag";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import { Link } from "react-router-dom";
import "./FormHeader.css";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";

const FormHeader = ({
  form,
  setDeleteModalShowing,
  view,
  setView,
}: {
  form: PublishedFormType;
  setDeleteModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const { user } = useContext(UserContext);

  const isFormCreator = form?.created_by_id === user?.id;

  return (
    <header>
      <div className="row">
        <div className="text">
          <h3 className="title">{form.title}</h3>
          {form.description !== "" && <p className="description">{form.description}</p>}
        </div>
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
                isDraft={false}
                setFormPopupToggled={setFormPopupMenuToggled}
                handleDeleteClick={() => {
                  setDeleteModalShowing(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
      {isFormCreator && (
        <div className="row">
          <div className="buttons">
            {isFormCreator ? (
              <>
                {view === "form" ? (
                  <button className="view-responses-link" onClick={() => setView("responses")}>
                    View Responses <ArrowRightIcon />
                  </button>
                ) : view === "responses" ? (
                  <button className="view-responses-link" onClick={() => setView("form")}>
                    <ArrowLeftIcon /> Go back to form
                  </button>
                ) : (
                  false
                )}
                <DraftPublishedTag draftOrPublished={"published"} />
              </>
            ) : (
              false
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default FormHeader;
