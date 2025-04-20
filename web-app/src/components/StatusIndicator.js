import React from 'react';

const StatusIndicator = ({ status, size = 'md' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      active: {
        color: 'bg-green-500',
        text: 'Активен',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      pending: {
        color: 'bg-yellow-500',
        text: 'В ожидании',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      inactive: {
        color: 'bg-gray-500',
        text: 'Неактивен',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      error: {
        color: 'bg-red-500',
        text: 'Ошибка',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    };

    return configs[status] || configs.inactive;
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${config.color} mr-2`}></span>
      <span className="text-gray-700">{config.text}</span>
    </div>
  );
};

export default StatusIndicator; 