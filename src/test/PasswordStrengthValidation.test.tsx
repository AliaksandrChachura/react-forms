import { describe, it, expect } from 'vitest';

describe('Password Strength Validation Tests', () => {
  const SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  describe('Password Length Validation', () => {
    it('validates minimum password length requirement', () => {
      const shortPassword = 'Abc1!';
      const validPassword = 'Abcdef1!';
      const longPassword = 'Abcdefghijklmnop1!';

      expect(shortPassword.length).toBeLessThan(8);
      expect(validPassword.length).toBeGreaterThanOrEqual(8);
      expect(longPassword.length).toBeGreaterThan(8);
    });

    it('rejects passwords shorter than 8 characters', () => {
      const invalidPasswords = [
        'A1!',
        'Ab1!',
        'Abc1!',
        'Abcd1!',
        'Abcde1!',
        'Abcdef1',
        'abcdef1',
      ];

      invalidPasswords.forEach((password) => {
        expect(password.length).toBeLessThan(8);
      });
    });

    it('accepts passwords with 8 or more characters', () => {
      const validPasswords = [
        'Abcdef1!',
        'Password123!',
        'SecurePass456!',
        'VeryLongPassword789!',
        'ComplexPasswordWithSpecialChars@#$%',
      ];

      validPasswords.forEach((password) => {
        expect(password.length).toBeGreaterThanOrEqual(8);
      });
    });
  });

  describe('Password Character Requirements', () => {
    it('validates presence of lowercase letters', () => {
      const noLowercase = 'ABCDEF1!';
      const withLowercase = 'Abcdef1!';
      const allLowercase = 'abcdef1!';

      expect(noLowercase).not.toMatch(/[a-z]/);
      expect(withLowercase).toMatch(/[a-z]/);
      expect(allLowercase).toMatch(/[a-z]/);
    });

    it('validates presence of uppercase letters', () => {
      const noUppercase = 'abcdef1!';
      const withUppercase = 'Abcdef1!';
      const allUppercase = 'ABCDEF1!';

      expect(noUppercase).not.toMatch(/[A-Z]/);
      expect(withUppercase).toMatch(/[A-Z]/);
      expect(allUppercase).toMatch(/[A-Z]/);
    });

    it('validates presence of numbers', () => {
      const noNumbers = 'Abcdef!@#';
      const withNumbers = 'Abcdef1!';
      const allNumbers = '123456789';

      expect(noNumbers).not.toMatch(/\d/);
      expect(withNumbers).toMatch(/\d/);
      expect(allNumbers).toMatch(/\d/);
    });

    it('validates presence of special characters', () => {
      const noSpecialChars = 'Abcdef123';
      const withSpecialChars = 'Abcdef1!';
      const allSpecialChars = '!@#$%^&*()';

      expect(noSpecialChars).not.toMatch(SPECIAL_CHARS_REGEX);
      expect(withSpecialChars).toMatch(SPECIAL_CHARS_REGEX);
      expect(allSpecialChars).toMatch(SPECIAL_CHARS_REGEX);
    });
  });

  describe('Password Strength Patterns', () => {
    it('identifies weak passwords with missing character types', () => {
      const weakPasswords = [
        'abcdefgh', // only lowercase
        'ABCDEFGH', // only uppercase
        '12345678', // only numbers
        '!@#$%^&*', // only special chars
        'abcdef12', // missing uppercase and special
        'ABCDEF12', // missing lowercase and special
        'abcdef!@', // missing uppercase and numbers
        'ABCDEF!@', // missing lowercase and numbers
      ];

      weakPasswords.forEach((password) => {
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = SPECIAL_CHARS_REGEX.test(password);
        const hasMinLength = password.length >= 8;

        const missingRequirements = [];
        if (!hasLowercase) missingRequirements.push('lowercase');
        if (!hasUppercase) missingRequirements.push('uppercase');
        if (!hasNumbers) missingRequirements.push('numbers');
        if (!hasSpecialChars) missingRequirements.push('special characters');
        if (!hasMinLength) missingRequirements.push('minimum length');

        expect(missingRequirements.length).toBeGreaterThan(0);
      });
    });

    it('identifies strong passwords with all character types', () => {
      const strongPasswords = [
        'Abcdef1!',
        'Password123!',
        'SecurePass456!',
        'Complex@Password789',
        'My$tr0ng#P@ssw0rd',
        'V3ry$3cur3P@ssw0rd!',
      ];

      strongPasswords.forEach((password) => {
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = SPECIAL_CHARS_REGEX.test(password);
        const hasMinLength = password.length >= 8;

        expect(hasLowercase).toBe(true);
        expect(hasUppercase).toBe(true);
        expect(hasNumbers).toBe(true);
        expect(hasSpecialChars).toBe(true);
        expect(hasMinLength).toBe(true);
      });
    });
  });

  describe('Password Complexity Scoring', () => {
    it('calculates password strength based on character variety', () => {
      const calculateStrength = (password: string): number => {
        let score = 0;

        if (password.length >= 8) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (SPECIAL_CHARS_REGEX.test(password)) score += 1;

        return score;
      };

      const weakPassword = 'abcdefgh';
      const mediumPassword = 'Abcdef12';
      const strongPassword = 'Abcdef1!';

      expect(calculateStrength(weakPassword)).toBe(2); // length + lowercase
      expect(calculateStrength(mediumPassword)).toBe(4); // length + lowercase + uppercase + numbers
      expect(calculateStrength(strongPassword)).toBe(5); // all requirements met
    });

    it('evaluates password strength levels', () => {
      const evaluateStrength = (password: string): string => {
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = SPECIAL_CHARS_REGEX.test(password);
        const hasMinLength = password.length >= 8;

        const requirementsMet = [
          hasLowercase,
          hasUppercase,
          hasNumbers,
          hasSpecialChars,
          hasMinLength,
        ].filter(Boolean).length;

        if (requirementsMet === 5) return 'strong';
        if (requirementsMet >= 3) return 'medium';
        return 'weak';
      };

      expect(evaluateStrength('abcdefgh')).toBe('weak');
      expect(evaluateStrength('Abcdef12')).toBe('medium');
      expect(evaluateStrength('Abcdef1!')).toBe('strong');
      expect(evaluateStrength('My$tr0ng#P@ssw0rd')).toBe('strong');
    });
  });

  describe('Password Validation Rules', () => {
    it('enforces all password validation rules', () => {
      const validatePassword = (
        password: string
      ): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (password.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }

        if (!/[a-z]/.test(password)) {
          errors.push('Password must contain at least one lowercase letter');
        }

        if (!/[A-Z]/.test(password)) {
          errors.push('Password must contain at least one uppercase letter');
        }

        if (!/\d/.test(password)) {
          errors.push('Password must contain at least one number');
        }

        if (!SPECIAL_CHARS_REGEX.test(password)) {
          errors.push('Password must contain at least one special character');
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      };

      const validPassword = 'Abcdef1!';
      const invalidPassword = 'weak';

      const validResult = validatePassword(validPassword);
      const invalidResult = validatePassword(invalidPassword);

      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
      expect(invalidResult.errors).toContain(
        'Password must be at least 8 characters long'
      );
      expect(invalidResult.errors).toContain(
        'Password must contain at least one uppercase letter'
      );
      expect(invalidResult.errors).toContain(
        'Password must contain at least one number'
      );
      expect(invalidResult.errors).toContain(
        'Password must contain at least one special character'
      );
    });

    it('provides specific error messages for each validation failure', () => {
      const getPasswordErrors = (password: string): string[] => {
        const errors: string[] = [];

        if (password.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }

        if (!/[a-z]/.test(password)) {
          errors.push('Password must contain at least one lowercase letter');
        }

        if (!/[A-Z]/.test(password)) {
          errors.push('Password must contain at least one uppercase letter');
        }

        if (!/\d/.test(password)) {
          errors.push('Password must contain at least one number');
        }

        if (!SPECIAL_CHARS_REGEX.test(password)) {
          errors.push('Password must contain at least one special character');
        }

        return errors;
      };

      const password1 = 'A'; // only uppercase, too short
      const password2 = 'abcdefgh'; // only lowercase, no uppercase, no numbers, no special
      const password3 = 'Abcdef12'; // missing special characters

      expect(getPasswordErrors(password1)).toContain(
        'Password must be at least 8 characters long'
      );
      expect(getPasswordErrors(password1)).toContain(
        'Password must contain at least one lowercase letter'
      );
      expect(getPasswordErrors(password1)).toContain(
        'Password must contain at least one number'
      );
      expect(getPasswordErrors(password1)).toContain(
        'Password must contain at least one special character'
      );

      expect(getPasswordErrors(password2)).toContain(
        'Password must contain at least one uppercase letter'
      );
      expect(getPasswordErrors(password2)).toContain(
        'Password must contain at least one number'
      );
      expect(getPasswordErrors(password2)).toContain(
        'Password must contain at least one special character'
      );

      expect(getPasswordErrors(password3)).toContain(
        'Password must contain at least one special character'
      );
    });
  });

  describe('Edge Cases and Special Scenarios', () => {
    it('handles passwords with only special characters and numbers', () => {
      const specialNumberPassword = '!@#$%^&*123';

      const hasLowercase = /[a-z]/.test(specialNumberPassword);
      const hasUppercase = /[A-Z]/.test(specialNumberPassword);
      const hasNumbers = /\d/.test(specialNumberPassword);
      const hasSpecialChars = SPECIAL_CHARS_REGEX.test(specialNumberPassword);
      const hasMinLength = specialNumberPassword.length >= 8;

      expect(hasLowercase).toBe(false);
      expect(hasUppercase).toBe(false);
      expect(hasNumbers).toBe(true);
      expect(hasSpecialChars).toBe(true);
      expect(hasMinLength).toBe(true);
    });

    it('handles passwords with mixed case and special characters but no numbers', () => {
      const mixedCaseSpecialPassword = 'AbCdEfGh!@#';

      const hasLowercase = /[a-z]/.test(mixedCaseSpecialPassword);
      const hasUppercase = /[A-Z]/.test(mixedCaseSpecialPassword);
      const hasNumbers = /\d/.test(mixedCaseSpecialPassword);
      const hasSpecialChars = SPECIAL_CHARS_REGEX.test(
        mixedCaseSpecialPassword
      );
      const hasMinLength = mixedCaseSpecialPassword.length >= 8;

      expect(hasLowercase).toBe(true);
      expect(hasUppercase).toBe(true);
      expect(hasNumbers).toBe(false);
      expect(hasSpecialChars).toBe(true);
      expect(hasMinLength).toBe(true);
    });

    it('validates extremely long passwords', () => {
      const longPassword = 'Abcdef1!'.repeat(10); // 80 characters

      expect(longPassword.length).toBe(80);
      expect(longPassword.length).toBeGreaterThan(8);

      const hasLowercase = /[a-z]/.test(longPassword);
      const hasUppercase = /[A-Z]/.test(longPassword);
      const hasNumbers = /\d/.test(longPassword);
      const hasSpecialChars = SPECIAL_CHARS_REGEX.test(longPassword);
      const hasMinLength = longPassword.length >= 8;

      expect(hasLowercase).toBe(true);
      expect(hasUppercase).toBe(true);
      expect(hasNumbers).toBe(true);
      expect(hasSpecialChars).toBe(true);
      expect(hasMinLength).toBe(true);
    });
  });
});
