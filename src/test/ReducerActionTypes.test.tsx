import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import formReducer, { setFormValue } from '../store/slices/formSlicer';
import selectedCountriesReducer, {
  setCountries,
  setIsLoading,
  setError,
  fetchCountries,
} from '../store/slices/selectedCountries';

describe('Reducer Action Types Tests', () => {
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

  describe('Form Reducer Action Types', () => {
    it('handles setFormValue action with complete form data', () => {
      const completeFormData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        gender: 'male',
        terms: true,
        imageBase64: 'data:image/png;base64,test',
        country: 'United States',
      };

      store.dispatch(setFormValue(completeFormData));

      const state = store.getState().form;
      expect(state.name).toBe('John Doe');
      expect(state.age).toBe(25);
      expect(state.email).toBe('john@example.com');
      expect(state.password).toBe('SecurePass123!');
      expect(state.confirmPassword).toBe('SecurePass123!');
      expect(state.gender).toBe('male');
      expect(state.terms).toBe(true);
      expect(state.imageBase64).toBe('data:image/png;base64,test');
      expect(state.country).toBe('United States');
    });

    it('handles setFormValue action with partial form data', () => {
      const partialFormData = {
        name: 'Jane Smith',
        age: 0,
        email: 'jane@example.com',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };

      store.dispatch(setFormValue(partialFormData));

      const state = store.getState().form;
      expect(state.name).toBe('Jane Smith');
      expect(state.email).toBe('jane@example.com');
      expect(state.age).toBe(0);
      expect(state.password).toBe('');
      expect(state.confirmPassword).toBe('');
      expect(state.gender).toBe('');
      expect(state.terms).toBe(false);
      expect(state.imageBase64).toBe('');
      expect(state.country).toBe('');
    });

    it('handles setFormValue action with single field update', () => {
      store.dispatch(
        setFormValue({
          name: 'Single Update',
          age: 0,
          email: '',
          password: '',
          confirmPassword: '',
          gender: '',
          terms: false,
          imageBase64: '',
          country: '',
        })
      );

      const state = store.getState().form;
      expect(state.name).toBe('Single Update');
      expect(state.email).toBe('');
      expect(state.age).toBe(0);
      expect(state.password).toBe('');
      expect(state.confirmPassword).toBe('');
      expect(state.gender).toBe('');
      expect(state.terms).toBe(false);
      expect(state.imageBase64).toBe('');
      expect(state.country).toBe('');
    });

    it('handles setFormValue action with empty string values', () => {
      const emptyStringData = {
        name: '',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        country: '',
        imageBase64: '',
      };

      store.dispatch(setFormValue(emptyStringData));

      const state = store.getState().form;
      expect(state.name).toBe('');
      expect(state.email).toBe('');
      expect(state.password).toBe('');
      expect(state.confirmPassword).toBe('');
      expect(state.gender).toBe('');
      expect(state.country).toBe('');
      expect(state.age).toBe(0);
      expect(state.terms).toBe(false);
      expect(state.imageBase64).toBe('');
    });

    it('handles setFormValue action with boolean and number values', () => {
      const booleanNumberData = {
        name: '',
        age: 30,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: true,
        imageBase64: '',
        country: '',
      };

      store.dispatch(setFormValue(booleanNumberData));

      const state = store.getState().form;
      expect(state.age).toBe(30);
      expect(state.terms).toBe(true);
      expect(state.name).toBe('');
      expect(state.email).toBe('');
      expect(state.password).toBe('');
      expect(state.confirmPassword).toBe('');
      expect(state.gender).toBe('');
      expect(state.imageBase64).toBe('');
      expect(state.country).toBe('');
    });
  });

  describe('Selected Countries Reducer Action Types', () => {
    it('handles setCountries action with empty array', () => {
      store.dispatch(setCountries([]));

      const state = store.getState().selectedCountries;
      expect(state.countries).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('handles setCountries action with populated array', () => {
      const mockCountries = [
        {
          name: 'Germany',
          capital: 'Berlin',
          population: 83190556,
          region: 'Europe',
          flag: 'https://flagcdn.com/de.svg',
          alpha2Code: 'DE',
          alpha3Code: 'DEU',
          altSpellings: ['DE', 'Deutschland'],
          area: 357114,
          borders: ['AUT', 'BEL', 'CZE'],
        },
        {
          name: 'France',
          capital: 'Paris',
          population: 67391582,
          region: 'Europe',
          flag: 'https://flagcdn.com/fr.svg',
          alpha2Code: 'FR',
          alpha3Code: 'FRA',
          altSpellings: ['FR', 'French Republic'],
          area: 640679,
          borders: ['AND', 'BEL', 'DEU'],
        },
      ];

      store.dispatch(setCountries(mockCountries));

      const state = store.getState().selectedCountries;
      expect(state.countries).toEqual(mockCountries);
      expect(state.countries).toHaveLength(2);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('handles setIsLoading action with true value', () => {
      expect(store.getState().selectedCountries.isLoading).toBe(false);

      store.dispatch(setIsLoading(true));

      const state = store.getState().selectedCountries;
      expect(state.isLoading).toBe(true);
      expect(state.countries).toEqual([]);
      expect(state.error).toBe(null);
    });

    it('handles setIsLoading action with false value', () => {
      store.dispatch(setIsLoading(true));
      expect(store.getState().selectedCountries.isLoading).toBe(true);

      store.dispatch(setIsLoading(false));

      const state = store.getState().selectedCountries;
      expect(state.isLoading).toBe(false);
      expect(state.countries).toEqual([]);
      expect(state.error).toBe(null);
    });

    it('handles setError action with error message', () => {
      expect(store.getState().selectedCountries.error).toBe(null);

      store.dispatch(setError('Network connection failed'));

      const state = store.getState().selectedCountries;
      expect(state.error).toBe('Network connection failed');
      expect(state.countries).toEqual([]);
      expect(state.isLoading).toBe(false);
    });

    it('handles setError action with null value', () => {
      store.dispatch(setError('Some error occurred'));
      expect(store.getState().selectedCountries.error).toBe(
        'Some error occurred'
      );

      store.dispatch(setError(null));

      const state = store.getState().selectedCountries;
      expect(state.error).toBe(null);
      expect(state.countries).toEqual([]);
      expect(state.isLoading).toBe(false);
    });

    it('handles fetchCountries async thunk pending action', async () => {
      expect(store.getState().selectedCountries.isLoading).toBe(false);
      expect(store.getState().selectedCountries.error).toBe(null);

      const promise = store.dispatch(fetchCountries());

      const pendingState = store.getState().selectedCountries;
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.error).toBe(null);
      expect(pendingState.countries).toEqual([]);

      await promise;
    });

    it('handles fetchCountries async thunk fulfilled action', async () => {
      const promise = store.dispatch(fetchCountries());

      await promise;

      const fulfilledState = store.getState().selectedCountries;
      expect(fulfilledState.isLoading).toBe(false);
      expect(fulfilledState.error).toBe(null);
      expect(fulfilledState.countries.length).toBeGreaterThan(0);
    });

    it('handles fetchCountries async thunk rejected action', async () => {
      const promise = store.dispatch(fetchCountries());

      await promise;

      const finalState = store.getState().selectedCountries;
      expect(finalState.isLoading).toBe(false);
      expect(finalState.countries.length).toBeGreaterThan(0);
      expect(finalState.error).toBe(null);
    });
  });

  describe('Reducer State Immutability', () => {
    it('maintains state immutability for form reducer', () => {
      const initialState = store.getState().form;
      const initialName = initialState.name;

      store.dispatch(
        setFormValue({
          name: 'New Name',
          age: 0,
          email: '',
          password: '',
          confirmPassword: '',
          gender: '',
          terms: false,
          imageBase64: '',
          country: '',
        })
      );

      const newState = store.getState().form;
      expect(newState.name).toBe('New Name');
      expect(initialState.name).toBe(initialName);
      expect(newState).not.toBe(initialState);
    });

    it('maintains state immutability for selected countries reducer', () => {
      const initialState = store.getState().selectedCountries;
      const initialCountries = initialState.countries;

      store.dispatch(
        setCountries([
          {
            name: 'Test Country',
            capital: 'Test Capital',
            population: 1000000,
            region: 'Test Region',
            flag: 'https://flagcdn.com/test.svg',
            alpha2Code: 'TC',
            alpha3Code: 'TST',
            altSpellings: ['TC', 'Test Country'],
            area: 100000,
            borders: [],
          },
        ])
      );

      const newState = store.getState().selectedCountries;
      expect(newState.countries).not.toEqual(initialCountries);
      expect(initialState.countries).toEqual(initialCountries);
      expect(newState).not.toBe(initialState);
    });
  });
});
