import { configureStore } from '@reduxjs/toolkit';
import selectedControlledFormSlice from './slices/controlledFormSlicer';
import selectedUncontrolledFormSlice from './slices/uncontrolledFormSlicer';

export const store = configureStore({
  reducer: {
    controlledForm: selectedControlledFormSlice,
    uncontrolledForm: selectedUncontrolledFormSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
