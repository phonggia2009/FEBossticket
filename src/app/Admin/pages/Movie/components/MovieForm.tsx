import  { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createMovie, updateMovie } from '../../../../../common/api/adminAPI';



const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

const MovieForm = ({ open, onCancel, onSuccess, editingMovie, genres }: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [posterList, setPosterList] = useState<any[]>([]);
  const [bannerList, setBannerList] = useState<any[]>([]);
  const trailerUrl = Form.useWatch('trailerUrl', form);
  const videoId = getYouTubeID(trailerUrl);

  // Hàm kiểm tra file trước khi upload
  const validateFile = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên tệp JPG/PNG/WebP!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }
    return false; // Trả về false để Ant Design không tự động gọi API upload riêng lẻ
  };

  useEffect(() => {
    if (open) {
      if (editingMovie) {
        const initialPoster = editingMovie.posterUrl ? [{
          uid: '-1', name: 'Poster', status: 'done', url: editingMovie.posterUrl
        }] : [];
        const initialBanners = editingMovie.banners?.map((url: string, index: number) => ({
          uid: `${index}`, name: `Banner ${index + 1}`, status: 'done', url: url
        })) || [];

        setPosterList(initialPoster);
        setBannerList(initialBanners);

        form.setFieldsValue({
          ...editingMovie,
          releaseDate: dayjs(editingMovie.releaseDate),
          genreIds: editingMovie.genres?.map((g: any) => g.id),
          image: initialPoster,
          banners: initialBanners
        });
      } else {
        form.resetFields();
        setPosterList([]);
        setBannerList([]);
      }
    }
  }, [open, editingMovie, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description || '');
      formData.append('releaseDate', values.releaseDate.format('YYYY-MM-DD'));
      formData.append('trailerUrl', values.trailerUrl || '');

      if (values.genreIds) {
        values.genreIds.forEach((id: number) => formData.append('genreIds', id.toString()));
      }
      if (values.duration) {
      formData.append('duration', values.duration.toString());
    }
      // ── SỬA LOGIC POSTER Ở ĐÂY ──
      const posterFile = values.image?.[0]?.originFileObj;
      if (posterFile) {
        formData.append('image', posterFile);
      } else if (editingMovie) {
        // Gửi URL cũ hoặc chuỗi rỗng nếu muốn xóa (nhưng rule required sẽ ngăn việc để trống)
        formData.append('remainingPoster', values.image?.[0]?.url || '');
      }

      // Xử lý Banners
      if (values.banners) {
        values.banners.forEach((fileItem: any) => {
          if (fileItem.originFileObj) formData.append('banners', fileItem.originFileObj);
          else if (fileItem.url) formData.append('remainingBanners', fileItem.url);
        });
      }

      if (editingMovie) {
        await updateMovie(editingMovie.id, formData);
        message.success('Cập nhật thành công!');
      } else {
        await createMovie(formData);
        message.success('Thêm mới thành công!');
      }
      onSuccess();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      width={800}
      title={editingMovie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="title" label="Tiêu đề phim" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
          <Input />
        </Form.Item>
            <Form.Item 
              name="duration" 
              label="Thời lượng (phút)" 
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
            >
              <InputNumber 
                min={1} 
                placeholder="Ví dụ: 120" 
                style={{ width: '100%' }} 
                addonAfter="phút"
              />
            </Form.Item>

        <Form.Item name="trailerUrl" label="Link Trailer (YouTube)">
          <Input placeholder="Dán link YouTube..." allowClear />
        </Form.Item>

        {/* Video Preview */}
        {videoId && (
          <div className="mb-4 aspect-video rounded-lg overflow-hidden border bg-black">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen></iframe>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="releaseDate" label="Ngày phát hành" rules={[{ required: true, message: 'Chọn ngày phát hành!' }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="genreIds" label="Thể loại" rules={[{ required: true, message: 'Chọn ít nhất 1 thể loại!' }]}>
            <Select mode="multiple" placeholder="Chọn thể loại">
              {genres.map((g: any) => <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          {/* Thêm ràng buộc cho Poster */}
          <Form.Item 
            name="image" 
            label="Poster (Bắt buộc)" 
            valuePropName="fileList" 
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Phim phải có ảnh Poster!' }]}
          >
            <Upload 
              listType="picture" 
              maxCount={1} 
              beforeUpload={validateFile} 
              fileList={posterList} 
              onChange={({ fileList }) => setPosterList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn Poster</Button>
            </Upload>
          </Form.Item>

          <Form.Item 
            name="banners" 
            label="Bộ sưu tập Banner" 
            valuePropName="fileList" 
            getValueFromEvent={normFile}
          >
            <Upload 
              listType="picture" 
              multiple 
              beforeUpload={validateFile} 
              fileList={bannerList} 
              onChange={({ fileList }) => setBannerList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn Banners</Button>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default MovieForm;