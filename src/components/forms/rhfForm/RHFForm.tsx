import { FormProvider, useForm } from 'react-hook-form';
import { type formValues, defaultValues } from './types';
import {
  NameField,
  AgeField,
  EmailField,
  PasswordField,
  ConfirmPasswordField,
  GenderField,
  TermsField,
  ImageField,
  CountryField,
} from './InputFields';

const RHFForm = () => {
  const methods = useForm<formValues>({ defaultValues: defaultValues });

  const handleSubmit = (data: formValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="form">
        <NameField />
        <AgeField />
        <EmailField />
        <PasswordField />
        <ConfirmPasswordField />
        <GenderField />
        <TermsField />
        <ImageField />
        <CountryField />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default RHFForm;
