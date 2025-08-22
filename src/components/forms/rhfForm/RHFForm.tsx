import { FormProvider, useForm } from 'react-hook-form';
import { type formValues } from './types';
import { useSelector } from 'react-redux';
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
} from '../InputFields';
import { useDispatch } from 'react-redux';
import { setFormValue } from '../../../store/slices/formSlicer';
import { type RootState } from '../../../store';

interface RHFFormProps {
  onSubmit: (data: formValues) => void;
}

const RHFForm = ({ onSubmit }: RHFFormProps) => {
  const filledFormValues = useSelector(
    (state: RootState) => state.controlledForm
  );
  const methods = useForm<formValues>({ defaultValues: filledFormValues });
  const dispatch = useDispatch();

  const handleSubmit = (data: formValues) => {
    dispatch(setFormValue(data));
    onSubmit(data);
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
