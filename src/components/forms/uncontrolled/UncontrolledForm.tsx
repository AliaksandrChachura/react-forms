import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ZodError } from 'zod';
import { setFormValue } from '../../../store/slices/formSlicer';
import { type RootState } from '../../../store';
import { formSchema, type FormSchema } from '../rhfForm/schema';
import {
  UncontrolledInputField,
  UncontrolledSelectField,
  UncontrolledCheckboxField,
  UncontrolledCountryField,
  UncontrolledImageField,
} from './UncontrolledInputFields';

interface UncontrolledFormProps {
  onSubmit: (data: FormSchema) => void;
}

function UncontrolledForm({ onSubmit }: UncontrolledFormProps) {
  const dispatch = useDispatch();
  const filledFormValues = useSelector((state: RootState) => state.form);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState('');
  const [terms, setTerms] = useState(false);
  const [imageBase64, setImageBase64] = useState('');
  const [country, setCountry] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = (fieldName: string, value: unknown) => {
    try {
      let processedValue = value;
      if (fieldName === 'age') {
        const numValue = value === '' ? 0 : Number(value);
        processedValue = isNaN(numValue as number) ? 0 : numValue;
      }

      const partialData = {
        name,
        email,
        password,
        age,
        confirmPassword,
        gender,
        terms,
        imageBase64,
        country,
        [fieldName]: processedValue,
      };

      formSchema.parse(partialData);

      setErrors((prev) => {
        const newErrors = { ...prev };
        if (fieldName in newErrors) {
          return Object.fromEntries(
            Object.entries(newErrors).filter(([key]) => key !== fieldName)
          );
        }
        return newErrors;
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.issues.find(
          (err) =>
            err.path && err.path.length > 0 && String(err.path[0]) === fieldName
        );

        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: fieldError.message,
          }));
        }
      }
    }
  };

  useEffect(() => {
    if (filledFormValues) {
      setName(filledFormValues.name || '');
      setEmail(filledFormValues.email || '');
      setPassword(filledFormValues.password || '');
      setConfirmPassword(filledFormValues.confirmPassword || '');
      setAge(filledFormValues.age || 0);
      setGender(filledFormValues.gender || '');
      setTerms(filledFormValues.terms || false);
      setImageBase64(filledFormValues.imageBase64 || '');
      setCountry(filledFormValues.country || '');
    }
  }, [filledFormValues]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsValidating(true);

    const formData: FormSchema = {
      name,
      email,
      password,
      age,
      confirmPassword,
      gender,
      terms,
      imageBase64,
      country,
    };

    try {
      const validatedData = formSchema.parse(formData);

      setErrors({});
      dispatch(setFormValue(validatedData));
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const fieldName = String(err.path[0]);
            newErrors[fieldName] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const genderOptions = [
    { value: '', label: 'Select gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'prefer-not-to-disclose', label: 'Prefer not to disclose' },
  ];

  return (
    <form onSubmit={handleSubmit} className="form">
      <UncontrolledInputField
        id="name"
        label="Name"
        type="text"
        value={name}
        onChange={(value) => {
          setName(value as string);
          validateField('name', value);
        }}
        placeholder="Enter your name"
        error={errors.name}
      />

      <UncontrolledInputField
        id="age"
        label="Age"
        type="number"
        value={age}
        onChange={(value) => {
          const numericValue = value === '' ? 0 : Number(value);
          setAge(numericValue);
          validateField('age', numericValue);
        }}
        placeholder="Enter your age"
        error={errors.age}
      />

      <UncontrolledInputField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(value) => {
          setEmail(value as string);
          validateField('email', value);
        }}
        placeholder="Enter your email"
        error={errors.email}
      />

      <UncontrolledInputField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(value) => {
          setPassword(value as string);
          validateField('password', value);
        }}
        placeholder="Enter your password"
        error={errors.password}
      />

      <UncontrolledInputField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(value) => {
          setConfirmPassword(value as string);
          validateField('confirmPassword', value);
        }}
        placeholder="Confirm your password"
        error={errors.confirmPassword}
      />

      <UncontrolledSelectField
        id="gender"
        label="Gender"
        value={gender}
        onChange={(value) => {
          setGender(value);
          validateField('gender', value);
        }}
        options={genderOptions}
        error={errors.gender}
      />

      <UncontrolledCheckboxField
        id="terms"
        label="I agree to the terms and conditions"
        value={terms}
        onChange={(value) => {
          setTerms(value);
          validateField('terms', value);
        }}
        error={errors.terms}
      />

      <UncontrolledImageField
        id="image"
        label="Profile Image"
        value={imageBase64}
        onChange={(value) => {
          setImageBase64(value);
          validateField('imageBase64', value);
        }}
        error={errors.imageBase64}
      />

      <UncontrolledCountryField
        value={country}
        onChange={(value) => {
          setCountry(value);
          validateField('country', value);
        }}
        error={errors.country}
      />

      <button type="submit">{isValidating ? 'Validating...' : 'Submit'}</button>
    </form>
  );
}

export default UncontrolledForm;
