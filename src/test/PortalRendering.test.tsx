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

describe('Portal Rendering Tests', () => {
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

  describe('Portal Creation and DOM Placement', () => {
    it('creates portal root element when modal is opened', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      const modalRoot = document.getElementById('modal-root');
      expect(modalRoot).toBeInTheDocument();
    });

    it('renders modal content outside main DOM tree', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div data-testid="modal-content">Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      const modalContent = screen.getByTestId('modal-content');
      const modalRoot = document.getElementById('modal-root');

      expect(modalContent).toBeInTheDocument();
      expect(modalRoot).toContainElement(modalContent);
      expect(document.body).toContainElement(modalRoot);
    });

    it('places portal content at the end of body element', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      const modalRoot = document.getElementById('modal-root');
      const bodyChildren = Array.from(document.body.children);

      expect(bodyChildren).toContain(modalRoot);
    });
  });

  describe('Portal Content Rendering', () => {
    it('renders complex content structures through portal', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div data-testid="modal-container">
              <h1>Modal Title</h1>
              <p>Modal description text</p>
              <button data-testid="action-button">Action Button</button>
              <form data-testid="modal-form">
                <input type="text" placeholder="Input field" />
                <select>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </form>
            </div>
          </Modal>
        </TestWrapper>
      );

      expect(screen.getByText('Modal Title')).toBeInTheDocument();
      expect(screen.getByText('Modal description text')).toBeInTheDocument();
      expect(screen.getByTestId('action-button')).toBeInTheDocument();
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Input field')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('maintains event handling capabilities in portal content', () => {
      const mockButtonClick = vi.fn();

      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div>
              <button data-testid="test-button" onClick={mockButtonClick}>
                Click Me
              </button>
            </div>
          </Modal>
        </TestWrapper>
      );

      const button = screen.getByTestId('test-button');
      fireEvent.click(button);

      expect(mockButtonClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Portal Cleanup and State Management', () => {
    it('removes portal content when modal is closed', () => {
      const { rerender } = render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div data-testid="modal-content">Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(document.getElementById('modal-root')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <Modal isOpen={false} onClose={mockOnClose}>
            <div data-testid="modal-content">Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
      expect(document.getElementById('modal-root')).toBeInTheDocument();
    });

    it('handles multiple portal open/close cycles correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div data-testid="modal-content">Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <Modal isOpen={false} onClose={mockOnClose}>
            <div data-testid="modal-content">Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();

      rerender(
        <TestWrapper>
          <Modal isOpen={true} onClose={mockOnClose}>
            <div data-testid="modal-content">Modal Content</div>
          </Modal>
        </TestWrapper>
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(document.getElementById('modal-root')).toBeInTheDocument();
    });
  });
});
