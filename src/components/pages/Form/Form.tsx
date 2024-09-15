import { useEffect, useState } from "react";
import "./Form.css";
import { useParams } from "react-router-dom";
import FormInput from "../../ui/FormInput/FormInput";
import ThreeDotsIcon from "../../ui/icons/ThreeDotsIcon";
import { PublishedFormType, AddedInputType } from "../../../lib/types";

const Form = () => {
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<AddedInputType[]>([]);

  useEffect(() => {
    async function getForm() {
      try {
        setFormLoading(true);

        const response = await fetch(
          `http://localhost:3001/form/get-published-form-as-user/${formId}`
        );

        if (!response.ok)
          throw new Error("There was a problem fetching the form as user");

        const data = await response.json();

        setForm(data.form);
        setInputs(data.inputs);
        setFormLoading(false);
      } catch (error) {
        if (typeof error === "string") {
          console.log(error.toUpperCase());
        } else if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }

    getForm();
  }, []);

  return (
    <main className="form">
      {formLoading ? (
        <p>Form loading...</p>
      ) : !form ? (
        <p>No form found</p>
      ) : (
        <>
          <div className="form-controls">
            <button className="menu-toggle-button">
              <ThreeDotsIcon />
            </button>
          </div>
          <h1>{form.title}</h1>
          <p>{form.description}</p>
          <div className="inputs">
            {inputs?.map((input) => (
              <FormInput input={input} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};
export default Form;
