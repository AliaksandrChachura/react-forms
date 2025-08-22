interface UncontrolledInputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  accept?: string;
}

interface UncontrolledSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

interface UncontrolledCheckboxFieldProps {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export type {
  UncontrolledInputFieldProps,
  UncontrolledSelectFieldProps,
  UncontrolledCheckboxFieldProps,
};
