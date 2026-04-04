
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  loading?: boolean;
}

const SearchBox = ({ placeholder = "Tìm kiếm...", onSearch, loading }: SearchBoxProps) => {
  return (
    <Search
      placeholder={placeholder}
      allowClear
      enterButton={<SearchOutlined />}
      size="large"
      onSearch={onSearch}
      loading={loading}
      className="max-w-md shadow-sm"
    />
  );
};

export default SearchBox;