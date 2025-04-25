import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ArrowPathIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Безопасность',
    description: 'Все транзакции защищены блокчейном Tron',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Быстрые операции',
    description: 'Мгновенное проведение транзакций',
    icon: ClockIcon,
  },
  {
    name: 'Прозрачность',
    description: 'Полный контроль над всеми операциями',
    icon: DocumentCheckIcon,
  },
];

const stats = [
  { name: 'Активных пользователей', value: '1,000+' },
  { name: 'Транзакций выполнено', value: '10,000+' },
  { name: 'Общий объем операций', value: '$50M+' },
  { name: 'Среднее время транзакции', value: '< 1 мин' },
];

const steps = [
  {
    name: 'Регистрация',
    description: 'Создайте аккаунт и подтвердите свою компанию',
  },
  {
    name: 'Подключение',
    description: 'Подключите свой криптокошелек Tron',
  },
  {
    name: 'Использование',
    description: 'Начните работу с поставками и транзакциями',
  },
];

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block animate-fade-in-up">SupplyChain Finance</span>
            <span className="block text-primary-200 animate-fade-in-up-delay">на блокчейне Tron</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-primary-100 sm:max-w-3xl animate-fade-in-up-delay-2">
            Платформа для эффективного финансирования цепочек поставок с использованием технологии блокчейн.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center animate-fade-in-up-delay-3">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                to="/register"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-primary-50 sm:px-8"
              >
                Начать работу
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="relative bg-white py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-base font-semibold uppercase tracking-wider text-primary-600">
            Преимущества платформы
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Все что нужно для управления поставками
          </p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
            Наша платформа предоставляет все необходимые инструменты для эффективного управления цепочками поставок
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Доверие тысяч компаний
            </h2>
            <p className="mt-3 text-xl text-primary-200 sm:mt-4">
              Наша платформа помогает компаниям по всему миру оптимизировать их цепочки поставок
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-2 sm:gap-8 lg:max-w-7xl lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                  {stat.name}
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Steps */}
      <div className="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-base font-semibold uppercase tracking-wider text-primary-600">
            Начните работу
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Как это работает
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.name} className="pt-6">
                  <div className="flow-root rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <span className="text-lg font-bold text-white">{index + 1}</span>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{step.name}</h3>
                      <p className="mt-5 text-base text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Готовы начать?</span>
            <span className="block text-primary-200">Создайте аккаунт прямо сейчас</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Присоединяйтесь к тысячам компаний, которые уже используют нашу платформу
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 sm:w-auto"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 