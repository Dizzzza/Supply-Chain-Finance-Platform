import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';

const Transactions = () => {
  const [selectedType, setSelectedType] = useState('company');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [selectedShipmentId, setSelectedShipmentId] = useState('');
  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [transactionData, setTransactionData] = useState({
    blockchainTxId: '',
  });
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState({
    entities: false,
    shipments: false,
    shipment: false,
    transaction: false
  });
  const [error, setError] = useState({
    entities: null,
    shipments: null,
    shipment: null,
    transaction: null
  });

  useEffect(() => {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZnJvbnRlbmQiLCJpYXQiOjE3NDUxMzcxMDZ9.GUyvQfstgNuUuD_9WqMMlH6UhbYSUYVbNmlzLm6fJK4');
    fetchCompaniesAndSuppliers();
  }, []);

  useEffect(() => {
    if (selectedEntityId) {
      fetchShipments();
    }
  }, [selectedType, selectedEntityId]);

  useEffect(() => {
    if (selectedShipmentId) {
      fetchShipmentDetails();
    }
  }, [selectedShipmentId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return {};
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchCompaniesAndSuppliers = async () => {
    setLoading(prev => ({ ...prev, entities: true }));
    setError(prev => ({ ...prev, entities: null }));
    try {
      const response = await axios.get(
        'http://localhost:3003/ship/getEntities',
        getAuthHeaders()
      );
      if (response.data.success) {
        setCompanies(response.data.data.companies);
        setSuppliers(response.data.data.suppliers);
      } else {
        throw new Error('Не удалось получить данные');
      }
    } catch (error) {
      console.error('Ошибка при получении компаний и поставщиков:', error);
      if (error.response?.status === 401) {
        setError(prev => ({ ...prev, entities: 'Необходима авторизация' }));
        window.location.href = '/login';
      } else {
        setError(prev => ({ ...prev, entities: 'Ошибка при загрузке компаний и поставщиков' }));
      }
    } finally {
      setLoading(prev => ({ ...prev, entities: false }));
    }
  };

  const fetchShipments = async () => {
    setLoading(prev => ({ ...prev, shipments: true }));
    setError(prev => ({ ...prev, shipments: null }));
    try {
      const response = await axios.get(
        `http://localhost:3003/ship/getShipments?type=${selectedType}&id=${selectedEntityId}`,
        getAuthHeaders()
      );
      setShipments(response.data);
    } catch (error) {
      console.error('Ошибка при получении поставок:', error);
      if (error.response?.status === 401) {
        setError(prev => ({ ...prev, shipments: 'Необходима авторизация' }));
        window.location.href = '/login';
      } else {
        setError(prev => ({ ...prev, shipments: 'Ошибка при загрузке поставок' }));
      }
    } finally {
      setLoading(prev => ({ ...prev, shipments: false }));
    }
  };

  const fetchShipmentDetails = async () => {
    setLoading(prev => ({ ...prev, shipment: true }));
    setError(prev => ({ ...prev, shipment: null }));
    try {
      const response = await axios.get(
        `http://localhost:3003/ship/getShipment/${selectedShipmentId}`,
        getAuthHeaders()
      );
      if (response.data) {
        setSelectedShipment(response.data);
        // Получаем информацию о платеже
        const paymentResponse = await axios.post(
          'http://localhost:3003/ship/createShipment',
          {
            companyId: response.data.database.company_id,
            supplierId: response.data.database.supplier_id,
            fiatAmount: response.data.database.fiat_amount,
            status: "Started",
            handler: response.data.database.handler,
            name: response.data.database.shipment_name,
            description: response.data.database.shipment_description
          },
          getAuthHeaders()
        );
        if (paymentResponse.data.success) {
          setPaymentInfo(paymentResponse.data.data);
        }
      } else {
        throw new Error('Данные не получены');
      }
    } catch (error) {
      console.error('Ошибка при получении деталей поставки:', error);
      setError(prev => ({ ...prev, shipment: 'Ошибка при загрузке деталей поставки. Пожалуйста, попробуйте еще раз.' }));
      setSelectedShipment(null);
      setPaymentInfo(null);
    } finally {
      setLoading(prev => ({ ...prev, shipment: false }));
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, transaction: true }));
    setError(prev => ({ ...prev, transaction: null }));

    const transactionPayload = {
      shipmentId: selectedShipmentId,
      blockchainTxId: transactionData.blockchainTxId,
      trxAmount: parseFloat(paymentInfo?.sendTrxSumm || selectedShipment.database.crypto_amount),
      usdtAmount: parseFloat(paymentInfo?.sendUsdtSumm || selectedShipment.database.fiat_amount)
    };

    console.log('🚀 Создание новой транзакции:');
    console.log('📦 ID поставки:', transactionPayload.shipmentId);
    console.log('🔗 TX Hash:', transactionPayload.blockchainTxId);
    console.log('💰 Сумма TRX:', transactionPayload.trxAmount);
    console.log('💵 Сумма USDT:', transactionPayload.usdtAmount);
    console.log('🏦 Адрес кошелька для оплаты:', paymentInfo?.payWallet);

    try {
      const response = await axios.post(
        'http://localhost:3003/ship/createTransaction',
        transactionPayload,
        getAuthHeaders()
      );

      if (response.data.success) {
        console.log('✅ Транзакция успешно создана:', response.data);
        setShowCreateModal(false);
        fetchShipmentDetails();
        setTransactionData({ blockchainTxId: '' });
      }
    } catch (error) {
      console.error('❌ Ошибка при создании транзакции:', error);
      console.error('📝 Детали ошибки:', error.response?.data || error.message);
      setError(prev => ({ 
        ...prev, 
        transaction: error.response?.data?.error || 'Ошибка при создании транзакции. Проверьте введенные данные.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, transaction: false }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900">Транзакции</h2>
        <p className="mt-2 text-sm text-gray-600">
          Управление транзакциями в блокчейне
        </p>
      </div>

      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Выберите тип
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedEntityId('');
                setSelectedShipmentId('');
                setSelectedShipment(null);
              }}
            >
              <option value="company">Компания</option>
              <option value="supplier">Поставщик</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {selectedType === 'company' ? 'Выберите компанию' : 'Выберите поставщика'}
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedEntityId}
              onChange={(e) => {
                setSelectedEntityId(e.target.value);
                setSelectedShipmentId('');
                setSelectedShipment(null);
              }}
            >
              <option value="">Выберите...</option>
              {(selectedType === 'company' ? companies : suppliers).map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Выберите поставку
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedShipmentId}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
            >
              <option value="">Выберите поставку</option>
              {shipments.map(shipment => (
                <option key={shipment.id} value={shipment.id}>
                  {shipment.shipment_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedShipment && (
        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Детали поставки
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">ID поставки</p>
                <p className="mt-1 text-sm text-gray-900">{selectedShipment.database.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">UUID</p>
                <p className="mt-1 text-sm text-gray-900">{selectedShipment.database.uuid}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Сумма (USDT)</p>
                <p className="mt-1 text-sm text-gray-900">{selectedShipment.database.fiat_amount} {selectedShipment.database.fiat_currency}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Сумма (TRX)</p>
                <p className="mt-1 text-sm text-gray-900">{selectedShipment.database.crypto_amount} TRX</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Статус инициализации</p>
                <p className="mt-1 text-sm text-gray-900">{selectedShipment.database.init ? 'Инициализирована' : 'Не инициализирована'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Дата создания</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedShipment.database.created_at)}</p>
              </div>
            </div>

            {!selectedShipment.database.init && (
              <div className="mt-5">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Создать транзакцию
                </button>
              </div>
            )}

            {selectedShipment.transactions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900">История транзакций</h4>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TX Hash</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Токен</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedShipment.transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.blockchain_tx_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.token_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showCreateModal && selectedShipment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Создание новой транзакции
              </h3>
              {error.transaction && (
                <div className="mb-4 text-red-600 text-sm p-3 bg-red-50 rounded-md">
                  {error.transaction}
                </div>
              )}
              <form onSubmit={handleCreateTransaction}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ID транзакции в блокчейне
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={transactionData.blockchainTxId}
                    onChange={(e) => setTransactionData({
                      ...transactionData,
                      blockchainTxId: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Информация о платеже</h4>
                  <p className="text-sm text-blue-800">
                    Отправьте указанную сумму на следующий кошелек:
                  </p>
                  <p className="text-xs text-blue-600 mt-1 break-all font-mono bg-white p-2 rounded">
                    {paymentInfo?.payWallet || 'Адрес кошелька не найден'}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-blue-800">
                      Сумма TRX: <span className="font-medium">{paymentInfo?.sendTrxSumm || selectedShipment.database.crypto_amount}</span>
                    </p>
                    <p className="text-sm text-blue-800">
                      Сумма USDT: <span className="font-medium">{paymentInfo?.sendUsdtSumm || selectedShipment.database.fiat_amount}</span>
                    </p>
                  </div>
                  {paymentInfo && (
                    <p className="mt-2 text-xs text-blue-700">
                      {paymentInfo.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    disabled={loading.transaction}
                  >
                    {loading.transaction ? 'Создание...' : 'Создать'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions; 