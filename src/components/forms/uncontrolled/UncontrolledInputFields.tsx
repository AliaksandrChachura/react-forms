import { type Country } from '../../../store/types';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { useState, useRef, useEffect } from 'react';
import { handleImageChange } from '../../../store/helper';
import {
  type UncontrolledInputFieldProps,
  type UncontrolledSelectFieldProps,
  type UncontrolledCheckboxFieldProps,
} from './types';

function UncontrolledInputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  accept,
  error,
}: UncontrolledInputFieldProps & { error?: string }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value || ''}
        onChange={(e) => {
          if (type === 'number') {
            onChange(e.target.value ? Number(e.target.value) : null);
          } else {
            onChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        accept={accept}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function UncontrolledSelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: UncontrolledSelectFieldProps & { error?: string }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function UncontrolledCheckboxField({
  id,
  label,
  value,
  onChange,
  error,
}: UncontrolledCheckboxFieldProps & { error?: string }) {
  return (
    <div className="form-field">
      <div className="checkbox-field">
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function UncontrolledCountryField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const { countries, isLoading } = useSelector(
    (state: RootState) => state.selectedCountries
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value, searchTerm]);

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
    onChange(country.name);
    setIsOpen(false);
  };

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
            onChange(e.target.value);
            setIsOpen(true);
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
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                  <span className="country-code">({country.alpha2Code})</span>
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
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function UncontrolledImageField({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (base64: string) => void;
  error?: string;
}) {
  const [validationError, setValidationError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageChangeWrapper = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await handleImageChange(
      e,
      (_: 'imageBase64', value: string) => {
        onChange(value);
      },
      setValidationError,
      setIsProcessing
    );
  };

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleImageChangeWrapper}
        disabled={isProcessing}
      />
      {isProcessing && <div className="processing">Processing image...</div>}
      {validationError && <div className="error">{validationError}</div>}
      {error && <div className="error">{error}</div>}
      {value && !validationError && (
        <div className="image-preview">
          <img
            src={value}
            alt="Preview"
            style={{ maxWidth: '150px', maxHeight: '150px', marginTop: '10px' }}
          />
        </div>
      )}
    </div>
  );
}

export {
  UncontrolledInputField,
  UncontrolledSelectField,
  UncontrolledCheckboxField,
  UncontrolledCountryField,
  UncontrolledImageField,
};
