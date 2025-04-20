import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          О платформе SupplyChain Finance
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Инновационное решение для управления цепочками поставок и финансирования торговых операций
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Наша миссия</h3>
            <p className="mt-4 text-lg text-gray-500">
              Мы стремимся упростить и оптимизировать процессы в цепочках поставок, 
              обеспечивая прозрачность и эффективность для всех участников: 
              поставщиков, покупателей и финансистов.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Преимущества</h3>
            <ul className="mt-4 space-y-4 text-lg text-gray-500">
              <li>• Прозрачность операций через блокчейн</li>
              <li>• Быстрое финансирование торговых операций</li>
              <li>• Автоматизация процессов</li>
              <li>• Снижение рисков для всех участников</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900">Технологии</h3>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900">Блокчейн</h4>
                <p className="mt-2 text-base text-gray-500">
                  Использование смарт-контрактов для обеспечения безопасности и прозрачности транзакций
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900">Безопасность</h4>
                <p className="mt-2 text-base text-gray-500">
                  Современные методы шифрования и защиты данных для всех участников платформы
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900">Интеграция</h4>
                <p className="mt-2 text-base text-gray-500">
                  Легкая интеграция с существующими системами учета и ERP
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900">Для кого наша платформа</h3>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900">Поставщики</h4>
                <p className="mt-2 text-base text-gray-500">
                  Управление поставками, получение финансирования, оптимизация процессов
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900">Покупатели</h4>
                <p className="mt-2 text-base text-gray-500">
                  Отслеживание заказов, управление платежами, работа с поставщиками
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900">Финансисты</h4>
                <p className="mt-2 text-base text-gray-500">
                  Оценка рисков, управление инвестициями, мониторинг операций
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 