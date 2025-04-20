import React, { useState } from 'react';
import Modal from '../../components/common/Modal';

const Wallet = () => {
  const [isConnected] = useState(true);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [walletInfo] = useState({
    address: '0x1234...5678',
    balance: '10.5 ETH',
    tokens: [
      { symbol: 'ETH', balance: '10.5', value: '$21,000' },
      { symbol: 'USDT', balance: '1000', value: '$1,000' },
      { symbol: 'USDC', balance: '500', value: '$500' },
    ],
    recentTransactions: [
      {
        id: '0xabcd...efgh',
        type: 'Отправлено',
        amount: '0.5 ETH',
        to: '0xijkl...mnop',
        timestamp: '2024-03-20 14:30',
      },
      {
        id: '0xqrst...uvwx',
        type: 'Получено',
        amount: '1000 USDT',
        from: '0xyzab...cdef',
        timestamp: '2024-03-20 13:15',
      },
    ],
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900">Криптокошелек</h2>
        <p className="mt-2 text-sm text-gray-600">
          Управление криптовалютными активами
        </p>
      </div>

      {isConnected ? (
        <>
          {/* Основная информация */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Адрес кошелька</h3>
                  <p className="mt-1 text-sm text-gray-500">{walletInfo.address}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsSendModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Отправить
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Получить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Балансы токенов */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Балансы</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {walletInfo.tokens.map((token) => (
                <div
                  key={token.symbol}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {token.symbol}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {token.balance}
                    </dd>
                    <dd className="mt-1 text-sm text-gray-500">
                      ≈ {token.value}
                    </dd>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Последние транзакции */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Последние транзакции</h3>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {walletInfo.recentTransactions.map((transaction) => (
                  <li key={transaction.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className={`text-sm font-medium ${
                            transaction.type === 'Получено' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type}
                          </p>
                          <p className="ml-2 text-sm text-gray-500">
                            {transaction.amount}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            {transaction.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {transaction.type === 'Получено' ? 'От: ' + transaction.from : 'Кому: ' + transaction.to}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Модальное окно отправки */}
          <Modal
            isOpen={isSendModalOpen}
            onClose={() => setIsSendModalOpen(false)}
            title="Отправить токены"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  Токен
                </label>
                <select
                  id="token"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  {walletInfo.tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol} (Баланс: {token.balance})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Адрес получателя
                </label>
                <input
                  type="text"
                  id="address"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Сумма
                </label>
                <input
                  type="number"
                  id="amount"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Отправить
                </button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Подключите кошелек</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Для доступа к функциям кошелька необходимо подключить MetaMask или другой Web3 кошелек.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Подключить кошелек
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet; 