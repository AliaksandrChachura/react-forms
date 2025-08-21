import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type formValues } from '../../components/forms/rhfForm/types';
import { defaultValues } from '../../components/forms/rhfForm/types';

const selectedControlledFormSlice = createSlice({
  name: 'controlledForm',
  initialState: defaultValues,
  reducers: {
    setControlledFormValue: (
      state: formValues,
      action: PayloadAction<formValues>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setControlledFormValue } = selectedControlledFormSlice.actions;
export default selectedControlledFormSlice.reducer;
