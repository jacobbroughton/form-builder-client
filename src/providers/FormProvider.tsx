import { createContext, ReactElement, useContext, useEffect, useState } from "react";
import { useGetInputSubmissions } from "../hooks/useGetInputSubmissions";
import { useGetPrevFormSubmission } from "../hooks/useGetPrevFormSubmission";
import { usePublishedForm } from "../hooks/usePublishedForm";
import { useResponses } from "../hooks/useResponses";
import {
  InputType,
  InputTypeWithProperties,
  PrevSubmissionType,
  PublishedFormType,
} from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "./ErrorContextProvider";
import { UserContext } from "./UserContextProvider";

export const FormContext = createContext<{
  form: PublishedFormType | null;
  needsPasskeyValidation: boolean;
  formLoading: boolean;
  inputs: InputType[];
  setInputs: React.Dispatch<React.SetStateAction<InputTypeWithProperties[]>>;
  setNeedsPasskeyValidation: React.Dispatch<React.SetStateAction<boolean>>;
  formSubmitted: boolean;
  prevSubmissions: PrevSubmissionType[];
  latestInputSubmissions: { [key: string]: PrevSubmissionType } | null;
  latestMultipleChoiceSubmissions: { [key: string]: object } | null;
  handleSubmissionsOnSubmit: (newSubmission: PrevSubmissionType) => Promise<null>;
  responses: {
    submissionsList: {
      created_at: string;
      created_by_id: string;
      email: string;
      form_id: string;
      id: string;
      modified_at: string | null;
      modified_by_id: string | null;
      username: string | null;
    }[];
    inputsBySubID: {
      [key: string]: {
        created_at: string;
        created_by_id: string;
        created_input_id: string;
        form_id: string;
        id: string;
        metadata_description: string;
        metadata_question: string;
        modified_at: string | null;
        modified_by_id: string | null;
        submission_id: string;
        value: string;
        input_type_name: string;
      }[];
    };
  };
  responsesLoading: boolean;
}>({
  form: null,
  needsPasskeyValidation: false,
  formLoading: true,
  inputs: [],
  setInputs: () => null,
  setNeedsPasskeyValidation: () => null,
  formSubmitted: false,
  prevSubmissions: [],
  latestInputSubmissions: null,
  latestMultipleChoiceSubmissions: null,
  handleSubmissionsOnSubmit: async () => null,
  responses: {},
  responsesLoading: true,
});

export function FormContextProvider({ children }: { children: ReactElement }) {
  const {
    form,
    needsPasskeyValidation,
    setNeedsPasskeyValidation,
    inputs,
    loading: formLoading,
    setInputs,
  } = usePublishedForm();
  const { getPrevFormSubmissions } = useGetPrevFormSubmission();
  const { getInputSubmissions } = useGetInputSubmissions();
  const { user } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);

  const { responses, loading: responsesLoading } = useResponses();

  const [prevSubmissions, setPrevSubmissions] = useState<PrevSubmissionType[]>([]);
  const [latestInputSubmissions, setLatestInputSubmissions] = useState(null);
  const [latestMultipleChoiceSubmissions, setLatestMultipleChoiceSubmissions] =
    useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  async function handleSubmissionsOnSubmit(
    newSubmission: PrevSubmissionType
  ): Promise<null> {
    const data = await getInputSubmissions({
      submissionId: newSubmission.id,
    });

    const { inputSubmissions, multipleChoiceSubmissions } = data;

    setPrevSubmissions([...prevSubmissions, newSubmission]);
    setLatestInputSubmissions(inputSubmissions);
    setLatestMultipleChoiceSubmissions(multipleChoiceSubmissions);
    setFormSubmitted(true);

    return null;
  }

  useEffect(() => {
    async function getFormSubmissions(): Promise<void> {
      try {
        if (!form) throw new Error("No form found when fetching form submissions.");

        const formSubmissions = await getPrevFormSubmissions({ formId: form.id });

        if (formSubmissions.length) {
          const { inputSubmissions, multipleChoiceSubmissions } =
            await getInputSubmissions({
              submissionId: formSubmissions[0]?.id,
            });

          setLatestMultipleChoiceSubmissions(multipleChoiceSubmissions);
          setLatestInputSubmissions(inputSubmissions);
        }

        setFormSubmitted(formSubmissions[0] ? true : false);

        setPrevSubmissions(formSubmissions);
      } catch (error) {
        handleCatchError(error, setError, null);
      }
    }
    if (form && user) getFormSubmissions();
  }, [form]);

  return (
    <FormContext.Provider
      value={{
        form,
        needsPasskeyValidation,
        setNeedsPasskeyValidation,
        formLoading,
        inputs,
        setInputs,
        formSubmitted,
        prevSubmissions,
        latestInputSubmissions,
        latestMultipleChoiceSubmissions,
        handleSubmissionsOnSubmit,
        responses,
        responsesLoading,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
