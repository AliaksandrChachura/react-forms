import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type RHFFormProps } from './types';
import { formSchema, type FormSchema } from './schema';
import { useSelector, useDispatch } from 'react-redux';
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
import { setFormValue } from '../../../store/slices/formSlicer';
import { type RootState } from '../../../store';

const RHFForm = ({ onSubmit }: RHFFormProps) => {
  const filledFormValues = useSelector((state: RootState) => state.form);
  const methods = useForm<FormSchema>({
    defaultValues: filledFormValues as FormSchema,
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    // optional: criteriaMode: 'all',
  });
  const dispatch = useDispatch();

  // This hook subscribes to form state changes without complex deps
  const { isValid, isSubmitting, isValidating } = useFormState({
    control: methods.control,
  });

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
          disabled={!isValid || isSubmitting || isValidating}
          className={!isValid ? 'submit-button-error' : ''}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </FormProvider>
  );
};

export default RHFForm;
