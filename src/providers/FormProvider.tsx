import { createContext, ReactElement } from "react";
import { useGetPublishedForm } from "../hooks/useGetPublishedForm";

export const FormContext = createContext({
  form: null,
  needsPasskeyValidation: false,
  formLoading: true,
  inputs: [],
  setInputs: () => null,
});

export const FormContextProvider = ({ children }: { children: ReactElement }) => {
  const {
    form,
    needsPasskeyValidation,
    setNeedsPasskeyValidation,
    inputs,
    loading: formLoading,
    setInputs,
  } = useGetPublishedForm();

  return (
    <FormContext.Provider
      value={{ form, needsPasskeyValidation, setNeedsPasskeyValidation, formLoading, inputs, setInputs }}
    >
      {children}
    </FormContext.Provider>
  );
};
