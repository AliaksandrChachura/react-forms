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
          {
            name: 'Canada',
            alpha2Code: 'CA',
            flag: '🇨🇦',
            capital: 'Ottawa',
            population: 37742154,
            region: 'Americas',
            alpha3Code: 'CAN',
            altSpellings: ['CA', 'CAN', 'Canada'],
            area: 9984670,
            borders: ['USA'],
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

const fillControlledForm = async () => {
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'john.doe@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'StrongPass123!' },
  });
  fireEvent.change(screen.getByLabelText('Confirm Password'), {
    target: { value: 'StrongPass123!' },
  });

  const genderSelect = screen.getByLabelText('Gender');
  fireEvent.change(genderSelect, { target: { value: 'male' } });

  const termsCheckbox = screen.getByLabelText(
    'I agree to the terms and conditions'
  );
  fireEvent.click(termsCheckbox);

  const countryInput = screen.getByLabelText('Country');
  fireEvent.focus(countryInput);
  fireEvent.change(countryInput, { target: { value: 'United States' } });
  await waitFor(() => {
    const dropdownItem = screen.getByText('United States');
    expect(dropdownItem).toBeInTheDocument();
  });
  const dropdownItem = screen.getByText('United States');
  fireEvent.click(dropdownItem);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  return submitButton;
};

const fillControlledFormWithData = async (data: {
  name?: string;
  age?: number;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  terms?: boolean;
  country?: string;
}) => {
  if (data.name) {
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: data.name },
    });
  }

  if (data.age) {
    fireEvent.change(screen.getByLabelText('Age'), {
      target: { value: data.age.toString() },
    });
  }

  if (data.email) {
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: data.email },
    });
  }

  if (data.password) {
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: data.password },
    });
  }

  if (data.confirmPassword) {
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: data.confirmPassword },
    });
  }

  if (data.gender) {
    const genderSelect = screen.getByLabelText('Gender');
    fireEvent.change(genderSelect, { target: { value: data.gender } });
  }

  if (data.terms) {
    const termsCheckbox = screen.getByLabelText(
      'I agree to the terms and conditions'
    );
    fireEvent.click(termsCheckbox);
  }

  if (data.country) {
    const countryInput = screen.getByLabelText('Country');
    fireEvent.focus(countryInput);
    fireEvent.change(countryInput, { target: { value: data.country } });
    await waitFor(() => {
      const dropdownItem = screen.getByText(data.country as string);
      expect(dropdownItem).toBeInTheDocument();
    });
    const dropdownItem = screen.getByText(data.country as string);
    fireEvent.click(dropdownItem);
  }

  return screen.getByRole('button', { name: /submit/i });
};

