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
import { useDispatch } from 'react-redux';
import { setControlledFormValue } from '../../../store/slices/controlledFormSlicer';

const RHFForm = () => {
  const methods = useForm<formValues>({ defaultValues: defaultValues });
  const dispatch = useDispatch();

  const handleSubmit = (data: formValues) => {
    console.log(data);
    dispatch(setControlledFormValue(data));
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
