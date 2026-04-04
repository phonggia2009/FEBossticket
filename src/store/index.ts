import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Kiểm tra kỹ đường dẫn này


export const store = configureStore({
  reducer: {
    auth: authReducer, // Đảm bảo authReducer KHÔNG bị undefined
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;