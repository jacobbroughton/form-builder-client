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
          `http://localhost:3001/form/get-published-form-as-user/${formId}`
        );

        if (!response.ok)
          throw new Error("There was a problem fetching the form as user");

        const data = await response.json();

        console.log(data);

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
      ) : (
        <div>
          <h1>{form.title}</h1>
          <div className='inputs'>
            {inputs?.map(input => <input type={input.input_type_name.toLowerCase()}/>)}
          </div>
        </div>
      )}
    </main>
  );
};
export default Form;