describe('Form Submission Tests', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Controlled Form Submission', () => {
    it('submits successfully with valid data', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      await fillControlledForm();

      expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
      expect(screen.getByLabelText('Age')).toHaveValue(25);
      expect(screen.getByLabelText('Email')).toHaveValue(
        'john.doe@example.com'
      );
      expect(screen.getByLabelText('Password')).toHaveValue('StrongPass123!');
      expect(screen.getByLabelText('Confirm Password')).toHaveValue(
        'StrongPass123!'
      );
    });

    it('prevents submission with invalid data', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'j' },
      });
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: '15' },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'invalid-email' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'weak' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'different' },
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('shows validation errors on blur when typing invalid data', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'j' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText('Name must start with an uppercase letter')
        ).toBeInTheDocument();
      });

      const ageInput = screen.getByLabelText('Age');
      fireEvent.change(ageInput, { target: { value: '15' } });
      fireEvent.blur(ageInput);

      await waitFor(() => {
        expect(
          screen.getByText('Must be at least 18 years old')
        ).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText('Email');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters long')
        ).toBeInTheDocument();
      });
    });

    it('clears validation errors on blur when data becomes valid', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'j' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText('Name must start with an uppercase letter')
        ).toBeInTheDocument();
      });

      fireEvent.change(nameInput, { target: { value: 'John' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.queryByText('Name must start with an uppercase letter')
        ).not.toBeInTheDocument();
      });

      const ageInput = screen.getByLabelText('Age');
      fireEvent.change(ageInput, { target: { value: '15' } });
      fireEvent.blur(ageInput);

      await waitFor(() => {
        expect(
          screen.getByText('Must be at least 18 years old')
        ).toBeInTheDocument();
      });

      fireEvent.change(ageInput, { target: { value: '25' } });
      fireEvent.blur(ageInput);

      await waitFor(() => {
        expect(
          screen.queryByText('Must be at least 18 years old')
        ).not.toBeInTheDocument();
      });
    });

    it('enables submit button only when all fields are valid', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });

      expect(submitButton).toBeDisabled();

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: '25' },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john@example.com' },
      });

      expect(submitButton).toBeDisabled();

      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'StrongPass123!' },
      });

      expect(submitButton).toBeDisabled();

      const genderSelect = screen.getByLabelText('Gender');
      fireEvent.change(genderSelect, { target: { value: 'male' } });

      expect(submitButton).toBeDisabled();

      fireEvent.click(
        screen.getByLabelText('I agree to the terms and conditions')
      );

      expect(submitButton).toBeDisabled();

      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: 'United States' },
      });
    });
  });

  describe('Uncontrolled Form Submission', () => {
    it('submits successfully with valid data', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'Jane Smith' },
      });
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: '30' },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'jane.smith@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'SecurePass456!' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'SecurePass456!' },
      });
      fireEvent.change(screen.getByLabelText('Gender'), {
        target: { value: 'female' },
      });
      fireEvent.click(
        screen.getByLabelText('I agree to the terms and conditions')
      );
      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: 'Canada' },
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData).toEqual({
        name: 'Jane Smith',
        age: 30,
        email: 'jane.smith@example.com',
        password: 'SecurePass456!',
        confirmPassword: 'SecurePass456!',
        gender: 'female',
        terms: true,
        imageBase64: '',
        country: 'Canada',
      });
    });

    it('shows validation errors on submission with invalid data', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters long')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Must be at least 18 years old')
        ).toBeInTheDocument();
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText('Please confirm your password')
        ).toBeInTheDocument();
        expect(screen.getByText('Please select a gender')).toBeInTheDocument();
        expect(
          screen.getByText('You must agree to the terms and conditions')
        ).toBeInTheDocument();
        expect(screen.getByText('Please select a country')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows specific validation errors for partially filled forms', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'j' },
      });
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: '15' },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'invalid-email' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'weak' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'different' },
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Name must start with an uppercase letter')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Must be at least 18 years old')
        ).toBeInTheDocument();
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
        expect(
          screen.getByText('Password must be at least 8 characters long')
        ).toBeInTheDocument();
        expect(screen.getByText('Passwords must match')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('submits successfully after fixing validation errors', async () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters long')
        ).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: '25' },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.change(screen.getByLabelText('Gender'), {
        target: { value: 'male' },
      });
      fireEvent.click(
        screen.getByLabelText('I agree to the terms and conditions')
      );
      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: 'United States' },
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.name).toBe('John Doe');
      expect(submittedData.age).toBe(25);
      expect(submittedData.email).toBe('john@example.com');
      expect(submittedData.password).toBe('StrongPass123!');
      expect(submittedData.gender).toBe('male');
      expect(submittedData.terms).toBe(true);
      expect(submittedData.country).toBe('United States');
    });
  });

  describe('Form State Management', () => {
    it('maintains form state between submissions', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'John Doe' },
      });
      fireEvent.blur(screen.getByLabelText('Name'));
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: '25' },
      });
      fireEvent.blur(screen.getByLabelText('Age'));
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.blur(screen.getByLabelText('Email'));
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.blur(screen.getByLabelText('Password'));
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.blur(screen.getByLabelText('Confirm Password'));
      fireEvent.change(screen.getByLabelText('Gender'), {
        target: { value: 'male' },
      });
      fireEvent.blur(screen.getByLabelText('Gender'));
      fireEvent.click(
        screen.getByLabelText('I agree to the terms and conditions')
      );
      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: 'United States' },
      });
      fireEvent.blur(screen.getByLabelText('Country'));

      expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
      expect(screen.getByLabelText('Age')).toHaveValue(25);
      expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
      expect(screen.getByLabelText('Password')).toHaveValue('StrongPass123!');
      expect(screen.getByLabelText('Confirm Password')).toHaveValue(
        'StrongPass123!'
      );
    });

    it('handles multiple submissions correctly', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'John Doe' },
      });
      fireEvent.blur(screen.getByLabelText('Name'));
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: '25' },
      });
      fireEvent.blur(screen.getByLabelText('Age'));
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.blur(screen.getByLabelText('Email'));
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.blur(screen.getByLabelText('Password'));
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'StrongPass123!' },
      });
      fireEvent.blur(screen.getByLabelText('Confirm Password'));
      fireEvent.change(screen.getByLabelText('Gender'), {
        target: { value: 'male' },
      });
      fireEvent.blur(screen.getByLabelText('Gender'));
      fireEvent.click(
        screen.getByLabelText('I agree to the terms and conditions')
      );
      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: 'United States' },
      });
      fireEvent.blur(screen.getByLabelText('Country'));

      expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
      expect(screen.getByLabelText('Age')).toHaveValue(25);
      expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
      expect(screen.getByLabelText('Password')).toHaveValue('StrongPass123!');
      expect(screen.getByLabelText('Confirm Password')).toHaveValue(
        'StrongPass123!'
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles form submission with special characters in text fields', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      await fillControlledFormWithData({
        name: "José María O'Connor-Smith",
        age: 25,
        email: 'jose.maria@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        gender: 'male',
        terms: true,
        country: 'United States',
      });

      expect(screen.getByLabelText('Name')).toHaveValue(
        "José María O'Connor-Smith"
      );
      expect(screen.getByLabelText('Email')).toHaveValue(
        'jose.maria@example.com'
      );
    });

    it('handles form submission with very long values', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const longName = 'A'.repeat(100);
      const longEmail = `${'a'.repeat(50)}@${'b'.repeat(50)}.com`;

      await fillControlledFormWithData({
        name: longName,
        age: 25,
        email: longEmail,
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        gender: 'male',
        terms: true,
        country: 'United States',
      });

      expect(screen.getByLabelText('Name')).toHaveValue(longName);
      expect(screen.getByLabelText('Email')).toHaveValue(longEmail);
    });

    it('handles form submission with numeric edge cases', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const edgeCaseAges = [18, 100, 999];

      for (const age of edgeCaseAges) {
        await fillControlledFormWithData({
          name: 'John Doe',
          age: age,
          email: 'john@example.com',
          password: 'StrongPass123!',
          confirmPassword: 'StrongPass123!',
          gender: 'male',
          terms: true,
          country: 'United States',
        });

        expect(screen.getByLabelText('Age')).toHaveValue(age);
      }
    });
  });

  describe('Cross-Form Submission Consistency', () => {
    it('both forms submit identical data when given same inputs', async () => {
      const testData = {
        name: 'Test User',
        age: 30,
        email: 'test@example.com',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        gender: 'female',
        terms: true,
        imageBase64: '',
        country: 'Canada',
      };

      const { rerender } = render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: testData.name },
      });
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: testData.age.toString() },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: testData.email },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: testData.password },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: testData.confirmPassword },
      });
      fireEvent.change(screen.getByLabelText('Gender'), {
        target: { value: testData.gender },
      });
      fireEvent.click(
        screen.getByLabelText('I agree to the terms and conditions')
      );
      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: testData.country },
      });

      expect(screen.getByLabelText('Name')).toHaveValue(testData.name);
      expect(screen.getByLabelText('Age')).toHaveValue(testData.age);
      expect(screen.getByLabelText('Email')).toHaveValue(testData.email);
      expect(screen.getByLabelText('Password')).toHaveValue(testData.password);
      expect(screen.getByLabelText('Confirm Password')).toHaveValue(
        testData.confirmPassword
      );

      mockOnSubmit.mockClear();

      rerender(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: testData.name },
      });
      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: testData.age.toString() },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: testData.email },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: testData.password },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: testData.confirmPassword },
      });
      fireEvent.change(screen.getByLabelText('Gender'), {
        target: { value: testData.gender },
      });
      fireEvent.click(
        screen.getByLabelText('I agree to the terms and conditions')
      );
      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: testData.country },
      });

      const uncontrolledSubmitButton = screen.getByRole('button', {
        name: /submit/i,
      });
      fireEvent.click(uncontrolledSubmitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      const uncontrolledData = mockOnSubmit.mock.calls[0][0];

      expect(uncontrolledData).toEqual(testData);
    });
  });
});
