import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { checkInBookingApi } from '../../../../common/api/adminAPI';
import {
  Typography,
  message,
  Button,
  Space,
  Modal,
  Tag,
  Badge,
  Avatar,
  Divider,
  Spin,
} from 'antd';
import {
  ScanOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  UserOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import './QRScanner.css';

const { Title, Text, Paragraph } = Typography;

// Biến module-level — tồn tại xuyên suốt vòng đời của module,
// Strict Mode không thể reset được
let scannerInstance: Html5QrcodeScanner | null = null;
let isInitialized = false; // cờ thứ 2 để chặn race condition

const QRScanner = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const isProcessing = useRef(false);
  const processCheckInRef = useRef<(text: string) => void>(() => {});

  const [ticketDetail, setTicketDetail] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const processCheckIn = useCallback(async (decodedText: string) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setScanStatus('loading');

    try {
      const res = await checkInBookingApi({ booking_id: decodedText });
      const bookingData = res.data?.data?.booking || res.data?.booking;
      setTicketDetail(bookingData);
      setScanStatus('success');
      setIsModalVisible(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Mã vé không hợp lệ hoặc đã được sử dụng!';
      setErrorMsg(msg);
      setScanStatus('error');
      setTimeout(() => setScanStatus('idle'), 3000);
    } finally {
      setTimeout(() => {
        isProcessing.current = false;
      }, 3000);
    }
  }, []);

  useEffect(() => {
    processCheckInRef.current = processCheckIn;
  }, [processCheckIn]);

  useEffect(() => {
    // Dùng 2 cờ: nếu một trong hai đã true thì bỏ qua
    if (isInitialized || scannerInstance) return;

    isInitialized = true;

    scannerInstance = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
        disableFlip: false,
      },
      false
    );

    scannerInstance.render(
      (text) => processCheckInRef.current(text),
      () => {}
    );

    // KHÔNG return cleanup ở đây — để Strict Mode unmount/remount
    // không ảnh hưởng. Scanner sẽ tự clear khi component bị destroy thật sự.
    // Nếu cần cleanup khi navigate ra ngoài trang, dùng cách bên dưới:
    return () => {
      // Chỉ clear khi thật sự unmount (không phải Strict Mode double-invoke)
      // Trick: dùng setTimeout 0 để Strict Mode remount kịp set lại cờ trước
      setTimeout(() => {
        if (!isInitialized) {
          scannerInstance?.clear().catch(console.error);
          scannerInstance = null;
        }
      }, 0);
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const html5QrCode = new Html5Qrcode('hidden-reader');
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      processCheckIn(decodedText);
    } catch {
      messageApi.error('Không tìm thấy mã QR hợp lệ trong ảnh này!');
    } finally {
      e.target.value = '';
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setScanStatus('idle');
    setTicketDetail(null);
  };

  const statusConfig = {
    idle:    { color: '#1677ff', bg: '#e6f4ff', border: '#91caff' },
    loading: { color: '#faad14', bg: '#fffbe6', border: '#ffe58f' },
    success: { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' },
    error:   { color: '#ff4d4f', bg: '#fff2f0', border: '#ffccc7' },
  };

  const current = statusConfig[scanStatus];

  return (
    <div className="qr-page-wrapper">
      {contextHolder}

      <div className="qr-header">
        <div className="qr-logo-wrap">
          <ScanOutlined className="qr-logo-icon" />
        </div>
        <Title level={3} className="qr-title">Hệ Thống Soát Vé</Title>
        <Text type="secondary" className="qr-subtitle">
          Đưa mã QR vào khung hình để kiểm tra vé tự động
        </Text>
      </div>

      <div className="qr-main-grid">
        {/* Camera Panel */}
        <div className="qr-panel qr-camera-panel" style={{ borderColor: current.border, background: current.bg }}>
          <div className="qr-panel-label">
            <Badge
              status={
                scanStatus === 'idle'    ? 'processing' :
                scanStatus === 'loading' ? 'warning'    :
                scanStatus === 'success' ? 'success'    : 'error'
              }
            />
            <Text strong style={{ color: current.color, marginLeft: 6, fontSize: 13 }}>
              {scanStatus === 'idle'    && 'Đang chờ quét...'}
              {scanStatus === 'loading' && 'Đang xử lý vé...'}
              {scanStatus === 'success' && 'Soát vé thành công!'}
              {scanStatus === 'error'   && errorMsg}
            </Text>
          </div>

          {scanStatus === 'loading' ? (
            <div className="qr-loading-overlay">
              <Spin size="large" tip="Đang kiểm tra vé..." />
            </div>
          ) : (
            <div id="reader" className="qr-reader-box" />
          )}

          <div id="hidden-reader" style={{ display: 'none' }} />
        </div>

        {/* Upload Panel */}
        <div className="qr-panel qr-upload-panel">
          <div className="qr-upload-content">
            <div className="qr-upload-icon-wrap">
              <UploadOutlined style={{ fontSize: 28, color: '#8c8c8c' }} />
            </div>
            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 6 }}>
              Tải ảnh QR từ thiết bị
            </Text>
            <Paragraph type="secondary" style={{ fontSize: 13, margin: '0 0 16px' }}>
              Hỗ trợ các định dạng: JPG, PNG, WEBP
            </Paragraph>
            <Button
              icon={<UploadOutlined />}
              size="middle"
              style={{ borderRadius: 8 }}
              onClick={() => document.getElementById('qr-upload-input')?.click()}
            >
              Chọn ảnh
            </Button>
            <input
              id="qr-upload-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          <Divider style={{ margin: '20px 0' }} />

          <div className="qr-tips">
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>
              Lưu ý khi quét vé
            </Text>
            {[
              'Đảm bảo đủ ánh sáng khi quét camera',
              'Giữ mã QR phẳng và rõ nét',
              'Mỗi vé chỉ được soát một lần',
            ].map((tip, i) => (
              <div key={i} className="qr-tip-item">
                <span className="qr-tip-dot" />
                <Text type="secondary" style={{ fontSize: 13 }}>{tip}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleClose}
        width={640}
        centered
        footer={null}
        closable={false}
        className="qr-success-modal"
      >
        {ticketDetail && (
          <div className="modal-inner">
            <div className="modal-header-band">
              <CheckCircleOutlined className="modal-check-icon" />
              <div>
                <Text strong style={{ fontSize: 18, display: 'block', color: '#389e0d' }}>
                  Soát Vé Thành Công
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Mã đơn:{' '}
                  <Text copyable strong code>{ticketDetail.booking_id}</Text>
                </Text>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title"><UserOutlined /> Thông tin khách hàng</div>
              <div className="modal-customer-row">
                <Avatar size={44} icon={<UserOutlined />} style={{ background: '#1677ff', flexShrink: 0 }} />
                <div>
                  <Text strong style={{ fontSize: 15, display: 'block' }}>
                    {ticketDetail.user?.fullName || '—'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {ticketDetail.user?.phoneNumber || ticketDetail.user?.email || '—'}
                  </Text>
                </div>
              </div>
            </div>

            <Divider style={{ margin: '0 0 16px' }} />

            <div className="modal-section">
              <div className="modal-section-title"><VideoCameraOutlined /> Thông tin suất chiếu</div>
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <Text type="secondary" style={{ fontSize: 12 }}>Phim</Text>
                  <Text strong style={{ fontSize: 15, color: '#cf1322' }}>
                    {ticketDetail.showtime?.movie?.title || '—'}
                  </Text>
                </div>
                <div className="modal-info-item">
                  <Text type="secondary" style={{ fontSize: 12 }}><ClockCircleOutlined /> Suất chiếu</Text>
                  <Text strong>{formatDateTime(ticketDetail.showtime?.start_time)}</Text>
                </div>
                <div className="modal-info-item">
                  <Text type="secondary" style={{ fontSize: 12 }}><EnvironmentOutlined /> Rạp</Text>
                  <Text>
                    {ticketDetail.showtime?.room?.cinema?.cinema_name}
                    {' — '}
                    <Text strong>Phòng {ticketDetail.showtime?.room?.room_name}</Text>
                  </Text>
                </div>
                <div className="modal-info-item">
                  <Text type="secondary" style={{ fontSize: 12 }}>Ghế ngồi</Text>
                  <Space wrap size={4}>
                    {ticketDetail.tickets?.map((t: any) => (
                      <Tag color="blue" key={t.id}
                        style={{ fontWeight: 600, fontSize: 13, padding: '2px 10px', borderRadius: 6 }}>
                        {t.seat?.seat_row}{t.seat?.seat_number}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            </div>

            {ticketDetail.products && ticketDetail.products.length > 0 && (
              <>
                <Divider style={{ margin: '0 0 16px' }} />
                <div className="modal-section">
                  <div className="modal-section-title"><CoffeeOutlined /> Bắp nước</div>
                  <div className="modal-products">
                    {ticketDetail.products.map((p: any, i: number) => (
                      <div key={i} className="modal-product-row">
                        <Text style={{ fontSize: 14 }}>{p.product?.product_name}</Text>
                        <Tag style={{ borderRadius: 20, fontWeight: 600 }}>x{p.quantity}</Tag>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="modal-footer">
              <Button
                type="primary" size="large" icon={<ScanOutlined />}
                onClick={handleClose}
                style={{ borderRadius: 10, flex: 1, height: 46 }}
              >
                Đóng &amp; Quét Vé Tiếp Theo
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QRScanner;