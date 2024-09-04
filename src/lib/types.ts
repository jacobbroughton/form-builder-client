export type FormItemTypeType = {
  id: number;
  name: string;
  description: string;
};

export type FormItemTypePropertyType = {
  id: number;
  data_type_id: number;
  property_name: string;
  property_description: string;
  property_type: string;
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
