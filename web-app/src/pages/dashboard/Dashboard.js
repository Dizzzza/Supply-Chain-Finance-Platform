import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TruckIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Заголовок */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Панель управления</h1>
            <p className="mt-2 text-sm text-gray-600">
              Добро пожаловать в панель управления SupplyChain Finance
            </p>
          </div>

          {/* Быстрые действия */}
          <motion.div 
            className="bg-white shadow rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Быстрые действия</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  to="/supplier/shipments"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <div className="flex-shrink-0">
                    <TruckIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">Поставки</p>
                    <p className="text-sm text-gray-500">Управление поставками</p>
                  </div>
                </Link>

                <Link
                  to="/blockchain/transactions"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">Транзакции</p>
                    <p className="text-sm text-gray-500">Управление транзакциями</p>
                  </div>
                </Link>

                <Link
                  to="/supplier/shipments"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">Статистика</p>
                    <p className="text-sm text-gray-500">Просмотр статистики</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 