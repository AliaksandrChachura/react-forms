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

describe('Click Outside to Close Behavior Tests', () => {
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

  describe('Modal Click Outside Behavior', () => {
    it('closes modal when clicking on modal backdrop', () => {
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

    it('closes modal when clicking outside modal content area', () => {
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

    it('does not close modal when clicking inside modal content', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div data-testid="modal-content">Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      const modalContent = screen.getByTestId('modal-content');
      fireEvent.mouseDown(modalContent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('closes modal when clicking on body outside modal', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      fireEvent.mouseDown(document.body);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles multiple click outside events correctly', () => {
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
        fireEvent.mouseDown(modalRoot);
        fireEvent.mouseDown(modalRoot);
      }

      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });

    it('maintains modal open state when clicking inside content multiple times', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div data-testid="modal-content">
              <button>Button 1</button>
              <button>Button 2</button>
              <input type="text" placeholder="Input field" />
            </div>
          </Modal>
        </TestWrapper>
      );

      const modalContent = screen.getByTestId('modal-content');
      const button1 = screen.getByText('Button 1');
      const button2 = screen.getByText('Button 2');
      const inputField = screen.getByPlaceholderText('Input field');

      fireEvent.mouseDown(modalContent);
      fireEvent.mouseDown(button1);
      fireEvent.mouseDown(button2);
      fireEvent.mouseDown(inputField);

      expect(mockOnClose).not.toHaveBeenCalled();
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });
  });
});
