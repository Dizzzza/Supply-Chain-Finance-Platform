import React from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold leading-6 text-gray-900">Настройки аккаунта</h3>
            <p className="mt-1 text-sm text-gray-500">Управление настройками вашего аккаунта</p>
          </div>
          
          <form className="divide-y divide-gray-200">
            {/* Профиль */}
            <div className="px-4 py-6 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Профиль</h4>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Имя пользователя
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      autoComplete="username"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="ivanov"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email адрес
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="ivan@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Локализация */}
            <div className="px-4 py-6 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Локализация</h4>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Язык
                  </label>
                  <div className="mt-1">
                    <select
                      id="language"
                      name="language"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option>Русский</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Часовой пояс
                  </label>
                  <div className="mt-1">
                    <select
                      id="timezone"
                      name="timezone"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option>Москва (UTC+3)</option>
                      <option>Алматы (UTC+6)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Уведомления */}
            <div className="px-4 py-6 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Уведомления</h4>
              <div className="space-y-4">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email-notifications"
                      name="email-notifications"
                      type="checkbox"
                      className="focus:ring-primary-500 h-5 w-5 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="email-notifications" className="font-medium text-gray-700">
                      Email уведомления
                    </label>
                    <p className="text-sm text-gray-500">Получать уведомления на email</p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="push-notifications"
                      name="push-notifications"
                      type="checkbox"
                      className="focus:ring-primary-500 h-5 w-5 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="push-notifications" className="font-medium text-gray-700">
                      Push уведомления
                    </label>
                    <p className="text-sm text-gray-500">Получать push-уведомления</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end space-x-3">
              <Link
                to="/profile"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Отмена
              </Link>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings; 