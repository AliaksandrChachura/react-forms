import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Modal from '../components/modal/Modal';
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

describe('Modal Functionality Tests', () => {
  const mockOnClose = vi.fn();

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

  describe('Modal Opening and Closing', () => {
    it('opens modal when isOpen is true', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(screen.getByText('Modal Content')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render modal when isOpen is false', () => {
      render(
        <TestWrapper>
          <Modal isOpen={false} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes modal when escape key is pressed', () => {
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

    it('closes modal when clicking outside modal content', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      const modalRoot = document.getElementById('modal-root');
      if (modalRoot) {
        fireEvent.mouseDown(modalRoot);
      }

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('maintains focus management when modal opens and closes', () => {
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

    it('prevents body scroll when modal is open and restores when closed', () => {
      const { rerender } = render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <TestWrapper>
          <Modal isOpen={false} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(document.body.style.overflow).toBe('unset');
    });
  });
});
