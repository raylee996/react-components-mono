export type TField = {
  name: string | number;
  value: any;
  errors: string[];
};

export interface FormInstance {
  getFieldValue: (name: string | number) => any;
  getFieldsValue: (nameList?: (string | number)[]) => any;
  resetFields: (nameList?: (string | number)[]) => void;
  setFields: (fields: TField[]) => void;
}
