import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import languageReducer from './languageSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
