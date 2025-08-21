import { Controller, useFormContext } from 'react-hook-form';
import { type formValues } from './types';

function NameField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="name"
      render={({ field }) => {
        return (
          <input
            type="text"
            {...field}
            value={field.value || ''}
            placeholder="Name"
          />
        );
      }}
    />
  );
}

function AgeField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="age"
      render={({ field }) => {
        return (
          <input
            type="number"
            {...field}
            value={field.value || ''}
            placeholder="Age"
          />
        );
      }}
    />
  );
}

function EmailField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => {
        return (
          <input
            type="email"
            {...field}
            value={field.value || ''}
            placeholder="Email"
          />
        );
      }}
    />
  );
}

function PasswordField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="password"
      render={({ field }) => {
        return (
          <input
            type="password"
            {...field}
            value={field.value || ''}
            placeholder="Password"
          />
        );
      }}
    />
  );
}

function ConfirmPasswordField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="confirmPassword"
      render={({ field }) => {
        return (
          <input
            type="password"
            {...field}
            value={field.value || ''}
            placeholder="Confirm Password"
          />
        );
      }}
    />
  );
}

function GenderField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="gender"
      render={({ field }) => {
        return (
          <input
            type="text"
            {...field}
            value={field.value || ''}
            placeholder="Gender"
          />
        );
      }}
    />
  );
}

function TermsField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="terms"
      render={({ field }) => (
        <input
          type="checkbox"
          name={field.name}
          ref={field.ref}
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

function ImageField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="image"
      render={({ field }) => (
        <input
          type="file"
          accept="image/png,image/jpeg"
          name={field.name}
          ref={field.ref}
          onChange={(e) => {
            const file = e.currentTarget.files?.[0] ?? null;
            field.onChange(file);
          }}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

function CountryField() {
  const { control } = useFormContext<formValues>();
  return (
    <Controller
      control={control}
      name="country"
      render={({ field }) => <select {...field} />}
    />
  );
}

export {
  NameField,
  AgeField,
  EmailField,
  PasswordField,
  ConfirmPasswordField,
  GenderField,
  TermsField,
  ImageField,
  CountryField,
};
