import { createContext, useContext, useState, ReactElement, useEffect } from "react";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "./ErrorContextProvider";
import { useGetPublishedForm } from "../hooks/useGetPublishedForm";
import { useParams } from "react-router-dom";

export const FormContext = createContext({
  form: null,
  formLoading: true,
  inputs: [],
  setInputs: () => null,
});

export const FormContextProvider = ({ children }: { children: ReactElement }) => {
  const { getPublishedForm } = useGetPublishedForm();

  const { setError } = useContext(ErrorContext);
  const { formId } = useParams();

  const [form, setForm] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    async function getForm(): Promise<void> {
      try {
        setFormLoading(true);

        const data = await getPublishedForm({ formId });

        setForm(data.form);
        setInputs(
          data.inputs.map((input) => ({
            ...input,
            value: input.existing_answer || "",
          }))
        );
      } catch (error) {
        handleCatchError(error, setError, null);
      } finally {
        setFormLoading(false);
      }
    }

    getForm();
  }, []);

  // useEffect(() => {
  //   if (form && user) {
  //     console.log(form.created_by_id === user.id)
  //     setForm(form.created_by_id === user.id);
  //   }
  // }, [form, user]);

  return (
    <FormContext.Provider value={{ form, formLoading, inputs, setInputs }}>
      {children}
    </FormContext.Provider>
  );
};
