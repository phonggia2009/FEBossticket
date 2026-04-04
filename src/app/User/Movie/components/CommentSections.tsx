import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import { getMovieComments, checkCanComment, createComment } from '../../../../common/api/userAPI';
import type { CommentType } from '../type';

interface Props {
  movieId: string;
}

// ── Star Rating Component ──────────────────────────────────────────────────────
const StarRating: React.FC<{
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
}> = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-2xl transition-colors duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer'} ${
            star <= (hovered || value) ? 'text-red-500' : 'text-zinc-700'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// ── Loading Spinner ────────────────────────────────────────────────────────────
const Spinner: React.FC = () => (
  <div className="flex justify-center py-12">
    <div className="w-8 h-8 border-2 border-zinc-700 border-t-red-600 rounded-full animate-spin" />
  </div>
);

// ── Toast via Portal – tránh bị clip bởi overflow:hidden của parent ──────────
const useToast = () => {
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const show = (text: string, type: 'success' | 'error') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const Toast = toast
    ? createPortal(
        <div
          className={`fixed top-23 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold ${
            toast.type === 'success'
              ? 'bg-green-700 border border-green-500/40'
              : 'bg-red-700 border border-red-500/40'
          }`}
        >
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.text}
        </div>,
        document.body
      )
    : null;

  return { show, Toast };
};

// ── Avatar fallback (thay thế Avatar của antd) ────────────────────────────────
const UserAvatar: React.FC<{ src?: string; name?: string }> = ({ src, name }) => {
  const initial = name?.[0]?.toUpperCase() ?? '?';
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-12 h-12 rounded-full object-cover bg-zinc-800 border border-zinc-700 flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-lg flex-shrink-0">
      {initial}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const CommentSection: React.FC<Props> = ({ movieId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state (thay thế Form.useForm của antd)
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; content?: string }>({});

  const { show, Toast } = useToast();

  const fetchComments = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await getMovieComments(movieId, page);
      setComments(res.data.data.comments);
      setTotalItems(res.data.data.pagination.totalItems);
    } catch (error) {
      console.error('Lỗi lấy danh sách bình luận', error);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  const verifyCommentEligibility = useCallback(async () => {
    try {
      const res = await checkCanComment(movieId);
      setCanComment(res.data.data.canComment);
    } catch {
      setCanComment(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchComments(currentPage);
    verifyCommentEligibility();
  }, [fetchComments, verifyCommentEligibility, currentPage]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!rating) newErrors.rating = 'Vui lòng chọn số sao';
    if (!content.trim()) newErrors.content = 'Vui lòng nhập nội dung bình luận';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createComment({ movieId, rating, content });
      show('Đã gửi bình luận thành công!', 'success');
      setRating(5);
      setContent('');
      setErrors({});

      if (currentPage === 1) {
        fetchComments(1);
      } else {
        setCurrentPage(1);
      }

      setCanComment(false);
    } catch (error: any) {
      show(error.response?.data?.message || 'Có lỗi xảy ra khi gửi bình luận', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(totalItems / 10);

  return (
    <div className="mt-12 pt-8 border-t border-zinc-800/60">
      {Toast}

      {/* ── Header ── */}
      <h3 className="text-2xl font-black text-white mb-6 uppercase text-center md:text-left flex items-center gap-3">
        <span className="w-2 h-8 bg-red-600 rounded-full" />
        Đánh giá &amp; Bình luận ({totalItems})
      </h3>

      {/* ── Form viết bình luận ── */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-colors mb-6">
        {canComment ? (
          <form onSubmit={handleSubmit} noValidate>
            {/* Rating */}
            <div className="mb-4">
              <label className="block text-zinc-300 font-semibold mb-2">
                <span className="text-red-500 mr-1">*</span>Chất lượng phim
              </label>
              <StarRating value={rating} onChange={setRating} />
              {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
            </div>

            {/* Content */}
            <div className="mb-4">
              <div className="relative">
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, 500))}
                  placeholder="Chia sẻ cảm nghĩ của bạn về bộ phim này..."
                  className="w-full bg-zinc-950 border border-zinc-700 text-white placeholder:text-zinc-600 rounded-lg px-4 py-3 text-sm resize-none outline-none focus:border-red-500 hover:border-zinc-500 transition-colors"
                />
                <span className="absolute bottom-2 right-3 text-zinc-600 text-xs">
                  {content.length}/500
                </span>
              </div>
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold px-8 h-10 rounded-lg transition-colors duration-200"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
                Gửi bình luận
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-10 text-center">
            <p className="text-zinc-400 text-lg">Bạn cần đặt vé và xem bộ phim này để có thể viết đánh giá.</p>
            <p className="text-zinc-600 text-sm mt-2">Sau khi xem phim, đánh giá của bạn sẽ được hiển thị tại đây.</p>
          </div>
        )}
      </div>

      {/* ── Danh sách bình luận ── */}
      {loading ? (
        <Spinner />
      ) : comments.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-10 text-center">
          <p className="text-zinc-400 text-lg">Chưa có đánh giá nào cho bộ phim này.</p>
          <p className="text-zinc-600 text-sm mt-2">Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-800/50">
          {comments.map((item) => (
            <div key={item.id} className="py-6 flex gap-4">
              <UserAvatar src={item.user?.avatarUrl} name={item.user?.fullName} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-bold text-base">
                    {item.user?.fullName || 'Khách ẩn danh'}
                  </span>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                    Đã mua vé
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating value={item.rating} readonly />
                  <span className="text-zinc-500 text-xs before:content-['•'] before:mr-2">
                    {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                  </span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination (thay thế pagination của antd List) ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            ← Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-colors ${
                page === currentPage
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;