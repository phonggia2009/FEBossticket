import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../common/api/axiosInstance';

// 1. Định nghĩa cấu trúc dữ liệu cho State
interface AuthState {
  user: any | null;       
  token: string | null;
  loading: boolean;
  error: string | null;   
}

// Hàm lấy thông tin user từ localStorage
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

// 2. Sử dụng hàm getUserFromStorage cho initialState
const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      // Backend của bạn trả về data có dạng { token, user } hoặc tương tự
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/profile'); 
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
        
        // SỬA Ở ĐÂY: Đảm bảo lưu cả user vào localStorage khi đăng nhập thành công
        localStorage.setItem('token', action.payload.token);
        if (action.payload.user) {
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
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
          // Có thể cập nhật lại localStorage cho chắc chắn
          localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action: any) => {
        if (action.payload?.status === 401) {
          state.user = null;
          state.token = null;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;