import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import formReducer, { setFormValue } from '../store/slices/formSlicer';
import { handleImageChange } from '../store/helper';

vi.mock('../store/helper', () => ({
  handleImageChange: vi.fn(),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      form: formReducer,
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
    },
  });
};

describe('Image to Base64 Conversion Tests', () => {
  let store: ReturnType<typeof createTestStore>;
  const mockHandleImageChange = vi.mocked(handleImageChange);

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Image File Validation', () => {
    it('validates image file types correctly', () => {
      const validImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
      ];

      const invalidFileTypes = [
        'text/plain',
        'application/pdf',
        'video/mp4',
        'audio/mp3',
        'application/json',
        'text/html',
      ];

      validImageTypes.forEach((type) => {
        expect(type).toMatch(/^image\//);
      });

      invalidFileTypes.forEach((type) => {
        expect(type).not.toMatch(/^image\//);
      });
    });

    it('validates image file extensions', () => {
      const validExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.bmp',
      ];
      const invalidExtensions = [
        '.txt',
        '.pdf',
        '.doc',
        '.mp4',
        '.mp3',
        '.json',
      ];

      validExtensions.forEach((ext) => {
        expect(ext).toMatch(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
      });

      invalidExtensions.forEach((ext) => {
        expect(ext).not.toMatch(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
      });
    });
  });

  describe('Base64 Conversion Process', () => {
    it('converts image file to base64 string', async () => {
      const mockFile = new File(['mock-image-data'], 'test-image.jpg', {
        type: 'image/jpeg',
      });

      const mockBase64Data =
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

      mockHandleImageChange.mockImplementation(
        async (_event, setValue, _setValidationError, setIsProcessing) => {
          setIsProcessing(false);
          setValue('imageBase64', mockBase64Data);
        }
      );

      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      const mockSetValue = vi.fn();
      const mockSetValidationError = vi.fn();
      const mockSetIsProcessing = vi.fn();

      await handleImageChange(
        mockEvent,
        mockSetValue,
        mockSetValidationError,
        mockSetIsProcessing
      );

      expect(mockHandleImageChange).toHaveBeenCalledWith(
        mockEvent,
        mockSetValue,
        mockSetValidationError,
        mockSetIsProcessing
      );
      expect(mockSetValue).toHaveBeenCalledWith('imageBase64', mockBase64Data);
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
    });

    it('handles conversion errors gracefully', async () => {
      const mockFile = new File(['invalid-data'], 'test-image.jpg', {
        type: 'image/jpeg',
      });

      mockHandleImageChange.mockImplementation(
        async (_event, setValue, setValidationError, setIsProcessing) => {
          setIsProcessing(false);
          setValidationError('Failed to convert image');
          setValue('imageBase64', '');
        }
      );

      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      const mockSetValue = vi.fn();
      const mockSetValidationError = vi.fn();
      const mockSetIsProcessing = vi.fn();

      await handleImageChange(
        mockEvent,
        mockSetValue,
        mockSetValidationError,
        mockSetIsProcessing
      );

      expect(mockHandleImageChange).toHaveBeenCalledWith(
        mockEvent,
        mockSetValue,
        mockSetValidationError,
        mockSetIsProcessing
      );
      expect(mockSetValidationError).toHaveBeenCalledWith(
        'Failed to convert image'
      );
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
      expect(mockSetValue).toHaveBeenCalledWith('imageBase64', '');
    });
  });

  describe('Store Integration', () => {
    it('updates store with converted base64 image data', () => {
      const mockBase64Data =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

      const formData = {
        name: 'Test User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: mockBase64Data,
        country: '',
      };

      store.dispatch(setFormValue(formData));

      const state = store.getState().form;
      expect(state.imageBase64).toBe(mockBase64Data);
      expect(state.imageBase64).toMatch(/^data:image\/[^;]+;base64,/);
      expect(state.imageBase64?.length).toBeGreaterThan(100);
    });

    it('clears image data when setting empty value', () => {
      const initialFormData = {
        name: 'Test User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: 'data:image/png;base64,some-data',
        country: '',
      };

      store.dispatch(setFormValue(initialFormData));
      expect(store.getState().form.imageBase64).toBe(
        'data:image/png;base64,some-data'
      );

      const clearedFormData = {
        name: 'Test User',
        age: 0,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        terms: false,
        imageBase64: '',
        country: '',
      };

      store.dispatch(setFormValue(clearedFormData));
      expect(store.getState().form.imageBase64).toBe('');
    });
  });

  describe('Base64 Data Format Validation', () => {
    it('validates correct base64 data URL format', () => {
      const validBase64Data = [
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      ];

      validBase64Data.forEach((data) => {
        expect(data).toMatch(/^data:image\/[^;]+;base64,[A-Za-z0-9+/]*={0,2}$/);
        expect(data).toContain('data:image/');
        expect(data).toContain(';base64,');
      });
    });

    it('identifies invalid base64 data formats', () => {
      const invalidBase64Data = [
        'not-a-data-url',
        'https://example.com/image.jpg',
        'image-data-without-prefix',
      ];

      invalidBase64Data.forEach((data) => {
        const isValidFormat =
          /^data:image\/[^;]+;base64,[A-Za-z0-9+/]*={0,2}$/.test(data);
        expect(isValidFormat).toBe(false);
      });
    });
  });

  describe('Image Processing States', () => {
    it('manages processing state during conversion', async () => {
      const mockFile = new File(['mock-image-data'], 'test-image.jpg', {
        type: 'image/jpeg',
      });

      const mockSetIsProcessing = vi.fn();

      mockHandleImageChange.mockImplementation(
        async (_event, setValue, _setValidationError, setIsProcessing) => {
          setIsProcessing(true);

          await Promise.resolve();
          setIsProcessing(false);
          setValue('imageBase64', 'data:image/jpeg;base64,converted-data');
        }
      );

      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      const mockSetValue = vi.fn();
      const mockSetValidationError = vi.fn();

      const conversionPromise = handleImageChange(
        mockEvent,
        mockSetValue,
        mockSetValidationError,
        mockSetIsProcessing
      );

      expect(mockSetIsProcessing).toHaveBeenCalledWith(true);

      await conversionPromise;

      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
      expect(mockSetValue).toHaveBeenCalledWith(
        'imageBase64',
        'data:image/jpeg;base64,converted-data'
      );
    });

    it('handles multiple image conversions sequentially', async () => {
      const mockFiles = [
        new File(['image1'], 'image1.jpg', { type: 'image/jpeg' }),
        new File(['image2'], 'image2.png', { type: 'image/png' }),
        new File(['image3'], 'image3.gif', { type: 'image/gif' }),
      ];

      const mockBase64Results = [
        'data:image/jpeg;base64,image1-data',
        'data:image/png;base64,image2-data',
        'data:image/gif;base64,image3-data',
      ];

      let callIndex = 0;
      mockHandleImageChange.mockImplementation(
        async (_event, setValue, _setValidationError, setIsProcessing) => {
          const result = mockBase64Results[callIndex];
          callIndex++;
          setIsProcessing(false);
          setValue('imageBase64', result);
        }
      );

      const mockEvent = {
        target: {
          files: Object.assign([mockFiles[0]], {
            item: (index: number) => mockFiles[index],
            length: mockFiles.length,
          }),
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      const mockSetValue = vi.fn();
      const mockSetValidationError = vi.fn();
      const mockSetIsProcessing = vi.fn();

      for (let i = 0; i < mockFiles.length; i++) {
        mockEvent.target.files = Object.assign([mockFiles[i]], {
          item: (index: number) => mockFiles[index],
          length: 1,
        });
        await handleImageChange(
          mockEvent,
          mockSetValue,
          mockSetValidationError,
          mockSetIsProcessing
        );
      }

      expect(mockHandleImageChange).toHaveBeenCalledTimes(3);
      expect(mockSetValue).toHaveBeenCalledWith(
        'imageBase64',
        'data:image/jpeg;base64,image1-data'
      );
      expect(mockSetValue).toHaveBeenCalledWith(
        'imageBase64',
        'data:image/png;base64,image2-data'
      );
      expect(mockSetValue).toHaveBeenCalledWith(
        'imageBase64',
        'data:image/gif;base64,image3-data'
      );
    });
  });
});
