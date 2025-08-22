import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { getCountries, type apiCountry } from '../../api/baseUrl';
import { type Country } from '../types';
import { serializeCountry } from '../helper';

interface SelectedCountriesState {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SelectedCountriesState = {
  countries: [],
  isLoading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk(
  'selectedCountries/fetchCountries',
  async () => {
    const countries = await getCountries();
    const countriesArray = Array.isArray(countries)
      ? countries
      : (Object.values(countries) as apiCountry[]);
    const serializedCountries = countriesArray.map((country) =>
      serializeCountry(country)
    );

    return serializedCountries;
  }
);

const selectedCountriesSlice = createSlice({
  name: 'selectedCountries',
  initialState,
  reducers: {
    setCountries: (state, action: PayloadAction<Country[]>) => {
      state.countries = action.payload;
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.countries = action.payload;
        state.error = null;

        if (action.payload && action.payload.length > 0) {
          console.log('Countries loaded successfully, setting to form state');
        }
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch countries';
      });
  },
});

export const { setCountries, setIsLoading, setError } =
  selectedCountriesSlice.actions;
export default selectedCountriesSlice.reducer;
