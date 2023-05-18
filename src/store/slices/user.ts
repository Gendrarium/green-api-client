import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

export interface IState {
  idInstance: string;
  apiTokenInstance: string;
  loggedIn: boolean;
  authChecking: boolean;
}

const initialState: IState = {
  idInstance: '',
  apiTokenInstance: '',
  loggedIn: false,
  authChecking: true,
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
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setAuthChecking: (state, action: PayloadAction<boolean>) => {
      state.authChecking = action.payload;
    },
  },
});

// export all needed selectors
export const selectIdInstance = (state: RootState) => state.user.idInstance;
export const selectApiTokenInstance = (state: RootState) =>
  state.user.apiTokenInstance;
export const selectLoggedIn = (state: RootState) => state.user.loggedIn;
export const selectAuthChecking = (state: RootState) => state.user.authChecking;

// actions
export const {
  setIdInstance,
  setApiTokenInstance,
  setAuthChecking,
  setLoggedIn,
} = slice.actions;

export const handleLogin = (id: string, apiToken: string): AppThunk => {
  return (dispatch, getState, api) => {
    api
      .getSettings({ idInstance: id, apiTokenInstance: apiToken })
      .then((res) => {
        if (res) {
          if (res.incomingWebhook === 'no' || res.outgoingWebhook === 'no') {
            api
              .setSettings({
                idInstance: id,
                apiTokenInstance: apiToken,
                incomingWebhook: 'yes',
                outgoingWebhook: 'yes',
              })
              .then((res) => {
                if (res) {
                  console.log('Настройки сохранены');
                }
              });
          }
        }
      });

    dispatch(setLoggedIn(true));
    dispatch(setIdInstance(id));
    dispatch(setApiTokenInstance(apiToken));
  };
};

export const handleLogout = (): AppThunk => {
  return (dispatch) => {
    dispatch(setLoggedIn(false));
    dispatch(setIdInstance(''));
    dispatch(setApiTokenInstance(''));
  };
};

export default slice.reducer;
