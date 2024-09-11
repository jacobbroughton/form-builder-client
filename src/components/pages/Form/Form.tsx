import { useEffect, useState } from "react";
import "./Form.css";
import { useParams } from "react-router-dom";

const Form = () => {
  const { formId } = useParams();
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [inputs, setInputs] = useState(null);

  useEffect(() => {
    async function getForm() {
      try {
        setFormLoading(true);

        const response = await fetch(
          `http://localhost:3001/form/get-form-as-user/${formId}`
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

  if (formLoading) return <p>Form loading...</p>;

  return <main className="form">{form.name}</main>;
};
export default Form;
