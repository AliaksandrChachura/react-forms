import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type formValues } from '../../components/forms/rhfForm/types';
import { defaultValues } from '../../components/forms/rhfForm/types';

const selectedUncontrolledFormSlice = createSlice({
  name: 'controlledForm',
  initialState: defaultValues,
  reducers: {
    setUncontrolledFormValue: (
      state: formValues,
      action: PayloadAction<formValues>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUncontrolledFormValue } =
  selectedUncontrolledFormSlice.actions;
export default selectedUncontrolledFormSlice.reducer;
