import React from 'react';
import { Spin } from 'antd';
import { useBooking } from './useBooking';
import SeatMap from './components/SeatMap';
import TicketSummary from './components/TicketSummary';
import PopcornSnacks from './components/PopcornSnacks';

const Booking: React.FC = () => {
  const { 
    loading, submitting, showtime, 
    step, setStep, 
    selectedSeats, holdingSeats, seatRows, handleSeatClick,
    products, selectedProducts, handleProductChange,
    handleNextOrCheckout,
    // LẤY THÊM CÁC PROPS LIÊN QUAN ĐẾN TIỀN VÀ VOUCHER
    seatsPrice, productsPrice, originalTotalPrice, finalTotalPrice,
    voucherCode, setVoucherCode, appliedVoucher, discountAmount, checkingVoucher, voucherError,
    handleApplyVoucher, handleCancelVoucher
  } = useBooking();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spin size="large" /></div>;
  if (!showtime) return <div className="text-white text-center mt-20">Lỗi dữ liệu suất chiếu.</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
      
      {step === 1 ? (
        <SeatMap 
          seatRows={seatRows} 
          selectedSeats={selectedSeats} 
          holdingSeats={holdingSeats}
          onSeatClick={handleSeatClick} 
        />
      ) : (
        <PopcornSnacks 
          products={products}
          selectedProducts={selectedProducts}
          onProductChange={handleProductChange}
          onBack={() => setStep(1)}
        />
      )}

      {/* TRUYỀN HẾT PROPS VÀO ĐÂY */}
      <TicketSummary 
        step={step}
        showtime={showtime}
        selectedSeats={selectedSeats}
        selectedProducts={selectedProducts}
        submitting={submitting}
        onNextOrCheckout={handleNextOrCheckout}
        seatsPrice={seatsPrice}
        productsPrice={productsPrice}
        originalTotalPrice={originalTotalPrice}
        finalTotalPrice={finalTotalPrice}
        voucherCode={voucherCode}
        setVoucherCode={setVoucherCode}
        appliedVoucher={appliedVoucher}
        discountAmount={discountAmount}
        checkingVoucher={checkingVoucher}
        voucherError={voucherError}
        onApplyVoucher={handleApplyVoucher}
        onCancelVoucher={handleCancelVoucher}
      />

    </div>
  );
};

export default Booking;