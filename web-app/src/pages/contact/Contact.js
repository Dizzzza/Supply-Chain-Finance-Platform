import React from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Свяжитесь с нами
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Мы всегда готовы помочь вам и ответить на все вопросы
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Контактная информация */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Контактная информация</h3>
            <div className="mt-8 space-y-6">
              <div className="flex items-center">
                <PhoneIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-lg text-gray-500">+7 (777) 777-77-77</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-lg text-gray-500">info@supplychain.finance</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-lg text-gray-500">
                  Алматы, ул. Сатпаева 22, офис 505
                </span>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-xl font-semibold text-gray-900">Часы работы</h4>
              <div className="mt-4 space-y-2 text-lg text-gray-500">
                <p>Понедельник - Пятница: 9:00 - 18:00</p>
                <p>Суббота - Воскресенье: Выходной</p>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Напишите нам</h3>
            <form className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ваше имя
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Тема
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Сообщение
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Отправить сообщение
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 