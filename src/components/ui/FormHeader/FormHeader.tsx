import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormContext } from "../../../providers/FormProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { DraftPublishedTag } from "../DraftPublishedTag/DraftPublishedTag";
import { FormPopupMenu } from "../FormPopupMenu/FormPopupMenu";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../icons/ArrowRightIcon";
import { ThreeDotsIcon } from "../icons/ThreeDotsIcon";
import "./FormHeader.css";

export function FormHeader({
  setDeleteModalShowing,
  view,
  setView,
}: {
  setDeleteModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);
  const { user } = useContext(UserContext);
  const { form } = useContext(FormContext);

  const isFormCreator = form?.created_by_id === user?.id;

  return (
    <header className='form-header'> 
      <div className="row">
        <div className="text">
          <h1 className="title">{form?.title}</h1>
          {form?.description && <p className="small-text description">{form.description}</p>}
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
                  isDraft={false}
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
      {isFormCreator && (
        <div className="row">
          <div className="buttons">
            {isFormCreator ? (
              <>
                {view === "form" && form?.num_responses > 0 ? (
                  <button
                    className="view-responses-link"
                    onClick={() => {
                      setSearchParams({ view: "responses" });
                      setView("responses");
                    }}
                  >
                    View Responses <ArrowRightIcon />
                  </button>
                ) : view === "responses" && form?.num_responses > 0 ? (
                  <button
                    className="view-responses-link"
                    onClick={() => {
                      setSearchParams({ view: "form" });
                      setView("form");
                    }}
                  >
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
}
