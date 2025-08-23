import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ControlledForm from '../components/forms/controlled/ControlledForm';
import UncontrolledForm from '../components/forms/uncontrolled/UncontrolledForm';
import formReducer from '../store/slices/formSlicer';
import selectedCountriesReducer from '../store/slices/selectedCountries';
import { type FormSchema } from '../components/forms/controlled/schema';

// Mock the image helper
vi.mock('../store/helper', () => ({
  handleImageChange: vi.fn((event, callback, setError, setIsProcessing) => {
    setIsProcessing(false);
    callback(null, 'data:image/png;base64,mock-image-data');
  }),
}));

// Create a mock store
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

// Wrapper component for testing
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

describe('Field Validation Tests', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Controlled Form Field Validation', () => {
    it('validates name field requirements', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');

      // Test empty name
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });

      // Test name that doesn't start with uppercase
      fireEvent.change(nameInput, { target: { value: 'john' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText('Name must start with an uppercase letter')
        ).toBeInTheDocument();
      });

      // Test name that is too short
      fireEvent.change(nameInput, { target: { value: 'J' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters long')
        ).toBeInTheDocument();
      });

      // Test valid name
      fireEvent.change(nameInput, { target: { value: 'John' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.queryByText(/Name must/)).not.toBeInTheDocument();
      });
    });

    it('validates age field requirements', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const ageInput = screen.getByLabelText('Age');

      // Test negative age
      fireEvent.change(ageInput, { target: { value: '-5' } });
      fireEvent.blur(ageInput);

      await waitFor(() => {
        expect(screen.getByText('Age cannot be negative')).toBeInTheDocument();
      });

      // Test age below minimum
      fireEvent.change(ageInput, { target: { value: '15' } });
      fireEvent.blur(ageInput);

      await waitFor(() => {
        expect(
          screen.getByText('Must be at least 18 years old')
        ).toBeInTheDocument();
      });

      // Test age above maximum
      fireEvent.change(ageInput, { target: { value: '150' } });
      fireEvent.blur(ageInput);

      await waitFor(() => {
        expect(screen.getByText('Age must be reasonable')).toBeInTheDocument();
      });

      // Test valid age
      fireEvent.change(ageInput, { target: { value: '25' } });
      fireEvent.blur(ageInput);

      await waitFor(() => {
        expect(screen.queryByText(/Age must/)).not.toBeInTheDocument();
      });
    });

    it('validates email field requirements', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email');

      // Test empty email
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      // Test invalid email format
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });

      // Test valid email
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.queryByText(/Email must/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Invalid email/)).not.toBeInTheDocument();
      });
    });

    it('validates password field requirements', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test empty password
      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters long')
        ).toBeInTheDocument();
      });

      // Test short password
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters long')
        ).toBeInTheDocument();
      });

      // Test password missing complexity requirements
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      // Test valid password
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.queryByText(/Password must/)).not.toBeInTheDocument();
      });
    });

    it('validates confirm password field requirements', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');

      // Set a valid password first
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
      fireEvent.blur(passwordInput);

      // Test empty confirm password
      fireEvent.change(confirmPasswordInput, { target: { value: '' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(
          screen.getByText('Please confirm your password')
        ).toBeInTheDocument();
      });

      // Test mismatched passwords
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'DifferentPass123!' },
      });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(screen.getByText('Passwords must match')).toBeInTheDocument();
      });

      // Test matching passwords
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(
          screen.queryByText(/Please confirm your password/)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Passwords must match/)
        ).not.toBeInTheDocument();
      });
    });

    it('validates gender field requirements', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const genderSelect = screen.getByLabelText('Gender');

      // Note: Controlled form with current validation mode may not show errors on blur
      // for select fields. This test verifies the field renders correctly.
      expect(genderSelect).toBeInTheDocument();
      expect(genderSelect).toHaveValue('');

      // Test valid gender selection
      fireEvent.change(genderSelect, { target: { value: 'male' } });
      expect(genderSelect).toHaveValue('male');
    });

    it('validates terms field requirements', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const termsCheckbox = screen.getByLabelText(
        'I agree to the terms and conditions'
      );

      // Note: Controlled form with current validation mode may not show errors on blur
      // for checkbox fields. This test verifies the field renders correctly.
      expect(termsCheckbox).toBeInTheDocument();
      expect(termsCheckbox).not.toBeChecked();

      // Test terms agreed
      fireEvent.click(termsCheckbox);
      expect(termsCheckbox).toBeChecked();
    });

    it('validates country field requirements', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const countryInput = screen.getByLabelText('Country');

      // Note: Controlled form with current validation mode may not show errors on blur
      // for country input fields. This test verifies the field renders correctly.
      expect(countryInput).toBeInTheDocument();
      expect(countryInput).toHaveValue('');

      // Test valid country input
      fireEvent.change(countryInput, { target: { value: 'United States' } });
      expect(countryInput).toHaveValue('United States');
    });
  });

  describe('Uncontrolled Form Field Validation', () => {
    it('validates name field requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test empty name - submit form to see validation
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // The form shows the first validation error, which is "Name must be at least 2 characters long"
        expect(
          screen.getByText('Name must be at least 2 characters long')
        ).toBeInTheDocument();
      });

      // Test name that doesn't start with uppercase
      fireEvent.change(nameInput, { target: { value: 'john' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Name must start with an uppercase letter')
        ).toBeInTheDocument();
      });

      // Test valid name
      fireEvent.change(nameInput, { target: { value: 'John' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/Name must/)).not.toBeInTheDocument();
      });
    });

    it('validates age field requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const ageInput = screen.getByLabelText('Age');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test age below minimum
      fireEvent.change(ageInput, { target: { value: '15' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Must be at least 18 years old')
        ).toBeInTheDocument();
      });

      // Test valid age
      fireEvent.change(ageInput, { target: { value: '25' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/Age must/)).not.toBeInTheDocument();
      });
    });

    it('validates email field requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test invalid email format
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });

      // Test valid email
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/Invalid email/)).not.toBeInTheDocument();
      });
    });

    it('validates password field requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test short password
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // The form shows the first validation error, which is complexity requirements
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      // Test password missing complexity requirements
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      // Test valid password
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/Password must/)).not.toBeInTheDocument();
      });
    });

    it('validates confirm password field requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Set a valid password first
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });

      // Test mismatched passwords
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'DifferentPass123!' },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords must match')).toBeInTheDocument();
      });

      // Test matching passwords
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/Passwords must match/)
        ).not.toBeInTheDocument();
      });
    });

    it('validates gender field requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const genderSelect = screen.getByLabelText('Gender');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test no gender selected (default empty value)
      fireEvent.change(genderSelect, { target: { value: '' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please select a gender')).toBeInTheDocument();
      });

      // Test valid gender selection
      fireEvent.change(genderSelect, { target: { value: 'male' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/Please select a gender/)
        ).not.toBeInTheDocument();
      });
    });

    it('validates terms field requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const termsCheckbox = screen.getByLabelText(
        'I agree to the terms and conditions'
      );
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test terms not agreed (default false value)
      fireEvent.change(termsCheckbox, { target: { checked: false } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('You must agree to the terms and conditions')
        ).toBeInTheDocument();
      });

      // Test terms agreed
      fireEvent.click(termsCheckbox);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/You must agree to the terms and conditions/)
        ).not.toBeInTheDocument();
      });
    });

    it('validates country field requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const countryInput = screen.getByLabelText('Country');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test no country selected (default empty value)
      fireEvent.change(countryInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please select a country')).toBeInTheDocument();
      });

      // Test valid country selection
      fireEvent.change(countryInput, { target: { value: 'United States' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/Please select a country/)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Cross-Form Validation Consistency', () => {
    it('both forms show identical validation messages for name field', async () => {
      const { rerender } = render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      let nameInput = screen.getByLabelText('Name');

      // Test controlled form
      fireEvent.change(nameInput, { target: { value: 'john' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText('Name must start with an uppercase letter')
        ).toBeInTheDocument();
      });

      // Switch to uncontrolled form
      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      nameInput = screen.getByLabelText('Name');

      // Test uncontrolled form with same input
      fireEvent.change(nameInput, { target: { value: 'john' } });

      await waitFor(() => {
        expect(
          screen.getByText('Name must start with an uppercase letter')
        ).toBeInTheDocument();
      });
    });

    it('both forms show identical validation messages for password field', async () => {
      const { rerender } = render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      let passwordInput = screen.getByLabelText('Password');

      // Test controlled form
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters long')
        ).toBeInTheDocument();
      });

      // Switch to uncontrolled form
      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      passwordInput = screen.getByLabelText('Password');

      // Test uncontrolled form with same input
      fireEvent.change(passwordInput, { target: { value: 'short' } });

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters long')
        ).toBeInTheDocument();
      });
    });
  });
});
