import { Controller, useFormContext } from 'react-hook-form';
import { type Country } from '../../../store/types';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { type FormSchema } from './schema';
import { useState, useRef, useEffect } from 'react';
import { handleImageChange } from '../../../store/helper';

function NameField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormSchema>();
  return (
    <Controller
      control={control}
      name="name"
      render={({ field }) => {
        return (
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              {...field}
              value={field.value || ''}
              placeholder="Enter your name"
            />
            {errors.name && <div className="error">{errors.name.message}</div>}
          </div>
        );
      }}
    />
  );
}

function AgeField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormSchema>();
  return (
    <Controller
      control={control}
      name="age"
      render={({ field }) => {
        return (
          <div className="form-field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === '' ? undefined : Number(value));
              }}
              placeholder="Enter your age"
            />
            {errors.age && <div className="error">{errors.age.message}</div>}
          </div>
        );
      }}
    />
  );
}

function EmailField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormSchema>();
  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => {
        return (
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...field}
              value={field.value || ''}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="error">{errors.email.message}</div>
            )}
          </div>
        );
      }}
    />
  );
}

function PasswordField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormSchema>();
  return (
    <Controller
      control={control}
      name="password"
      render={({ field }) => {
        return (
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...field}
              value={field.value || ''}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="error">{errors.password.message}</div>
            )}
          </div>
        );
      }}
    />
  );
}

function ConfirmPasswordField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormSchema>();
  return (
    <Controller
      control={control}
      name="confirmPassword"
      render={({ field }) => {
        return (
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...field}
              value={field.value || ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword.message}</div>
            )}
          </div>
        );
      }}
    />
  );
}

function GenderField() {
  const { control } = useFormContext<FormSchema>();
  return (
    <Controller
      control={control}
      name="gender"
      render={({ field }) => {
        return (
          <div className="form-field">
            <label htmlFor="gender">Gender</label>
            <select id="gender" {...field} value={field.value || ''}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer-not-to-disclose">
                Prefer not to disclose
              </option>
            </select>
          </div>
        );
      }}
    />
  );
}

function TermsField() {
  const { control } = useFormContext<FormSchema>();
  return (
    <Controller
      control={control}
      name="terms"
      render={({ field }) => (
        <div className="form-field checkbox-field">
          <input
            id="terms"
            type="checkbox"
            name={field.name}
            ref={field.ref}
            checked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur}
          />
          <label htmlFor="terms">I agree to the terms and conditions</label>
        </div>
      )}
    />
  );
}

function ImageField() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormSchema>();
  const [validationError, setValidationError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentImageBase64 = watch('imageBase64');

  return (
    <Controller
      control={control}
      name="imageBase64"
      render={() => (
        <div className="form-field">
          <label htmlFor="image">Profile Image</label>
          <input
            id="image"
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={(e) =>
              handleImageChange(
                e,
                (_, value) => setValue('imageBase64', value),
                setValidationError,
                setIsProcessing
              )
            }
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="processing">Processing image...</div>
          )}
          {validationError && <div className="error">{validationError}</div>}
          {errors.imageBase64 && (
            <div className="error">{errors.imageBase64.message}</div>
          )}
          {currentImageBase64 && !validationError && (
            <div className="image-preview">
              <img
                src={currentImageBase64}
                alt="Preview"
                style={{
                  maxWidth: '150px',
                  maxHeight: '150px',
                  marginTop: '10px',
                }}
              />
            </div>
          )}
        </div>
      )}
    />
  );
}

function CountryField() {
  const { control } = useFormContext<FormSchema>();
  const { countries, isLoading } = useSelector(
    (state: RootState) => state.selectedCountries
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries.slice(0, 10));
    } else {
      const filtered = countries
        .filter(
          (country) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.alpha2Code.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10);
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSearchTerm(country.name);
    setIsOpen(false);
  };

  return (
    <Controller
      control={control}
      name="country"
      render={({ field }) => {
        if (field.value && field.value !== searchTerm) {
          setTimeout(() => setSearchTerm(field.value), 0);
        }

        return (
          <div className="form-field">
            <label htmlFor="country">Country</label>
            <div className="autocomplete-container" ref={dropdownRef}>
              <input
                id="country"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                  field.onChange('');
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search for a country..."
                disabled={isLoading}
              />
              {isOpen && (
                <div className="dropdown-list">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <div
                        key={country.alpha2Code}
                        className="dropdown-item"
                        onClick={() => {
                          handleCountrySelect(country);
                          field.onChange(country.name);
                        }}
                      >
                        <span className="country-flag">{country.flag}</span>
                        <span className="country-name">{country.name}</span>
                        <span className="country-code">
                          ({country.alpha2Code})
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item no-results">
                      {searchTerm.trim() === ''
                        ? 'Type to search countries...'
                        : 'No countries found'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }}
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
