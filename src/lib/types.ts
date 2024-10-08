export type InputTypeType = {
  id: number;
  name: string;
  description: string;
};

export type InputTypePropertyType = {
  id: number;
  input_type_id: number;
  property_name: string;
  property_description: string;
  property_type: string;
  value: string;
};

export type InputTypePropertyOptionType = {
  id: number;
  property_id: number;
  option_name: number;
  option_value: string;
  checked: boolean;
};

export type HashmapType = {
  [key: string]: object[];
};

export type InputTypePropertyValueType = {
  property_id: number;
  input_type_id: number;
  form_id: number;
  value: string;
  created_by_id: string;
};

export type CreatedPropertyType = {
  id: string;
  created_input_id: string;
  property_id: number;
  input_type_id: number;
  value: string;
  published_at: string;
  published_by_id: string;
  created_at: string;
  created_by_id: string;
  modified_by_id: string | null;
  modified_at: string | null;
  property_name: string;
  property_key: string;
  property_description: string | null;
  property_type: string | null;
};

export interface InputType {
  id: string;
  input_type_id: number;
  draft_form_id: number;
  metadata_question: string;
  metadata_description: string;
  is_active: boolean;
  is_deleted: boolean;
  is_required: boolean;
  created_at: string;
  created_by_id: string;
  modified_by_id: string;
  modified_at: string;
  input_type_name: string;
  input_type_description: string;
  num_custom_properties: number;
  existing_answer: string;
  value: string;
}

export interface InputTypeWithProperties extends InputType {
  properties: { [key: string]: CreatedPropertyType };
}

export type DraftFormType = {
  id: string;
  title: string;
  description: string;
  passkey: string | null;
  is_published: boolean;
  is_deleted: boolean;
  created_at: string;
  created_by_id: string;
  modified_at: string | null;
  modified_by_id: string | null;
  privacy_id: number;
};

export type PublishedFormType = {
  id: string;
  draft_id: string;
  title: string;
  description: string;
  passkey: string | null;
  is_deleted: boolean;
  published_by_id: string;
  published_at: string;
  created_by_id: string;
  created_at: string;
  modified_by_id: null;
  modified_at: null;
  can_resubmit: boolean;
};

export type SortOptionType = {
  id: number;
  name: string;
  value: string;
};

export interface AllFormsType extends DraftFormType {
  is_draft: boolean;
  relevant_dt: string;
}

export type UserType = {
  id: string;
  name: string;
  email: string;
  picture: string;
  username: string | null;
  created_at: string;
  modified_at: string;
} | null;

export type PrivacyOptionResponseType = {
  id: number;
  name: string;
  description: string;
  needs_passkey: boolean;
  created_at: string;
  modified_at: string;
};

export type PrivacyOptionType = {
  id: number;
  name: string;
  description: string;
  needs_passkey: boolean;
  created_at: string;
  modified_at: string;
  checked: boolean;
};

export type PrevSubmissionType = {
  created_at: string;
  created_by_id: string;
  form_id: string;
  id: string;
  modified_at: string | null;
  modified_by_id: string | null;
};
