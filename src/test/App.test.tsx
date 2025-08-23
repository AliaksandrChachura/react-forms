import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import formReducer from '../store/slices/formSlicer';
import selectedCountriesReducer from '../store/slices/selectedCountries';

// Create a mock store
const createMockStore = () => {
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

describe('App', () => {
  it('renders without crashing', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Check that the header is rendered with the expected buttons
    expect(screen.getByText('Controlled')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled')).toBeInTheDocument();
  });

  it('renders header component', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Check that the header is rendered with the expected buttons
    expect(screen.getByText('Controlled')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled')).toBeInTheDocument();
  });
});
