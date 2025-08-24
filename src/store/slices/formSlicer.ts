import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type FormSchema } from '../../components/forms/controlled/schema';

const defaultFormValues: FormSchema = {
  name: '',
  age: 0,
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  terms: false,
  imageBase64: '',
  country: '',
};

const selectedControlledFormSlice = createSlice({
  name: 'controlledForm',
  initialState: defaultFormValues,
  reducers: {
    setFormValue: (state: FormSchema, action: PayloadAction<FormSchema>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFormValue } = selectedControlledFormSlice.actions;
export default selectedControlledFormSlice.reducer;
