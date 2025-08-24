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

describe('Error Message Display and Clearing Tests', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Error Message Display', () => {
    it('displays password error message when invalid password is entered', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
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

    it('displays multiple error messages for different validation failures', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const ageInput = screen.getByLabelText('Age');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(nameInput, { target: { value: 'a' } });
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(ageInput, { target: { value: '15' } });

      fireEvent.blur(nameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(ageInput);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Name must start with an uppercase letter/)
        ).toBeInTheDocument();
        expect(screen.getByText(/Invalid email format/)).toBeInTheDocument();
        expect(
          screen.getByText(/Must be at least 18 years old/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error Message Clearing', () => {
    it('clears password error message when valid password is entered', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
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

      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).not.toBeInTheDocument();
      });
    });

    it('clears error messages when user starts typing in controlled form', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');

      fireEvent.change(nameInput, { target: { value: 'a' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText(/Name must start with an uppercase letter/)
        ).toBeInTheDocument();
      });

      fireEvent.change(nameInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(
          screen.queryByText(/Name must start with an uppercase letter/)
        ).not.toBeInTheDocument();
      });
    });

    it('maintains error state until all validation criteria are met', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
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

      fireEvent.change(passwordInput, { target: { value: 'WeakPass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      fireEvent.change(passwordInput, { target: { value: 'WeakPass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      fireEvent.change(passwordInput, { target: { value: 'WeakPass123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).not.toBeInTheDocument();
      });
    });
  });
});
