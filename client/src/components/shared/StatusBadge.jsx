import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status, size = 'default' }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.default;

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;