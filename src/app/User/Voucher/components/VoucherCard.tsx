import React from "react";

export interface Voucher {
  id: string;
  title: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  min_order_value: number;
  end_date: string;
  image?: string;
}

const VoucherCard: React.FC<{ voucher: Voucher }> = ({ voucher }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:scale-105 transition">
      {voucher.image && (
        <img
          src={voucher.image}
          alt={voucher.title}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}

      <h3 className="text-white font-bold text-lg mb-2">
        {voucher.title}
      </h3>

      <p className="text-green-400 font-semibold">
        {voucher.discount_value}
        {voucher.discount_type === "PERCENTAGE" ? "%" : "đ"}
      </p>

      <p className="text-zinc-400 text-sm mt-1">
        Đơn tối thiểu: {voucher.min_order_value}đ
      </p>

      <p className="text-zinc-500 text-xs mt-1">
        HSD: {new Date(voucher.end_date).toLocaleDateString()}
      </p>

      <div className="mt-3 flex justify-between items-center">
        <span className="bg-zinc-800 px-2 py-1 rounded text-sm text-white">
          {voucher.code}
        </span>

        <button
          onClick={handleCopy}
          className="text-xs bg-green-600 hover:bg-green-500 px-2 py-1 rounded"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;