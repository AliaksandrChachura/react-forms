import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import formReducer, { setFormValue } from '../store/slices/formSlicer';
import selectedCountriesReducer, {
  setCountries,
  setIsLoading,
  setError,
  fetchCountries,
} from '../store/slices/selectedCountries';

describe('Actions and Action Creators Tests', () => {
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

  describe('Form Actions and Action Creators', () => {
    it('sets form values using setFormValue', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        gender: 'male',
        terms: true,
        country: 'United States',
      };

      store.dispatch(setFormValue(formData));

      const state = store.getState().form;
      expect(state.name).toBe('John Doe');
      expect(state.email).toBe('john@example.com');
      expect(state.age).toBe(25);
      expect(state.password).toBe('TestPass123!');
      expect(state.confirmPassword).toBe('TestPass123!');
      expect(state.gender).toBe('male');
      expect(state.terms).toBe(true);
      expect(state.country).toBe('United States');
    });

    it('updates partial form data', () => {
      const partialData = {
        name: 'Partial Update',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };
      store.dispatch(setFormValue(partialData));

      const state = store.getState().form;
      expect(state.name).toBe('Partial Update');
      expect(state.email).toBe('');
      expect(state.age).toBe(0);
      expect(state.password).toBe('');
      expect(state.confirmPassword).toBe('');
      expect(state.gender).toBe('');
      expect(state.terms).toBe(false);
      expect(state.imageBase64).toBe('');
      expect(state.country).toBe('');
    });

    it('overwrites existing form data completely', () => {
      const initialData = {
        name: 'Initial Name',
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
      expect(store.getState().form.name).toBe('Initial Name');

      const updateData = {
        name: 'Initial Name',
        email: 'test@example.com',
        age: 30,
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };
      store.dispatch(setFormValue(updateData));
      const state = store.getState().form;
      expect(state.name).toBe('Initial Name');
      expect(state.email).toBe('test@example.com');
      expect(state.age).toBe(30);
    });
  });

  describe('Selected Countries Actions and Action Creators', () => {
    it('sets countries directly using setCountries', () => {
      const mockCountries = [
        {
          name: 'United States',
          capital: 'Washington, D.C.',
          population: 331002651,
          region: 'Americas',
          flag: 'https://flagcdn.com/us.svg',
          alpha2Code: 'US',
          alpha3Code: 'USA',
          altSpellings: ['US', 'USA', 'United States of America'],
          area: 9629091,
          borders: ['CAN', 'MEX'],
        },
        {
          name: 'Canada',
          capital: 'Ottawa',
          population: 38005238,
          region: 'Americas',
          flag: 'https://flagcdn.com/ca.svg',
          alpha2Code: 'CA',
          alpha3Code: 'CAN',
          altSpellings: ['CA', 'CAN', 'Canada'],
          area: 9984670,
          borders: ['USA'],
        },
      ];

      store.dispatch(setCountries(mockCountries));

      const state = store.getState().selectedCountries;
      expect(state.countries).toEqual(mockCountries);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('sets loading state using setIsLoading', () => {
      expect(store.getState().selectedCountries.isLoading).toBe(false);

      store.dispatch(setIsLoading(true));
      expect(store.getState().selectedCountries.isLoading).toBe(true);

      store.dispatch(setIsLoading(false));
      expect(store.getState().selectedCountries.isLoading).toBe(false);
    });

    it('sets and clears error state using setError', () => {
      expect(store.getState().selectedCountries.error).toBe(null);

      store.dispatch(setError('Network error'));
      expect(store.getState().selectedCountries.error).toBe('Network error');

      store.dispatch(setError(null));
      expect(store.getState().selectedCountries.error).toBe(null);
    });

    it('handles async thunk fetchCountries', async () => {
      expect(store.getState().selectedCountries.isLoading).toBe(false);
      expect(store.getState().selectedCountries.countries).toEqual([]);

      const promise = store.dispatch(fetchCountries());
      expect(store.getState().selectedCountries.isLoading).toBe(true);

      await promise;
      const state = store.getState().selectedCountries;
      expect(state.isLoading).toBe(false);
      expect(state.countries.length).toBeGreaterThan(0);
      expect(state.error).toBe(null);
    });

    it('maintains state consistency across multiple actions', () => {
      const mockCountries = [
        {
          name: 'Germany',
          capital: 'Berlin',
          population: 83190556,
          region: 'Europe',
          flag: 'https://flagcdn.com/de.svg',
          alpha2Code: 'DE',
          alpha3Code: 'DEU',
          altSpellings: ['DE', 'Deutschland', 'Federal Republic of Germany'],
          area: 357114,
          borders: [
            'AUT',
            'BEL',
            'CZE',
            'DNK',
            'FRA',
            'LUX',
            'NLD',
            'POL',
            'CHE',
          ],
        },
        {
          name: 'France',
          capital: 'Paris',
          population: 67391582,
          region: 'Europe',
          flag: 'https://flagcdn.com/fr.svg',
          alpha2Code: 'FR',
          alpha3Code: 'FRA',
          altSpellings: ['FR', 'French Republic', 'République française'],
          area: 640679,
          borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
        },
      ];

      store.dispatch(setCountries(mockCountries));
      store.dispatch(setIsLoading(true));
      store.dispatch(setError('Some error'));

      let state = store.getState().selectedCountries;
      expect(state.countries).toEqual(mockCountries);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe('Some error');

      store.dispatch(setIsLoading(false));
      store.dispatch(setError(null));

      state = store.getState().selectedCountries;
      expect(state.countries).toEqual(mockCountries);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('Action Creator Function Signatures', () => {
    it('form action creators have correct parameter types', () => {
      expect(typeof setFormValue).toBe('function');
    });

    it('selected countries action creators have correct parameter types', () => {
      expect(typeof setCountries).toBe('function');
      expect(typeof setIsLoading).toBe('function');
      expect(typeof setError).toBe('function');
      expect(typeof fetchCountries).toBe('function');
    });
  });
});
