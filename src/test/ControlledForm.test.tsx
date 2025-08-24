import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ControlledForm from '../components/forms/controlled/ControlledForm';
import formReducer from '../store/slices/formSlicer';
import selectedCountriesReducer from '../store/slices/selectedCountries';
import { type FormSchema } from '../components/forms/controlled/schema';

vi.mock('../store/helper', () => ({
  handleImageChange: vi.fn((_event, callback, _setError, setIsProcessing) => {
    setIsProcessing(false);
    callback(null, 'data:image/png;base64,mock-image-data');
  }),
}));

const createMockStore = (initialState = {}) => {
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
        ...initialState,
      },
      selectedCountries: {
        countries: [
          {
            name: 'United States',
            alpha2Code: 'US',
            flag: '🇺🇸',
            capital: 'Washington, D.C.',
            population: 331002651,
            region: 'Americas',
            alpha3Code: 'USA',
            altSpellings: ['US', 'USA', 'United States of America'],
            area: 9629091,
            borders: ['CAN', 'MEX'],
          },
        ],
        isLoading: false,
        error: null,
      },
    },
  });
};

const TestWrapper = ({
  children,
  initialState = {},
}: {
  children: React.ReactNode;
  initialState?: Partial<FormSchema>;
}) => {
  const store = createMockStore(initialState);
  return <Provider store={store}>{children}</Provider>;
};

describe('Controlled Form Rendering', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required form fields', () => {
    render(
      <TestWrapper>
        <ControlledForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(
      screen.getByLabelText('I agree to the terms and conditions')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Profile Image')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders form with proper field types', () => {
    render(
      <TestWrapper>
        <ControlledForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    );
    expect(screen.getByLabelText('Confirm Password')).toHaveAttribute(
      'type',
      'password'
    );
    expect(screen.getByLabelText('Profile Image')).toHaveAttribute(
      'type',
      'file'
    );

    expect(screen.getByLabelText('Gender')).toBeInstanceOf(HTMLSelectElement);

    expect(
      screen.getByLabelText('I agree to the terms and conditions')
    ).toHaveAttribute('type', 'checkbox');
  });

  it('renders form with proper placeholders', () => {
    render(
      <TestWrapper>
        <ControlledForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Name')).toHaveAttribute(
      'placeholder',
      'Enter your name'
    );
    expect(screen.getByLabelText('Age')).toHaveAttribute(
      'placeholder',
      'Enter your age'
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'placeholder',
      'Enter your email'
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'placeholder',
      'Enter your password'
    );
    expect(screen.getByLabelText('Confirm Password')).toHaveAttribute(
      'placeholder',
      'Confirm your password'
    );
    expect(screen.getByLabelText('Country')).toHaveAttribute(
      'placeholder',
      'Search for a country...'
    );
  });

  it('renders gender options correctly', () => {
    render(
      <TestWrapper>
        <ControlledForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const genderSelect = screen.getByLabelText('Gender');
    expect(genderSelect).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: 'Select gender' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Male' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Female' })).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Prefer not to disclose' })
    ).toBeInTheDocument();
  });

  it('renders form with proper labels', () => {
    render(
      <TestWrapper>
        <ControlledForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Profile Image')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('renders form with proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <ControlledForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const nameInput = screen.getByLabelText('Name');
    const ageInput = screen.getByLabelText('Age');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const genderSelect = screen.getByLabelText('Gender');
    const termsCheckbox = screen.getByLabelText(
      'I agree to the terms and conditions'
    );
    const imageInput = screen.getByLabelText('Profile Image');
    const countryInput = screen.getByLabelText('Country');

    expect(nameInput).toHaveAttribute('id', 'name');
    expect(ageInput).toHaveAttribute('id', 'age');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword');
    expect(genderSelect).toHaveAttribute('id', 'gender');
    expect(termsCheckbox).toHaveAttribute('id', 'terms');
    expect(imageInput).toHaveAttribute('id', 'image');
    expect(countryInput).toHaveAttribute('id', 'country');
  });

  it('renders form with proper CSS classes', () => {
    render(
      <TestWrapper>
        <ControlledForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const nameField = screen.getByLabelText('Name').closest('.form-field');
    const ageField = screen.getByLabelText('Age').closest('.form-field');
    const emailField = screen.getByLabelText('Email').closest('.form-field');

    expect(nameField).toBeInTheDocument();
    expect(ageField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
  });

  it('renders submit button with proper state', () => {
    render(
      <TestWrapper>
        <ControlledForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Submit');
  });
});
