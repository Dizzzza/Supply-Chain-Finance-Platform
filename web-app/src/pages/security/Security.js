import React from 'react';
import { Link } from 'react-router-dom';

const Security = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Безопасность</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Управление безопасностью вашего аккаунта</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="space-y-6">
              <div className="px-4 py-5 sm:px-6">
                <h4 className="text-md font-medium text-gray-900">Смена пароля</h4>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                      Текущий пароль
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      Новый пароль
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Подтвердите новый пароль
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900">Двухфакторная аутентификация</h4>
                <div className="mt-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="2fa"
                        name="2fa"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="2fa" className="font-medium text-gray-700">
                        Включить двухфакторную аутентификацию
                      </label>
                      <p className="text-gray-500">Добавьте дополнительный уровень безопасности к вашему аккаунту</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900">Активные сессии</h4>
                <div className="mt-4">
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Текущая сессия</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      Windows 10, Chrome 120.0.0.0
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Последний вход</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      01.01.2024 12:00
                    </dd>
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <Link
                    to="/profile"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Отмена
                  </Link>
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Сохранить изменения
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security; 