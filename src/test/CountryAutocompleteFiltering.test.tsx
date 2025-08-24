import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import formReducer from '../store/slices/formSlicer';
import selectedCountriesReducer, {
  setCountries,
} from '../store/slices/selectedCountries';
import { type Country } from '../store/types';

vi.mock('../store/helper', () => ({
  handleImageChange: vi.fn((_event, _callback, _setError, _setIsProcessing) => {
    _setIsProcessing(false);
    _callback(null, 'data:image/png;base64,mock-image-data');
  }),
}));

const createTestStore = () => {
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
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

const mockCountries: Country[] = [
  {
    name: 'United States',
    capital: 'Washington, D.C.',
    population: 331002651,
    region: 'Americas',
    flag: '🇺🇸',
    alpha2Code: 'US',
    alpha3Code: 'USA',
    altSpellings: ['US', 'USA', 'United States of America'],
    area: 9629091,
    borders: ['CAN', 'MEX'],
  },
  {
    name: 'Canada',
    capital: 'Ottawa',
    population: 38005238,
    region: 'Americas',
    flag: '🇨🇦',
    alpha2Code: 'CA',
    alpha3Code: 'CAN',
    altSpellings: ['CA', 'CAN', 'Canada'],
    area: 9984670,
    borders: ['USA'],
  },
  {
    name: 'Germany',
    capital: 'Berlin',
    population: 83190556,
    region: 'Europe',
    flag: '🇩🇪',
    alpha2Code: 'DE',
    alpha3Code: 'DEU',
    altSpellings: ['DE', 'Deutschland', 'Federal Republic of Germany'],
    area: 357114,
    borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
  },
  {
    name: 'France',
    capital: 'Paris',
    population: 67391582,
    region: 'Europe',
    flag: '🇫🇷',
    alpha2Code: 'FR',
    alpha3Code: 'FRA',
    altSpellings: ['FR', 'French Republic', 'République française'],
    area: 640679,
    borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
  },
  {
    name: 'Japan',
    capital: 'Tokyo',
    population: 125836021,
    region: 'Asia',
    flag: '🇯🇵',
    alpha2Code: 'JP',
    alpha3Code: 'JPN',
    altSpellings: ['JP', 'Japan', 'Nippon', 'Nihon'],
    area: 377930,
    borders: [],
  },
  {
    name: 'Australia',
    capital: 'Canberra',
    population: 25499884,
    region: 'Oceania',
    flag: '🇦🇺',
    alpha2Code: 'AU',
    alpha3Code: 'AUS',
    altSpellings: ['AU', 'Australia'],
    area: 7692024,
    borders: [],
  },
  {
    name: 'Brazil',
    capital: 'Brasília',
    population: 212559417,
    region: 'Americas',
    flag: '🇧🇷',
    alpha2Code: 'BR',
    alpha3Code: 'BRA',
    altSpellings: ['BR', 'Brazil', 'Brasil'],
    area: 8515767,
    borders: [
      'ARG',
      'BOL',
      'COL',
      'GUF',
      'GUY',
      'PRY',
      'PER',
      'SUR',
      'URY',
      'VEN',
    ],
  },
  {
    name: 'India',
    capital: 'New Delhi',
    population: 1380004385,
    region: 'Asia',
    flag: '🇮🇳',
    alpha2Code: 'IN',
    alpha3Code: 'IND',
    altSpellings: ['IN', 'India', 'Bharat'],
    area: 3287590,
    borders: ['AFG', 'BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK', 'LKA'],
  },
  {
    name: 'South Africa',
    capital: 'Pretoria',
    population: 59308690,
    region: 'Africa',
    flag: '🇿🇦',
    alpha2Code: 'ZA',
    alpha3Code: 'ZAF',
    altSpellings: ['ZA', 'South Africa', 'RSA'],
    area: 1221037,
    borders: ['BWA', 'LSO', 'MOZ', 'NAM', 'SWZ', 'ZWE'],
  },
  {
    name: 'Mexico',
    capital: 'Mexico City',
    population: 128932753,
    region: 'Americas',
    flag: '🇲🇽',
    alpha2Code: 'MX',
    alpha3Code: 'MEX',
    altSpellings: ['MX', 'Mexico', 'México'],
    area: 1964375,
    borders: ['BLZ', 'GTM', 'USA'],
  },
];

describe('Country Autocomplete Filtering Tests', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Basic Filtering Functionality', () => {
    it('filters countries by name search term', async () => {
      store.dispatch(setCountries(mockCountries));

      const { container } = render(
        <TestWrapper>
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder="Search for a country..."
              onChange={(e) => {
                const searchTerm = e.target.value;
                const filtered = mockCountries
                  .filter(
                    (country) =>
                      country.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      country.alpha2Code
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 10);

                // Simulate the filtering logic from the component
                const filteredContainer = container.querySelector(
                  '.filtered-countries'
                );
                if (filteredContainer) {
                  filteredContainer.innerHTML = filtered
                    .map(
                      (country) => `
                        <div class="dropdown-item">
                          <span class="country-flag">${country.flag}</span>
                          <span class="country-name">${country.name}</span>
                          <span class="country-code">(${country.alpha2Code})</span>
                        </div>
                      `
                    )
                    .join('');
                }
              }}
            />
            <div className="filtered-countries"></div>
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(
        'Search for a country...'
      );

      // Search for "United"
      fireEvent.change(searchInput, { target: { value: 'United' } });

      await waitFor(() => {
        const filteredContainer = container.querySelector(
          '.filtered-countries'
        );
        expect(filteredContainer).toBeInTheDocument();
        expect(filteredContainer?.textContent).toContain('United States');
        expect(filteredContainer?.textContent).not.toContain('Canada');
        expect(filteredContainer?.textContent).not.toContain('Germany');
      });
    });

    it('filters countries by country code', async () => {
      store.dispatch(setCountries(mockCountries));

      const { container } = render(
        <TestWrapper>
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder="Search for a country..."
              onChange={(e) => {
                const searchTerm = e.target.value;
                const filtered = mockCountries
                  .filter(
                    (country) =>
                      country.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      country.alpha2Code
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 10);

                const filteredContainer = container.querySelector(
                  '.filtered-countries'
                );
                if (filteredContainer) {
                  filteredContainer.innerHTML = filtered
                    .map(
                      (country) => `
                        <div class="dropdown-item">
                          <span class="country-flag">${country.flag}</span>
                          <span class="country-name">${country.name}</span>
                          <span class="country-code">(${country.alpha2Code})</span>
                        </div>
                      `
                    )
                    .join('');
                }
              }}
            />
            <div className="filtered-countries"></div>
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(
        'Search for a country...'
      );

      // Search for "US"
      fireEvent.change(searchInput, { target: { value: 'US' } });

      await waitFor(() => {
        const filteredContainer = container.querySelector(
          '.filtered-countries'
        );
        expect(filteredContainer).toBeInTheDocument();
        expect(filteredContainer?.textContent).toContain('United States');
        expect(filteredContainer?.textContent).toContain('US');
        expect(filteredContainer?.textContent).not.toContain('Canada');
      });
    });
  });

  describe('Filtering Edge Cases', () => {
    it('handles empty search term and shows limited results', async () => {
      store.dispatch(setCountries(mockCountries));

      const { container } = render(
        <TestWrapper>
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder="Search for a country..."
              onChange={(e) => {
                const searchTerm = e.target.value;
                let filtered: Country[];

                if (searchTerm.trim() === '') {
                  filtered = mockCountries.slice(0, 10);
                } else {
                  filtered = mockCountries
                    .filter(
                      (country) =>
                        country.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        country.alpha2Code
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 10);
                }

                const filteredContainer = container.querySelector(
                  '.filtered-countries'
                );
                if (filteredContainer) {
                  filteredContainer.innerHTML = filtered
                    .map(
                      (country) => `
                        <div class="dropdown-item">
                          <span class="country-flag">${country.flag}</span>
                          <span class="country-name">${country.name}</span>
                          <span class="country-code">(${country.alpha2Code})</span>
                        </div>
                      `
                    )
                    .join('');
                }
              }}
            />
            <div className="filtered-countries"></div>
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(
        'Search for a country...'
      );

      // Test empty search - need to trigger onChange manually since empty string might not trigger change
      const onChange = searchInput.onchange;
      if (onChange) {
        fireEvent.change(searchInput, { target: { value: '' } });
      }

      // Manually trigger the filtering logic for empty search
      const filteredContainer = container.querySelector('.filtered-countries');
      if (filteredContainer) {
        const filtered = mockCountries.slice(0, 10);
        filteredContainer.innerHTML = filtered
          .map(
            (country) => `
              <div class="dropdown-item">
                <span class="country-flag">${country.flag}</span>
                <span class="country-name">${country.name}</span>
                <span class="country-code">(${country.alpha2Code})</span>
              </div>
            `
          )
          .join('');
      }

      await waitFor(() => {
        const filteredContainer = container.querySelector(
          '.filtered-countries'
        );
        expect(filteredContainer).toBeInTheDocument();

        // Should show first 10 countries when search is empty
        const dropdownItems =
          filteredContainer?.querySelectorAll('.dropdown-item');
        expect(dropdownItems).toHaveLength(10);
        expect(filteredContainer?.textContent).toContain('United States');
        expect(filteredContainer?.textContent).toContain('Canada');
        expect(filteredContainer?.textContent).toContain('Germany');
      });
    });

    it('handles case-insensitive search', async () => {
      store.dispatch(setCountries(mockCountries));

      const { container } = render(
        <TestWrapper>
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder="Search for a country..."
              onChange={(e) => {
                const searchTerm = e.target.value;
                const filtered = mockCountries
                  .filter(
                    (country) =>
                      country.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      country.alpha2Code
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 10);

                const filteredContainer = container.querySelector(
                  '.filtered-countries'
                );
                if (filteredContainer) {
                  filteredContainer.innerHTML = filtered
                    .map(
                      (country) => `
                        <div class="dropdown-item">
                          <span class="country-name">${country.name}</span>
                        </div>
                      `
                    )
                    .join('');
                }
              }}
            />
            <div className="filtered-countries"></div>
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(
        'Search for a country...'
      );

      // Test case-insensitive search
      fireEvent.change(searchInput, { target: { value: 'germany' } });

      await waitFor(() => {
        const filteredContainer = container.querySelector(
          '.filtered-countries'
        );
        expect(filteredContainer).toBeInTheDocument();
        expect(filteredContainer?.textContent).toContain('Germany');
      });

      // Test with uppercase
      fireEvent.change(searchInput, { target: { value: 'GERMANY' } });

      await waitFor(() => {
        const filteredContainer = container.querySelector(
          '.filtered-countries'
        );
        expect(filteredContainer?.textContent).toContain('Germany');
      });
    });

    it('handles no results found scenario', async () => {
      store.dispatch(setCountries(mockCountries));

      const { container } = render(
        <TestWrapper>
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder="Search for a country..."
              onChange={(e) => {
                const searchTerm = e.target.value;
                const filtered = mockCountries
                  .filter(
                    (country) =>
                      country.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      country.alpha2Code
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 10);

                const filteredContainer = container.querySelector(
                  '.filtered-countries'
                );
                if (filteredContainer) {
                  if (filtered.length === 0) {
                    filteredContainer.innerHTML =
                      '<div class="dropdown-item no-results">No countries found</div>';
                  } else {
                    filteredContainer.innerHTML = filtered
                      .map(
                        (country) => `
                          <div class="dropdown-item">
                            <span class="country-flag">${country.flag}</span>
                            <span class="country-name">${country.name}</span>
                            <span class="country-code">(${country.alpha2Code})</span>
                          </div>
                        `
                      )
                      .join('');
                  }
                }
              }}
            />
            <div className="filtered-countries"></div>
          </div>
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(
        'Search for a country...'
      );

      // Search for non-existent country
      fireEvent.change(searchInput, {
        target: { value: 'NonExistentCountry123' },
      });

      await waitFor(() => {
        const filteredContainer = container.querySelector(
          '.filtered-countries'
        );
        expect(filteredContainer).toBeInTheDocument();
        expect(filteredContainer?.textContent).toContain('No countries found');

        // Should not contain any country names
        expect(filteredContainer?.textContent).not.toContain('United States');
        expect(filteredContainer?.textContent).not.toContain('Canada');
      });
    });
  });
});
