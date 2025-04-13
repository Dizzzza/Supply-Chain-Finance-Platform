import React from 'react';

const OrderCard = ({ order, onViewDetails }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Заказ #{order.id}</h3>
            <p className="mt-1 text-sm text-gray-500">
              Поставщик: {order.supplier}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Дата создания</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Сумма</p>
            <p className="font-medium text-blue-600">{order.totalAmount} TRX</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Адрес доставки</p>
          <p className="font-medium">{order.deliveryAddress}</p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onViewDetails(order.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 