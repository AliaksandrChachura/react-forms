import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ControlledForm from '../components/forms/controlled/ControlledForm';
import UncontrolledForm from '../components/forms/uncontrolled/UncontrolledForm';
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

describe('Form Rendering - Both Implementations', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Controlled Form (React Hook Form)', () => {
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

      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
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

    it('renders submit button with proper initial state', () => {
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

  describe('Uncontrolled Form', () => {
    it('renders all required form fields', () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
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

      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('renders form with proper field types', () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
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

    it('renders submit button with proper initial state', () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });

      expect(submitButton).toBeEnabled();
      expect(submitButton).toHaveTextContent('Submit');
    });
  });

  describe('Common Form Features', () => {
    it('both forms have identical field structure', () => {
      const { rerender } = render(
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

      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
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
    });

    it('both forms have identical placeholders', () => {
      const { rerender } = render(
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

      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
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

    it('both forms have identical gender options', () => {
      const { rerender } = render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      expect(
        screen.getByRole('option', { name: 'Select gender' })
      ).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Male' })).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Female' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Prefer not to disclose' })
      ).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      expect(
        screen.getByRole('option', { name: 'Select gender' })
      ).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Male' })).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Female' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Prefer not to disclose' })
      ).toBeInTheDocument();
    });

    it('both forms have identical accessibility attributes', () => {
      const { rerender } = render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'name');
      expect(screen.getByLabelText('Age')).toHaveAttribute('id', 'age');
      expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'id',
        'password'
      );
      expect(screen.getByLabelText('Confirm Password')).toHaveAttribute(
        'id',
        'confirmPassword'
      );
      expect(screen.getByLabelText('Gender')).toHaveAttribute('id', 'gender');
      expect(
        screen.getByLabelText('I agree to the terms and conditions')
      ).toHaveAttribute('id', 'terms');
      expect(screen.getByLabelText('Profile Image')).toHaveAttribute(
        'id',
        'image'
      );
      expect(screen.getByLabelText('Country')).toHaveAttribute('id', 'country');

      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'name');
      expect(screen.getByLabelText('Age')).toHaveAttribute('id', 'age');
      expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'id',
        'password'
      );
      expect(screen.getByLabelText('Confirm Password')).toHaveAttribute(
        'id',
        'confirmPassword'
      );
      expect(screen.getByLabelText('Gender')).toHaveAttribute('id', 'gender');
      expect(
        screen.getByLabelText('I agree to the terms and conditions')
      ).toHaveAttribute('id', 'terms');
      expect(screen.getByLabelText('Profile Image')).toHaveAttribute(
        'id',
        'image'
      );
      expect(screen.getByLabelText('Country')).toHaveAttribute('id', 'country');
    });
  });
});
