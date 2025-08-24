import { type Country } from './types';
import { type apiCountry } from '../api/baseUrl';

const serializeCountry = (country: apiCountry): Country => {
  return {
    name: country.name,
    capital: country.capital,
    population: country.population,
    region: country.region,
    flag: country.flag.small,
    alpha2Code: country.alpha2Code,
    alpha3Code: country.alpha3Code,
    altSpellings: country.altSpellings,
    area: country.area,
    borders: country.borders,
  };
};

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const validateImage = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg+xml',
  ];
  if (!allowedTypes.includes(file.type)) {
    return 'Only PNG, JPEG, and SVG images are allowed';
  }

  return null;
};

const handleImageChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: (name: 'imageBase64', value: string) => void,
  setValidationError: (error: string) => void,
  setIsProcessing: (processing: boolean) => void
) => {
  const file = e.target.files?.[0] ?? null;

  if (!file) {
    setValue('imageBase64', '');
    setValidationError('');
    return;
  }

  const error = validateImage(file);
  if (error) {
    setValidationError(error);
    setValue('imageBase64', '');
    return;
  }

  setValidationError('');
  setIsProcessing(true);

  try {
    const base64 = await convertToBase64(file);
    setValue('imageBase64', base64);
  } catch {
    setValidationError('Failed to process image');
    setValue('imageBase64', '');
  } finally {
    setIsProcessing(false);
  }
};

export { serializeCountry, convertToBase64, validateImage, handleImageChange };
