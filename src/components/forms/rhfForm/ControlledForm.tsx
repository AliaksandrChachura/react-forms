import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type RHFFormProps } from './types';
import { formSchema, type FormSchema } from './schema';
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
} from './ControlledInputFields';
import { useDispatch } from 'react-redux';
import { setFormValue } from '../../../store/slices/formSlicer';
import { type RootState } from '../../../store';

const RHFForm = ({ onSubmit }: RHFFormProps) => {
  const filledFormValues = useSelector((state: RootState) => state.form);
  const methods = useForm<FormSchema>({
    defaultValues: filledFormValues as FormSchema,
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });
  const dispatch = useDispatch();

  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  const isSubmitting = methods.formState.isSubmitting;

  const handleSubmit = (data: FormSchema) => {
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
        <button
          type="submit"
          disabled={hasErrors || isSubmitting}
          className={hasErrors ? 'submit-button-error' : ''}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </FormProvider>
  );
};

export default RHFForm;
