import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { fetchCurrentUser } from './store/slices/authSlice';
import type { RootState, AppDispatch } from './store';
import { settingAPI } from './common/api/adminAPI';
import AdminLayout from './app/Admin/AdminLayout';
import UserLayout from './app/User/UserLayout/Usermain';
import AuthLayout from './app/pages/auth/AuthLayout';       
import MovieManager from './app/Admin/pages/Movie/MovieManager';
import GenreManager from './app/Admin/pages/GenreManager';
import ProtectedRoute from './app/ProtectedRoute';
import MovieTrash from '../src/app/Admin/pages/Movie/MovieTrash';
import CinemaManager from './app/Admin/pages/Cinema/CinemaManager';
import SeatManager from './app/Admin/pages/Seat/seatManager';
import ShowtimeManeger from './app/Admin/pages/Showtimes/ShowtimeManeger';
import UserManager from './app/Admin/pages/User/UserManager';
import ProductManager from './app/Admin/pages/Products/Productmanager';
import OrderManager from './app/Admin/pages/Booking/BookingManager';
import Dashboard from './app/Admin/pages/Dashboard/Dashboard';
import Home from './app/User/Home/Home';
import MovieDetails from './app/User/Movie/MovieDetail';
import Booking from './app/User/Booking/Booking';
import PaymentResult from './app/User/Booking/PaymentResults';
import MyTickets from './app/User/Order/MyOrder';
import Profile from './app/User/Profile/Profile';
import VerifyAccount from './app/pages/VerifyAccount';
import ForgotPassword from './app/pages/ForgotPassword';
import ResetPassword from './app/pages/ResetPassword';
import Upcoming from './app/User/Movie/UpComing';
import Cinemas from './app/User/Cinema/Cinema';
import SuggestedMoviesPage from './app/User/Movie/SuggestedMoviesPage';
import AdminVoucher from './app/Admin/Voucher/Adminvoucher';
import QRScanner from './app/Admin/pages/Checkin/QRscanner';
import SearchResults from './app/User/Movie/SearchResults';
import NowShowing from './app/User/Movie/NowShowing';
import PointManager from './app/Admin/pages/Points/PointManager';
import Settings from './app/Admin/pages/Settings/WebsiteManager';
import MaintenancePage from './app/pages/MaintenancePage';
import VoucherList from './app/User/Voucher/VoucherList';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token,user } = useSelector((state: RootState) => state.auth);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [settingLoaded, setSettingLoaded] = useState(false);

    useEffect(() => {
      if (token) {
        dispatch(fetchCurrentUser());
      }
    }, [dispatch, token]);

   useEffect(() => {
    settingAPI.getSettings()
      .then(res => {
        setIsMaintenance(res.data.maintenanceMode);
      })
      .catch(() => {}) // Lỗi thì cứ cho vào bình thường
      .finally(() => setSettingLoaded(true));
      }, []);

      if (!settingLoaded) {
        return <div style={{ color: 'white' }}>Loading...</div>;
      }
      const isAdmin = user?.role === 'ADMIN';
      const isAuthPage = window.location.pathname.startsWith('/login') || 
                        window.location.pathname.startsWith('/register');

      if (isMaintenance && !isAdmin && !isAuthPage) {
        return <MaintenancePage />;
      }

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Auth routes — dùng chung AuthLayout để có hiệu ứng sliding panel ── */}
        <Route path="/login"    element={<AuthLayout />} />
        <Route path="/register" element={<AuthLayout />} />

        {/* ── User routes ── */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/now-showing" element={<NowShowing />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="booking/:id" element={<Booking />} />
          <Route path="/payment/result" element={<PaymentResult />} />
          <Route path="my-bookings" element={<MyTickets />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/cinemas" element={<Cinemas />} />
          <Route path="/for-you" element={<SuggestedMoviesPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/vouchers" element={<VoucherList />} />
        </Route>

        {/* ── Admin routes ── */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={
            <AntdApp>
              <AdminLayout />
            </AntdApp>
          }>
            <Route index element={<div>Đây là trang Dashboard Admin (Antd)</div>} />
            <Route path="movies" element={<MovieManager />} />
            <Route path="movies/trash" element={<MovieTrash />} />
            <Route path="genres" element={<GenreManager />} />
            <Route path="cinemas" element={<CinemaManager />} />
            <Route path="rooms/:roomId/seats" element={<SeatManager />} />
            <Route path="showtimes" element={<ShowtimeManeger />} />
            <Route path="vouchers" element={<AdminVoucher />} />
            <Route path="users" element={<UserManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="bookings" element={<OrderManager />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="checkin" element={<QRScanner />} />
            <Route path="points" element={<PointManager />} />
            <Route path="settings" element={<Settings />} />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;