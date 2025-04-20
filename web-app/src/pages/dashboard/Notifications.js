import React, { useState } from 'react';
import StatusIndicator from '../../components/StatusIndicator';

const Notifications = () => {
  const [filter, setFilter] = useState('all');

  // Пример данных уведомлений
  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'Новый заказ',
      message: 'Получен новый заказ #12345 от компании "ТехноПром"',
      timestamp: '2024-04-13T10:30:00',
      read: false
    },
    {
      id: 2,
      type: 'payment',
      title: 'Оплата получена',
      message: 'Оплата за заказ #12344 в размере 1500 TRX успешно получена',
      timestamp: '2024-04-13T09:15:00',
      read: true
    },
    {
      id: 3,
      type: 'shipment',
      title: 'Статус поставки изменен',
      message: 'Поставка #7890 отправлена и находится в пути',
      timestamp: '2024-04-12T16:45:00',
      read: false
    },
    {
      id: 4,
      type: 'system',
      title: 'Обновление системы',
      message: 'Запланировано обновление системы на 15 апреля 2024 года',
      timestamp: '2024-04-12T14:20:00',
      read: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'payment':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'shipment':
        return (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Уведомления</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('order')}
            className={`px-4 py-2 rounded-md ${
              filter === 'order' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Заказы
          </button>
          <button
            onClick={() => setFilter('payment')}
            className={`px-4 py-2 rounded-md ${
              filter === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Платежи
          </button>
          <button
            onClick={() => setFilter('shipment')}
            className={`px-4 py-2 rounded-md ${
              filter === 'shipment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Поставки
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-4 py-2 rounded-md ${
              filter === 'system' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Система
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white p-4 rounded-lg shadow-md ${
              !notification.read ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(notification.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-gray-600">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Нет уведомлений</p>
        </div>
      )}
    </div>
  );
};

export default Notifications; 