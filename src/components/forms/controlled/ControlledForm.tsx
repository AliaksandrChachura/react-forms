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
import { useMemo } from 'react';

const RHFForm = ({ onSubmit }: RHFFormProps) => {
  const filledFormValues = useSelector((state: RootState) => state.form);
  const methods = useForm<FormSchema>({
    defaultValues: filledFormValues as FormSchema,
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const dispatch = useDispatch();

  // Check if form is valid by validating current values against schema
  const isFormValid = useMemo(() => {
    try {
      const currentValues = methods.getValues();
      formSchema.parse(currentValues);
      return true;
    } catch {
      return false;
    }
  }, [methods]);

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
          disabled={!isFormValid || isSubmitting}
          className={!isFormValid ? 'submit-button-error' : ''}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </FormProvider>
  );
};

export default RHFForm;
