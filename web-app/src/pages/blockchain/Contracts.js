import React, { useState } from 'react';
import Modal from '../../components/common/Modal';

const Contracts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [contracts] = useState([
    {
      id: '0x1234...5678',
      name: 'Контракт поставки',
      type: 'Supply Chain',
      status: 'Активный',
      createdAt: '2024-03-20',
      balance: '2.5 ETH',
      address: '0xabcd...efgh',
    },
    {
      id: '0x8765...4321',
      name: 'Финансовый контракт',
      type: 'Finance',
      status: 'На подписании',
      createdAt: '2024-03-19',
      balance: '1.0 ETH',
      address: '0xijkl...mnop',
    },
  ]);

  const handleContractClick = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900">Смарт-контракты</h2>
        <p className="mt-2 text-sm text-gray-600">
          Управление и мониторинг смарт-контрактов
        </p>
      </div>

      {/* Действия */}
      <div className="mt-4 sm:mt-6">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Создать контракт
        </button>
      </div>

      {/* Список контрактов */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {contracts.map((contract) => (
            <li key={contract.id}>
              <button
                onClick={() => handleContractClick(contract)}
                className="block hover:bg-gray-50 w-full text-left"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-primary-600 truncate">{contract.name}</p>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contract.status === 'Активный' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-sm text-gray-500">{contract.balance}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Тип: {contract.type}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        ID: {contract.id}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Создан: {contract.createdAt}</p>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Модальное окно с деталями контракта */}
      {selectedContract && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Детали контракта"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Название</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedContract.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Адрес</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedContract.address}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Тип</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedContract.type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Статус</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedContract.status}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Баланс</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedContract.balance}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Дата создания</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedContract.createdAt}</p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Взаимодействовать с контрактом
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Contracts; 