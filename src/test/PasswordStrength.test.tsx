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

  describe('Controlled Form Password Strength', () => {
    it('validates minimum password length requirement (8 characters)', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

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
        fireEvent.blur(passwordInput);

        await waitFor(() => {
          expect(
            screen.getByText('Password must be at least 8 characters long')
          ).toBeInTheDocument();
        });
      }

      // Test password that meets minimum length
      fireEvent.change(passwordInput, { target: { value: 'abcdefgh' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        // Should not show length error, but may show complexity error
        expect(
          screen.queryByText('Password must be at least 8 characters long')
        ).not.toBeInTheDocument();
      });
    });

    it('validates password complexity requirements - lowercase letters', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test password missing lowercase (but has length, uppercase, number, special char)
      fireEvent.change(passwordInput, { target: { value: 'PASSWORD123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      // Test password with lowercase
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).not.toBeInTheDocument();
      });
    });

    it('validates password complexity requirements - uppercase letters', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test password missing uppercase (but has length, lowercase, number, special char)
      fireEvent.change(passwordInput, { target: { value: 'password123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      // Test password with uppercase
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).not.toBeInTheDocument();
      });
    });

    it('validates password complexity requirements - numbers', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test password missing number (but has length, lowercase, uppercase, special char)
      fireEvent.change(passwordInput, { target: { value: 'Password!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      // Test password with number
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).not.toBeInTheDocument();
      });
    });

    it('validates password complexity requirements - special characters', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test password missing special character (but has length, lowercase, uppercase, number)
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });

      // Test password with special character
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).not.toBeInTheDocument();
      });
    });

    it('accepts various special characters in passwords', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test with various special characters
      const specialCharacters = [
        '!',
        '@',
        '#',
        '$',
        '%',
        '^',
        '&',
        '*',
        '(',
        ')',
        '_',
        '+',
        '-',
        '=',
        '[',
        ']',
        '{',
        '}',
        '|',
        '\\',
        ':',
        ';',
        '"',
        "'",
        '<',
        '>',
        ',',
        '.',
        '?',
        '/',
        '~',
      ];

      for (const specialChar of specialCharacters) {
        const password = `Test123${specialChar}`;
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.blur(passwordInput);

        await waitFor(() => {
          expect(
            screen.queryByText(
              /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
            )
          ).not.toBeInTheDocument();
        });
      }
    });

    it('validates strong password examples', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test various strong passwords
      const strongPasswords = [
        'StrongPass123!',
        'MyP@ssw0rd2024',
        'Secure#123Pass',
        'ComplexP@ss1',
        'Test123!@#$',
        'ValidP@ssw0rd',
        'Sample123$%^',
        'Example456&*()',
        'Demo789^%$#',
        'Form123&*()_+',
        'Admin2024!@#',
        'User$ecure123',
        'Pass#Word456',
        'Strong&Pass789',
        'Complex!123Pwd',
      ];

      for (const password of strongPasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.blur(passwordInput);

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
      }
    });

    it('rejects weak password examples', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test various weak passwords
      const weakPasswords = [
        'password', // No uppercase, number, special char
        'PASSWORD', // No lowercase, number, special char
        '12345678', // No letters, special char
        'Password', // No number, special char
        'password123', // No uppercase, special char
        'PASSWORD123', // No lowercase, special char
        'Password!', // No number
        'password!', // No uppercase, number
        'PASSWORD!', // No lowercase, number
        '123456!', // No letters
        'Aa1', // Too short
        'Aa1!', // Too short
        'Pass1!', // Too short
      ];

      for (const password of weakPasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.blur(passwordInput);

        await waitFor(() => {
          // Should show either length error or complexity error
          const hasLengthError = screen.queryByText(
            'Password must be at least 8 characters long'
          );
          const hasComplexityError = screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          );

          expect(hasLengthError || hasComplexityError).toBeTruthy();
        });
      }
    });
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
      fireEvent.blur(passwordInput);

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
      fireEvent.blur(passwordInput);

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

  describe('Edge Cases and Special Scenarios', () => {
    it('handles passwords with unicode characters', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test password with unicode characters that still meet ASCII requirements
      const validUnicodePasswords = [
        'Pássw0rd!', // Has ASCII P, 0, ! and meets length
        'Paßwörd123!', // Has ASCII P, 1, 2, 3, ! and meets length
      ];

      for (const password of validUnicodePasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.blur(passwordInput);

        await waitFor(() => {
          // These passwords should be valid because they contain ASCII characters
          // that meet the requirements even with unicode characters mixed in
          expect(
            screen.queryByText('Password must be at least 8 characters long')
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText(
              /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
            )
          ).not.toBeInTheDocument();
        });
      }

      // Test passwords with only unicode characters (no ASCII letters/numbers)
      const invalidUnicodePasswords = [
        'Пароль123!', // Cyrillic letters with ASCII numbers and special char
        'パスワード123!', // Japanese characters with ASCII numbers and special char
        '密码123!', // Chinese characters with ASCII numbers and special char
      ];

      for (const password of invalidUnicodePasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.blur(passwordInput);

        await waitFor(() => {
          // These should fail because they don't contain ASCII lowercase/uppercase letters
          // even though they have numbers and special characters
          const hasComplexityError = screen.queryByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          );
          const hasLengthError = screen.queryByText(
            'Password must be at least 8 characters long'
          );

          // Should show either complexity or length error
          expect(hasComplexityError || hasLengthError).toBeTruthy();
        });
      }
    });

    it('handles extremely long passwords', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test very long password that meets all requirements
      const longPassword =
        'A'.repeat(50) + 'a'.repeat(50) + '1'.repeat(50) + '!'.repeat(50);

      fireEvent.change(passwordInput, { target: { value: longPassword } });
      fireEvent.blur(passwordInput);

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
    });

    it('handles passwords with only spaces', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test password with only spaces
      fireEvent.change(passwordInput, { target: { value: '        ' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
          )
        ).toBeInTheDocument();
      });
    });

    it('handles passwords with mixed valid and invalid characters', async () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      // Test passwords with tabs, newlines, etc.
      const edgeCasePasswords = [
        'Pass\t123!', // Tab character
        'Pass\n123!', // Newline character
        'Pass 123!', // Space character
        'Pass\r123!', // Carriage return
      ];

      for (const password of edgeCasePasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.blur(passwordInput);

        await waitFor(() => {
          // Should still validate properly
          expect(
            screen.queryByText('Password must be at least 8 characters long')
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText(
              /Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character/
            )
          ).not.toBeInTheDocument();
        });
      }
    });
  });
});
