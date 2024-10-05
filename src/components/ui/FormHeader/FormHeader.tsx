import { useContext, useState } from "react";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import { FormPopupMenu } from "../FormPopupMenu/FormPopupMenu";
import { FormContext } from "../../../providers/FormProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { DraftPublishedTag } from "../DraftPublishedTag/DraftPublishedTag";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import { Link } from "react-router-dom";

const FormHeader = ({ form, setDeleteModalShowing }) => {
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const { user } = useContext(UserContext);

  const isFormCreator = form?.created_by_id === user?.id;

  return (
    <header>
      <div className="row">
        <div className="text">
          <h3 className="title">{form.title}</h3>
          {form.description ? <p className="description">{form.description}</p> : false}
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
            {formPopupMenuToggled ? (
              <FormPopupMenu
                form={form}
                isDraft={false}
                setFormPopupToggled={setFormPopupMenuToggled}
                handleDeleteClick={() => {
                  setDeleteModalShowing(true);
                }}
              />
            ) : (
              false
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="buttons">
          <Link className="view-responses-link" to={`/responses/${form.id}`}>
            View Responses <ArrowRightIcon />
          </Link>
          {isFormCreator && <DraftPublishedTag draftOrPublished={"published"} />}
        </div>
      </div>
    </header>
  );
};
export default FormHeader;
