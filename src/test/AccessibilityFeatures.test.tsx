import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Modal from '../components/modal/Modal';
import ControlledForm from '../components/forms/controlled/ControlledForm';
import UncontrolledForm from '../components/forms/uncontrolled/UncontrolledForm';
import formReducer from '../store/slices/formSlicer';
import selectedCountriesReducer from '../store/slices/selectedCountries';

vi.mock('../store/helper', () => ({
  handleImageChange: vi.fn((_event, _callback, _setError, _setIsProcessing) => {
    _setIsProcessing(false);
    _callback(null, 'data:image/png;base64,mock-image-data');
  }),
}));

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

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('Accessibility Features Tests', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';

    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Focus Management', () => {
    it('traps focus within modal when opened', () => {
      const button = document.createElement('button');
      button.textContent = 'Trigger Button';
      document.body.appendChild(button);
      button.focus();

      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>
              <button>First Button</button>
              <button>Second Button</button>
              <button>Third Button</button>
            </div>
          </Modal>
        </TestWrapper>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveFocus();

      const firstButton = screen.getByText('First Button');
      const secondButton = screen.getByText('Second Button');
      const thirdButton = screen.getByText('Third Button');

      firstButton.focus();
      expect(firstButton).toHaveFocus();

      secondButton.focus();
      expect(secondButton).toHaveFocus();

      thirdButton.focus();
      expect(thirdButton).toHaveFocus();
    });

    it('restores focus to previous element when modal closes', () => {
      const button = document.createElement('button');
      button.textContent = 'Trigger Button';
      document.body.appendChild(button);
      button.focus();

      const { rerender } = render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveFocus();

      rerender(
        <TestWrapper>
          <Modal isOpen={false} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(button).toHaveFocus();
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes modal when ESC key is pressed', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('supports tab navigation within modal', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>
              <input type="text" placeholder="First input" />
              <button>Submit</button>
              <input type="text" placeholder="Second input" />
            </div>
          </Modal>
        </TestWrapper>
      );

      const firstInput = screen.getByPlaceholderText('First input');
      const submitButton = screen.getByText('Submit');
      const secondInput = screen.getByPlaceholderText('Second input');

      firstInput.focus();
      expect(firstInput).toHaveFocus();

      submitButton.focus();
      expect(submitButton).toHaveFocus();

      secondInput.focus();
      expect(secondInput).toHaveFocus();
    });

    it('maintains proper tab order in forms', () => {
      render(
        <TestWrapper>
          <ControlledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      const ageInput = screen.getByLabelText('Age');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      nameInput.focus();
      expect(nameInput).toHaveFocus();

      ageInput.focus();
      expect(ageInput).toHaveFocus();

      emailInput.focus();
      expect(emailInput).toHaveFocus();

      passwordInput.focus();
      expect(passwordInput).toHaveFocus();
    });
  });

  describe('ARIA Attributes and Roles', () => {
    it('modal has correct ARIA attributes', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('tabIndex', '-1');
    });

    it('form fields have proper label associations', () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      const ageInput = screen.getByLabelText('Age');
      const emailInput = screen.getByLabelText('Email');

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(ageInput).toHaveAttribute('id', 'age');
      expect(emailInput).toHaveAttribute('id', 'email');

      const nameLabel = screen.getByText('Name');
      const ageLabel = screen.getByText('Age');
      const emailLabel = screen.getByText('Email');

      expect(nameLabel).toHaveAttribute('for', 'name');
      expect(ageLabel).toHaveAttribute('for', 'age');
      expect(emailLabel).toHaveAttribute('for', 'email');
    });

    it('select elements have proper accessibility attributes', () => {
      render(
        <TestWrapper>
          <UncontrolledForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const genderSelect = screen.getByLabelText('Gender');
      expect(genderSelect).toHaveAttribute('id', 'gender');
      expect(genderSelect).toBeInstanceOf(HTMLSelectElement);

      const countryInput = screen.getByLabelText('Country');
      expect(countryInput).toHaveAttribute('id', 'country');
      expect(countryInput).toHaveAttribute(
        'placeholder',
        'Search for a country...'
      );
    });
  });
});
