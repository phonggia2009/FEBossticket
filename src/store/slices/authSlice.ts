import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../common/api/axiosInstance';

// 1. Định nghĩa cấu trúc dữ liệu cho State
interface AuthState {
  user: any | null;       // Hoặc định nghĩa Interface User cụ thể
  token: string | null;
  loading: boolean;
  error: string | null;   // Khai báo rõ ràng: có thể là string HOẶC null
}

const getUserFromStorage = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

// 2. Sử dụng Interface cho initialState
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token')  || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data.data; 
    } catch (error: any) {
      // Đảm bảo trả về message là string
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data; // Trả về thông báo thành công từ BE
    } catch (error: any) {
      // Trả về lỗi từ BE (ví dụ: Email đã tồn tại)
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/profile'); // ← sửa route
      return response.data.data.user; 
    } catch (error: any) {
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // Bây giờ state.error đã hiểu là có thể nhận string
        state.error = action.payload as string; 
      })
              .addCase(registerUser.pending, (state) => {
                  state.loading = true;
                  state.error = null;
              })
              .addCase(registerUser.fulfilled, (state) => {
                  state.loading = false;
                  state.error = null;
              })
              .addCase(registerUser.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload as string;
              })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
          state.user = action.payload;
        })
      .addCase(fetchCurrentUser.rejected, (state, action: any) => {
        if (action.payload?.status === 401) {
          state.user = null;
          state.token = null;
          localStorage.removeItem('token');
        }
        // Lỗi mạng hoặc lỗi khác → giữ nguyên token
      })
  
          },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;