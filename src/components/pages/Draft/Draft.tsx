import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddedInputType, PublishedFormType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { FormInput } from "../../ui/FormInput/FormInput";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";
import "./Draft.css";

export const Draft = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<AddedInputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);

  async function handleFormDelete(): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:3001/form/delete-draft-form/${formId}`,
        {
          method: "put",
        }
      );

      if (!response.ok)
        throw new Error("Something happened while trying to delete this form");

      const data = await response.json();

      console.log("Deleted form", data);

      navigate("/");
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    async function getForm(): Promise<void> {
      try {
        setFormLoading(true);

        const response = await fetch(
          `http://localhost:3001/form/get-draft-form/${formId}`
        );

        if (!response.ok)
          throw new Error("There was a problem fetching the draft form as user");

        const data = await response.json();

        setForm(data.form);
        setInputs(data.inputs);
        setFormLoading(false);
      } catch (error) {
        handleCatchError(error);
      }
    }

    getForm();
  }, []);

  return (
    <main className="draft-form">
      {formLoading ? (
        <p>Form loading...</p>
      ) : !form ? (
        <p>No form found</p>
      ) : (
        <>
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
                  formId={form.id}
                  isDraft={true}
                  setFormPopupToggled={setFormPopupMenuToggled}
                  handleFormDelete={() => handleFormDelete()}
                />
              ) : (
                false
              )}
            </div>
          </div>
          <div className="heading">
            <h1 className="title">{form.title}</h1>
            <p className="description">{form.description}</p>
          </div>
          <div className="inputs">
            {inputs.length ? (
              inputs.map((input) => <FormInput input={input} />)
            ) : (
              <NoPromptsMessage />
            )}
          </div>
        </>
      )}
    </main>
  );
};
