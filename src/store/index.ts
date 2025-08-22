import { configureStore } from '@reduxjs/toolkit';
import selectedControlledFormSlice from './slices/formSlicer';
import selectedUncontrolledFormSlice from './slices/uncontrolledFormSlicer';
import selectedCountriesSlice from './slices/selectedCountries';

export const store = configureStore({
  reducer: {
    controlledForm: selectedControlledFormSlice,
    uncontrolledForm: selectedUncontrolledFormSlice,
    selectedCountries: selectedCountriesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
