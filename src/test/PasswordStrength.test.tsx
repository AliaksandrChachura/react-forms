import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

      const weakPasswords = [
        'password123',
        'PASSWORD123',
        'Password123',
        'Password!',
        'password!',
        'PASSWORD!',
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

      fireEvent.change(passwordInput, { target: { value: 'weak' } });

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters long')
        ).toBeInTheDocument();
      });

      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });
    });

    it('both forms accept identical strong passwords', async () => {
      const strongPassword = 'StrongPass123!';

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
