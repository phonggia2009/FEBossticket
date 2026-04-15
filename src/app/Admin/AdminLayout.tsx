import { Layout, Menu, Button, } from 'antd';
import { LogoutOutlined, DashboardOutlined, UserOutlined, TagsOutlined, VideoCameraOutlined,EnvironmentOutlined,HomeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import logo from '../../assets/logoadmin.png';
import type { RootState } from '../../store';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };
  const handleLogout = () => {
    dispatch(logout()); // Xóa state trong Redux
    navigate('/login'); // Quay về trang đăng nhập
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
       <div style={{margin: 16,display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
        <img src={logo} alt="logo"style={{height: 40, objectFit: 'contain',filter: 'drop-shadow(0 0 6px rgba(255,0,0,0.7))'}}/></div>
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={['/admin']} 
          onClick={handleMenuClick}
          items={[
            {key:'/admin/checkin',icon: <HomeOutlined />, label: 'Soát vé Check-in' },
            {key: '/admin/showtimes', icon: <HomeOutlined />, label: 'Quản lý Lịch chiếu' },
            {key: '/admin/bookings', icon: <HomeOutlined />, label: 'Quản lý Đơn hàng' },
            {key:'/admin/vouchers', icon: <TagsOutlined />, label: 'Quản lý Mã giảm giá' },
            { key: '/admin/movies', icon: <VideoCameraOutlined />, label: 'Quản lý Phim' },
            { key: '/admin/cinemas', icon: <EnvironmentOutlined />, label: 'Quản lý Rạp' },
            { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý User' },
            { key: '/admin/points', icon: <TagsOutlined />, label: 'Quản lý Điểm' },
            { key: '/admin/products', icon: <TagsOutlined />, label: 'Quản lý Sản phẩm' },
            { key: '/admin/genres', icon: <TagsOutlined />, label: 'Quản lý Thể loại' },
            { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Báo Cáo Tổng Quan' },
          ]} 
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Chào mừng, <strong>{user?.fullName || 'Admin'}</strong></span>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;