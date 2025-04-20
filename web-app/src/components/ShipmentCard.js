import React from 'react';

const ShipmentCard = ({ shipment, onTrack }) => {
  const getStatusColor = (status) => {
    const colors = {
      preparing: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800'
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
            <h3 className="text-lg font-medium text-gray-900">
              Поставка #{shipment.id}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Заказ: #{shipment.orderId}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
            {shipment.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Дата отправки</p>
            <p className="font-medium">{formatDate(shipment.shipmentDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ожидаемая доставка</p>
            <p className="font-medium">{formatDate(shipment.estimatedDelivery)}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Трек-номер</p>
          <p className="font-medium">{shipment.trackingNumber}</p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Перевозчик</p>
          <p className="font-medium">{shipment.carrier}</p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onTrack(shipment.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            Отследить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCard; 