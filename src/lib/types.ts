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
  created_by_id: number;
};

// export type AddedInputType = {
//   inputType: InputTypeType | null;
//   metadata: {
//     id: number;
//     name: string;
//     description: string;
//   };
//   properties: InputTypePropertyType[];
// };

export type AddedInputType = {
  id: number;
  input_type_id: number;
  draft_form_id: number;
  metadata_name: string;
  metadata_description: string;
  eff_status: number;
  created_at: string;
  created_by_id: number;
  modified_by_id: number;
  modified_at: string;
  input_type_name: string;
  input_type_description: string;
  num_custom_properties: number;
};
