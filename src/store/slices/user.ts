import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IState {
  idInstance: string;
  apiTokenInstance: string;
}

const initialState: IState = {
  idInstance: '',
  apiTokenInstance: '',
};

// create a slice
export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIdInstance: (state, action: PayloadAction<string>) => {
      state.idInstance = action.payload;
    },
    setApiTokenInstance: (state, action: PayloadAction<string>) => {
      state.apiTokenInstance = action.payload;
    },
  },
});

// export all needed selectors
export const selectIdInstance = (state: RootState) => state.user.idInstance;
export const selectApiTokenInstance = (state: RootState) =>
  state.user.apiTokenInstance;

// actions
export const { setIdInstance, setApiTokenInstance } = slice.actions;

export default slice.reducer;
