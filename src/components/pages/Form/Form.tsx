import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddedInputType, PublishedFormType } from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { FormInput } from "../../ui/FormInput/FormInput";
import { FormPopupMenu } from "../../ui/FormPopupMenu/FormPopupMenu";
import { ThreeDotsIcon } from "../../ui/icons/ThreeDotsIcon";
import "./Form.css";
import { NoPromptsMessage } from "../../ui/NoPromptsMessage/NoPromptsMessage";

export const Form = () => {
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<AddedInputType[]>([]);
  const [formPopupMenuToggled, setFormPopupMenuToggled] = useState(false);

  async function handleFormDelete(): Promise<void> {
    try {
      console.log("SWag");
      const response = await fetch(
        `http://localhost:3001/form/delete-published-form/${formId}`,
        {
          method: "put",
        }
      );

      if (!response.ok)
        throw new Error("Something happened while trying to delete this form");

      const data = await response.json();

      console.log("Deleted form", data);
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    async function getForm(): Promise<void> {
      try {
        setFormLoading(true);

        const response = await fetch(
          `http://localhost:3001/form/get-published-form/${formId}`
        );

        if (!response.ok)
          throw new Error("There was a problem fetching the form as user");

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
    <main className="published-form">
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
                  isDraft={false}
                  setFormPopupToggled={setFormPopupMenuToggled}
                  handleFormDelete={() => handleFormDelete()}
                />
              ) : (
                false
              )}
            </div>
          </div>
          <div className="heading">
            <h1>{form.title}</h1>
            <p>{form.description}</p>
          </div>
          <div className="inputs">
            {inputs.length ? (
              inputs.map((input) => <FormInput input={input} />)
            ) : (
              <NoPromptsMessage/>
            )}
          </div>
        </>
      )}
    </main>
  );
};
