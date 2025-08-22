import { configureStore } from '@reduxjs/toolkit';
import selectedControlledFormSlice from './slices/formSlicer';
import selectedCountriesSlice from './slices/selectedCountries';

export const store = configureStore({
  reducer: {
    form: selectedControlledFormSlice,
    selectedCountries: selectedCountriesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
