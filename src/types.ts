export type FieldType =
  | "header"
  | "label"
  | "paragraph"
  | "linebreak"
  | "text"
  | "number"
  | "dropdown"
  | "checkboxes"
  | "multipleChoice"
  | "tags";

export interface Field {
  id: number;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
}
