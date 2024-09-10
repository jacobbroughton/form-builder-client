export type FormItemTypeType = {
  id: number;
  name: string;
  description: string;
};

export type FormItemTypePropertyType = {
  id: number;
  input_type_id: number;
  property_name: string;
  property_description: string;
  property_type: string;
  value: string;
};

export type FormItemTypePropertyOptionType = {
  id: number;
  property_id: number;
  option_name: number;
  option_value: string;
  checked: boolean;
};

export type HashmapType = {
  [key: string]: object[];
};

export type FormItemTypePropertyValueType = {
  property_id: number;
  input_type_id: number;
  form_id: number;
  value: string;
  created_by_id: number;
};

export type AddedFormItemType = {
  inputType: FormItemTypeType | null;
  metadata: {
    id: number,
    name: string;
    description: string;
  };
  properties: FormItemTypePropertyType[];
};
