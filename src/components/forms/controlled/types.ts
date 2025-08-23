interface formValues {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  terms: boolean;
  imageBase64?: string;
  country: string;
}

const defaultValues: formValues = {
  name: '',
  age: 0,
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  terms: false,
  imageBase64: '',
  country: '',
};

interface RHFFormProps {
  onSubmit: (data: formValues) => void;
}

export { type formValues, defaultValues, type RHFFormProps };
