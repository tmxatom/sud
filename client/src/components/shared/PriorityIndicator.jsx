import React from 'react';
import { PRIORITY_COLORS } from '../../utils/constants';

const PriorityIndicator = ({ priority }) => {
  const colorClass = PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {priority}
    </span>
  );
};

export default PriorityIndicator;