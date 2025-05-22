import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const getPaginationNumbers = () => {
    const numbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
      return numbers;
    }

    const start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, currentPage + halfVisible);

    if (start > 1) numbers.push(1);
    if (start > 2) numbers.push('...');

    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }

    if (end < totalPages - 1) numbers.push('...');
    if (end < totalPages) numbers.push(totalPages);

    return numbers;
  };

  const numbers = getPaginationNumbers();

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-gray-200 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {t('previous')}
      </button>

      {numbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number as number)}
          className={`px-3 py-1 rounded-md ${
            number === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {number === '...' ? '...' : number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-200 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {t('next')}
      </button>
    </div>
  );
};

export default Pagination;
