import { type UseFormProps } from 'react-hook-form';

interface formValues {
  name: string;
  age: number | null | undefined;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  terms: boolean;
  image: File | null;
  country: string;
}

const defaultValues: formValues = {
  name: '',
  age: null,
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  terms: false,
  image: null,
  country: '',
};

interface RHFFormProps extends UseFormProps {
  defaultValues?: formValues;
  children?: React.ReactNode;
  onSubmit: (data: formValues) => void;
}

export { type formValues, defaultValues, type RHFFormProps };
