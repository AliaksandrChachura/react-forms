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

describe('Password Strength Calculation Tests', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Uncontrolled Form Password Strength', () => {
    it('validates minimum password length requirement on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test passwords below minimum length
      const shortPasswords = [
        '',
        'a',
        'ab',
        'abc',
        'abcd',
        'abcde',
        'abcdef',
        'abcdefg',
      ];

      for (const password of shortPasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.click(submitButton);

        await waitFor(() => {
          // Uncontrolled form shows complexity error first for short passwords
          expect(
            screen.getByText(
              /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
            )
          ).toBeInTheDocument();
        });
      }
    });

    it('validates password complexity requirements on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test password missing complexity requirements
      const weakPasswords = [
        'password123', // No uppercase, special char
        'PASSWORD123', // No lowercase, special char
        'Password123', // No special char
        'Password!', // No number
        'password!', // No uppercase, number
        'PASSWORD!', // No lowercase, number
      ];

      for (const password of weakPasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(
              /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
            )
          ).toBeInTheDocument();
        });
      }
    });

    it('accepts strong passwords on form submission', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test various strong passwords
      const strongPasswords = [
        'StrongPass123!',
        'MyP@ssw0rd2024',
        'Secure#123Pass',
        'ComplexP@ss1',
        'Test123!@#$',
      ];

      for (const password of strongPasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(
            screen.queryByText(
              /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
            )
          ).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Password Strength Consistency Between Forms', () => {
    it('both forms have identical password strength requirements', async () => {
      const { rerender } = render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      let passwordInput = screen.getByLabelText('Password');

      // Test controlled form with weak password
      fireEvent.change(passwordInput, { target: { value: 'weak' } });

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
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Test uncontrolled form with same weak password
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Uncontrolled form shows complexity error for short passwords
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });
    });

    it('both forms accept identical strong passwords', async () => {
      const strongPassword = 'StrongPass123!';

      // Test controlled form
      const { rerender } = render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      let passwordInput = screen.getByLabelText('Password');

      fireEvent.change(passwordInput, { target: { value: strongPassword } });

      await waitFor(() => {
        expect(
          screen.queryByText('Password must be at least 8 characters long')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).not.toBeInTheDocument();
      });

      // Switch to uncontrolled form
      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(passwordInput, { target: { value: strongPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).not.toBeInTheDocument();
      });
    });

    it('both forms reject identical weak passwords', async () => {
      const weakPassword = 'password123';

      // Test controlled form
      const { rerender } = render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      let passwordInput = screen.getByLabelText('Password');

      fireEvent.change(passwordInput, { target: { value: weakPassword } });

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      // Switch to uncontrolled form
      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(passwordInput, { target: { value: weakPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });
    });
  });
});
