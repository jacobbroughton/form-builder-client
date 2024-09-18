import {
  DraftFormType,
  PublishedFormType,
  InputTypeType,
  InputTypePropertyType,
  AddedInputType,
} from "../lib/types";

export const storeInitialDraft = async (body: { userId: string }): Promise<object> => {
  const response = await fetch("http://localhost:3001/form/store-initial-draft", {
    method: "post",
    body: JSON.stringify({
      userId: body.userId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("An error occured while storing initial form draft");

  return await response.json();
};

export const updateForm = async (body: {
  formId: string;
  title: string;
  description: string;
  userId: string;
  isForDraft: boolean;
}): Promise<DraftFormType> => {
  const response = await fetch("http://localhost:3001/form/update-form", {
    method: "put",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      formId: body.formId,
      title: body.title,
      description: body.description,
      userId: body.userId,
      isForDraft: body.isForDraft,
    }),
  });

  if (!response.ok) throw new Error("An error occured while updating the form draft");

  return await response.json();
};

export const getPublishedForm = async (params: { formId: string | undefined }) => {
  if (!params.formId) throw new Error("No form ID provided for fetching published form");

  const response = await fetch(
    `http://localhost:3001/form/get-published-form/${params.formId}`
  );

  if (!response.ok) throw new Error("There was an error fetching form form");

  return await response.json();
};

export const getDraftForm = async (params: { formId: string | undefined }) => {
  if (!params.formId) throw new Error("No form ID provided for fetching draft form");

  const response = await fetch(
    `http://localhost:3001/form/get-draft-form/${params.formId}`
  );

  if (!response.ok)
    throw new Error("There was a problem fetching the draft form as user");

  return await response.json();
};

export const getDraftForms = async (params: {
  userId: string;
}): Promise<DraftFormType[]> => {
  if (!params.userId) throw new Error("No user ID provided for fetching draft forms");

  const response = await fetch(
    `http://localhost:3001/form/get-draft-forms/${params.userId}`
  );

  if (!response.ok) throw new Error("There was a problem fetching forms");

  return await response.json();
};

export const deletePublishedForm = async (params: {
  formId: string | undefined;
}): Promise<PublishedFormType> => {
  const response = await fetch(
    `http://localhost:3001/form/delete-published-form/${params.formId}`,
    {
      method: "put",
    }
  );

  if (!response.ok)
    throw new Error("Something happened while trying to delete this form");

  return await response.json();
};

export const deleteDraftForm = async (params: {
  formId: string | undefined;
}): Promise<DraftFormType> => {
  if (!params.formId)
    throw new Error("No form ID was provided for deleting the draft form");

  const response = await fetch(
    `http://localhost:3001/form/delete-draft-form/${params.formId}`,
    {
      method: "put",
    }
  );

  if (!response.ok)
    throw new Error("Something happened while trying to delete this form");

  return await response.json();
};

export const getAllForms = async (params: {
  userId: string | undefined;
}): Promise<DraftFormType | PublishedFormType> => {
  const response = await fetch(
    `http://localhost:3001/form/get-all-forms/${params.userId}`
  );

  if (!response.ok) throw new Error("There was a problem fetching forms");

  return await response.json();
};

export const getInputTypes = async (): Promise<InputTypeType[]> => {
  const response = await fetch("http://localhost:3001/form/item-types");

  if (!response.ok) throw new Error("An error occured while fetching form types");

  return await response.json();
};

export const changeInputEnabledStatus = async (
  params: { inputId: string },
  body: { newActiveStatus: boolean; isDraft: boolean }
): Promise<void> => {
  const response = await fetch(
    `http://localhost:3001/form/change-input-enabled-status/${params.inputId}`,
    {
      method: "put",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        newActiveStatus: body.newActiveStatus,
        isDraft: body.isDraft,
      }),
    }
  );

  if (!response.ok)
    throw new Error("There was an error deleting this input from the draft form");

  await response.json();
};

export const publish = async (body: {
  draftFormId: string;
  userId: string;
}): Promise<void> => {
  const response = await fetch("http://localhost:3001/form/publish", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      draftFormId: body.draftFormId,
      userId: body.userId,
    }),
  });

  if (!response.ok) throw new Error("Something went wrong when publishing this form");

  return await response.json();
};

export const getInputTypeProperties = async (): Promise<{
  [key: string]: InputTypePropertyType[];
}> => {
  const response = await fetch("http://localhost:3001/form/item-type-properties");

  if (!response.ok)
    throw new Error("An error occured while fetching form item type properties");

  return await response.json();
};

export const getInputTypePropertyOptions = async (): Promise<void> => {
  const response = await fetch("http://localhost:3001/form/item-type-property-options");

  if (!response.ok)
    throw new Error("An error occured while fetching form item type property options");

  return await response.json();
};

export const addNewInputToForm = async (body: {
  inputTypeId: number | undefined;
  inputMetadataQuestion: string;
  inputMetadataDescription: string;
  properties: InputTypePropertyType[];
  formId: string | undefined;
  userId: string;
  isForDraft: boolean;
}): Promise<AddedInputType> => {
  if (!body.inputTypeId) throw new Error("Input type id not provided");
  if (!body.formId) throw new Error("Form ID for new input type was not provided");

  const response = await fetch("http://localhost:3001/form/add-new-input-to-form", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      inputTypeId: body.inputTypeId,
      inputMetadataQuestion: body.inputMetadataQuestion,
      inputMetadataDescription: body.inputMetadataDescription,
      formId: body.formId,
      userId: body.userId,
      isForDraft: body.isForDraft,
    }),
  });

  if (!response.ok)
    throw new Error("Something happened when trying to add a new form item to the draft");

  return await response.json();
};
