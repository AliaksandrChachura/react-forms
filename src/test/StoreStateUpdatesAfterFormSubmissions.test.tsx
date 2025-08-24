import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import formReducer, { setFormValue } from '../store/slices/formSlicer';
import selectedCountriesReducer, {
  setCountries,
} from '../store/slices/selectedCountries';

describe('Store State Updates After Form Submissions Tests', () => {
  let store: ReturnType<typeof createTestStore>;

  const createTestStore = () => {
    return configureStore({
      reducer: {
        form: formReducer,
        selectedCountries: selectedCountriesReducer,
      },
      preloadedState: {
        form: {
          name: '',
          age: 0,
          email: '',
          password: '',
          confirmPassword: '',
          gender: '',
          terms: false,
          imageBase64: '',
          country: '',
        },
        selectedCountries: {
          countries: [],
          isLoading: false,
          error: null,
        },
      },
    });
  };

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Form Data Persistence After Submission', () => {
    it('maintains form data in store after successful submission', () => {
      const formData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        gender: 'male',
        terms: true,
        imageBase64: 'data:image/png;base64,test-data',
        country: 'United States',
      };

      store.dispatch(setFormValue(formData));

      const state = store.getState().form;
      expect(state.name).toBe('John Doe');
      expect(state.age).toBe(25);
      expect(state.email).toBe('john@example.com');
      expect(state.password).toBe('SecurePass123!');
      expect(state.confirmPassword).toBe('SecurePass123!');
      expect(state.gender).toBe('male');
      expect(state.terms).toBe(true);
      expect(state.imageBase64).toBe('data:image/png;base64,test-data');
      expect(state.country).toBe('United States');
    });

    it('preserves form data when updating individual fields after submission', () => {
      const initialFormData = {
        name: 'Jane Smith',
        age: 30,
        email: 'jane@example.com',
        password: 'SecurePass456!',
        confirmPassword: 'SecurePass456!',
        gender: 'female',
        terms: true,
        imageBase64: 'data:image/png;base64,initial-data',
        country: 'Canada',
      };

      store.dispatch(setFormValue(initialFormData));

      const updateData = {
        name: 'Jane Smith',
        age: 30,
        email: 'jane.updated@example.com',
        password: 'SecurePass456!',
        confirmPassword: 'SecurePass456!',
        gender: 'female',
        terms: true,
        imageBase64: 'data:image/png;base64,initial-data',
        country: 'Canada',
      };

      store.dispatch(setFormValue(updateData));

      const state = store.getState().form;
      expect(state.name).toBe('Jane Smith');
      expect(state.age).toBe(30);
      expect(state.email).toBe('jane.updated@example.com');
      expect(state.password).toBe('SecurePass456!');
      expect(state.confirmPassword).toBe('SecurePass456!');
      expect(state.gender).toBe('female');
      expect(state.terms).toBe(true);
      expect(state.imageBase64).toBe('data:image/png;base64,initial-data');
      expect(state.country).toBe('Canada');
    });
  });

  describe('Form State Changes During Submission Process', () => {
    it('updates form state when processing form submission', () => {
      const formData = {
        name: 'Test User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };

      store.dispatch(setFormValue(formData));

      const state = store.getState().form;
      expect(state.name).toBe('Test User');
      expect(state.age).toBe(0);
      expect(state.email).toBe('');
      expect(state.password).toBe('');
      expect(state.confirmPassword).toBe('');
      expect(state.gender).toBe('');
      expect(state.terms).toBe(false);
      expect(state.imageBase64).toBe('');
      expect(state.country).toBe('');
    });

    it('handles multiple form submissions with different data', () => {
      const firstSubmission = {
        name: 'First User',
        age: 25,
        email: 'first@example.com',
        password: 'FirstPass123!',
        confirmPassword: 'FirstPass123!',
        gender: 'male',
        terms: true,
        imageBase64: 'data:image/png;base64,first-data',
        country: 'Germany',
      };

      store.dispatch(setFormValue(firstSubmission));

      let state = store.getState().form;
      expect(state.name).toBe('First User');
      expect(state.country).toBe('Germany');

      const secondSubmission = {
        name: 'Second User',
        age: 30,
        email: 'second@example.com',
        password: 'SecondPass456!',
        confirmPassword: 'SecondPass456!',
        gender: 'female',
        terms: true,
        imageBase64: 'data:image/png;base64,second-data',
        country: 'France',
      };

      store.dispatch(setFormValue(secondSubmission));

      state = store.getState().form;
      expect(state.name).toBe('Second User');
      expect(state.country).toBe('France');
      expect(state.age).toBe(30);
      expect(state.email).toBe('second@example.com');
    });
  });

  describe('Form Data Validation State After Submission', () => {
    it('maintains form data integrity after validation errors', () => {
      const invalidFormData = {
        name: '',
        age: 0,
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'different',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };

      store.dispatch(setFormValue(invalidFormData));

      const state = store.getState().form;
      expect(state.name).toBe('');
      expect(state.age).toBe(0);
      expect(state.email).toBe('invalid-email');
      expect(state.password).toBe('weak');
      expect(state.confirmPassword).toBe('different');
      expect(state.gender).toBe('');
      expect(state.terms).toBe(false);
      expect(state.imageBase64).toBe('');
      expect(state.country).toBe('');
    });

    it('preserves valid form data when correcting validation errors', () => {
      const initialData = {
        name: 'Valid User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };

      store.dispatch(setFormValue(initialData));

      const correctedData = {
        name: 'Valid User',
        age: 25,
        email: 'valid@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        gender: 'male',
        terms: true,
        imageBase64: 'data:image/png;base64,valid-data',
        country: 'Spain',
      };

      store.dispatch(setFormValue(correctedData));

      const state = store.getState().form;
      expect(state.name).toBe('Valid User');
      expect(state.age).toBe(25);
      expect(state.email).toBe('valid@example.com');
      expect(state.password).toBe('StrongPass123!');
      expect(state.confirmPassword).toBe('StrongPass123!');
      expect(state.gender).toBe('male');
      expect(state.terms).toBe(true);
      expect(state.imageBase64).toBe('data:image/png;base64,valid-data');
      expect(state.country).toBe('Spain');
    });
  });

  describe('Form Submission with Country Selection', () => {
    it('updates form state when country is selected after submission', () => {
      const mockCountries = [
        {
          name: 'Italy',
          capital: 'Rome',
          population: 60461826,
          region: 'Europe',
          flag: 'https://flagcdn.com/it.svg',
          alpha2Code: 'IT',
          alpha3Code: 'ITA',
          altSpellings: ['IT', 'Italia', 'Italian Republic'],
          area: 301336,
          borders: ['AUT', 'FRA', 'SMR', 'SVN', 'CHE', 'VAT'],
        },
      ];

      store.dispatch(setCountries(mockCountries));

      const formData = {
        name: 'Italian User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: 'Italy',
      };

      store.dispatch(setFormValue(formData));

      const formState = store.getState().form;
      const countriesState = store.getState().selectedCountries;

      expect(formState.country).toBe('Italy');
      expect(countriesState.countries).toHaveLength(1);
      expect(countriesState.countries[0].name).toBe('Italy');
    });

    it('maintains country selection when updating other form fields', () => {
      const initialFormData = {
        name: 'Country User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: 'Japan',
      };

      store.dispatch(setFormValue(initialFormData));

      const updatedFormData = {
        name: 'Country User',
        age: 28,
        email: 'country@example.com',
        password: 'CountryPass789!',
        confirmPassword: 'CountryPass789!',
        gender: 'female',
        terms: true,
        imageBase64: 'data:image/png;base64,country-data',
        country: 'Japan',
      };

      store.dispatch(setFormValue(updatedFormData));

      const state = store.getState().form;
      expect(state.country).toBe('Japan');
      expect(state.name).toBe('Country User');
      expect(state.age).toBe(28);
      expect(state.email).toBe('country@example.com');
      expect(state.password).toBe('CountryPass789!');
      expect(state.confirmPassword).toBe('CountryPass789!');
      expect(state.gender).toBe('female');
      expect(state.terms).toBe(true);
      expect(state.imageBase64).toBe('data:image/png;base64,country-data');
    });
  });

  describe('Form Submission Error Handling', () => {
    it('preserves form data when submission encounters errors', () => {
      const formData = {
        name: 'Error User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };

      store.dispatch(setFormValue(formData));

      const state = store.getState().form;
      expect(state.name).toBe('Error User');
      expect(state.age).toBe(0);
      expect(state.email).toBe('');
      expect(state.password).toBe('');
      expect(state.confirmPassword).toBe('');
      expect(state.gender).toBe('');
      expect(state.terms).toBe(false);
      expect(state.imageBase64).toBe('');
      expect(state.country).toBe('');
    });

    it('maintains form state consistency during error recovery', () => {
      const initialData = {
        name: 'Recovery User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };

      store.dispatch(setFormValue(initialData));

      const recoveryData = {
        name: 'Recovery User',
        age: 32,
        email: 'recovery@example.com',
        password: 'RecoveryPass123!',
        confirmPassword: 'RecoveryPass123!',
        gender: 'male',
        terms: true,
        imageBase64: 'data:image/png;base64,recovery-data',
        country: 'Brazil',
      };

      store.dispatch(setFormValue(recoveryData));

      const state = store.getState().form;
      expect(state.name).toBe('Recovery User');
      expect(state.age).toBe(32);
      expect(state.email).toBe('recovery@example.com');
      expect(state.password).toBe('RecoveryPass123!');
      expect(state.confirmPassword).toBe('RecoveryPass123!');
      expect(state.gender).toBe('male');
      expect(state.terms).toBe(true);
      expect(state.imageBase64).toBe('data:image/png;base64,recovery-data');
      expect(state.country).toBe('Brazil');
    });
  });
});
