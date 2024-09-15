import { useEffect, useState } from "react";
import "./Draft.css";
import { useParams } from "react-router-dom";
import FormInput from "../../ui/FormInput/FormInput";
import { DraftFormType, AddedInputType } from "../../../lib/types";

const Draft = () => {
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState<DraftFormType | null>(null);
  const [inputs, setInputs] = useState<AddedInputType[] | null>(null);

  useEffect(() => {
    async function getForm() {
      try {
        setFormLoading(true);

        const response = await fetch(
          `http://localhost:3001/form/get-draft-form/${formId}`
        );

        if (!response.ok) throw new Error("There was a problem fetching the form");

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
    <main className="draft-form">
      {formLoading ? (
        <p>Form loading...</p>
      ) : !form ? (
        <p>No form found</p>
      ) : (
        <>
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
export default Draft;
