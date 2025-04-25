import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  BuildingOfficeIcon, 
  TruckIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

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

  // Анимации
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const tableRowVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: {
      backgroundColor: "rgba(59, 130, 246, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="px-4 sm:px-0"
        variants={cardVariants}
      >
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
          Транзакции
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Управление транзакциями в блокчейне и отслеживание платежей
        </p>
      </motion.div>

      <motion.div 
        className="mt-6 bg-white shadow-lg rounded-xl overflow-hidden"
        variants={cardVariants}
      >
        <div className="px-6 py-5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <motion.div whileHover="hover" variants={cardVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите тип
            </label>
              <div className="relative">
            <select
                  className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-all duration-200"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
          </div>
            </motion.div>

            <motion.div whileHover="hover" variants={cardVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedType === 'company' ? 'Выберите компанию' : 'Выберите поставщика'}
            </label>
              <div className="relative">
            <select
                  className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-all duration-200"
              value={selectedEntityId}
              onChange={(e) => {
                setSelectedEntityId(e.target.value);
                setSelectedShipmentId('');
                setSelectedShipment(null);
              }}
                  disabled={loading.entities}
            >
              <option value="">Выберите...</option>
              {(selectedType === 'company' ? companies : suppliers).map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  {loading.entities ? (
                    <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
          </div>
            </motion.div>

            <motion.div whileHover="hover" variants={cardVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите поставку
            </label>
              <div className="relative">
            <select
                  className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-all duration-200"
              value={selectedShipmentId}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
                  disabled={loading.shipments || !selectedEntityId}
            >
              <option value="">Выберите поставку</option>
              {shipments.map(shipment => (
                <option key={shipment.id} value={shipment.id}>
                  {shipment.shipment_name}
                </option>
              ))}
            </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  {loading.shipments ? (
                    <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    <TruckIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
      {selectedShipment && (
          <motion.div 
            className="mt-6 bg-white shadow-lg rounded-xl overflow-hidden"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-primary-600" />
              Детали поставки
            </h3>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <motion.div 
                  className="bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                  whileHover="hover"
                >
                <p className="text-sm font-medium text-gray-500">ID поставки</p>
                <p className="mt-1 text-sm text-gray-900">{selectedShipment.database.id}</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                  whileHover="hover"
                >
                <p className="text-sm font-medium text-gray-500">UUID</p>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedShipment.database.uuid}</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                  whileHover="hover"
                >
                <p className="text-sm font-medium text-gray-500">Сумма (USDT)</p>
                <p className="mt-1 text-sm text-gray-900">{selectedShipment.database.fiat_amount} {selectedShipment.database.fiat_currency}</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                  whileHover="hover"
                >
                <p className="text-sm font-medium text-gray-500">Сумма (TRX)</p>
                <p className="mt-1 text-sm text-gray-900">{selectedShipment.database.crypto_amount} TRX</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                  whileHover="hover"
                >
                <p className="text-sm font-medium text-gray-500">Статус инициализации</p>
                  <div className="mt-1 flex items-center">
                    {selectedShipment.database.init ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                    ) : (
                      <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                    )}
                    <span className="text-sm text-gray-900">
                      {selectedShipment.database.init ? 'Инициализирована' : 'Не инициализирована'}
                    </span>
              </div>
                </motion.div>

                <motion.div 
                  className="bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                  whileHover="hover"
                >
                <p className="text-sm font-medium text-gray-500">Дата создания</p>
                  <div className="mt-1 flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900">{formatDate(selectedShipment.database.created_at)}</span>
              </div>
                </motion.div>
            </div>

            {!selectedShipment.database.init && (
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                  onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                  Создать транзакцию
                  </motion.button>
                </motion.div>
            )}

            {selectedShipment.transactions.length > 0 && (
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-lg font-medium text-gray-900 mb-4">История транзакций</h4>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                        <AnimatePresence>
                      {selectedShipment.transactions.map((tx) => (
                            <motion.tr 
                              key={tx.id}
                              variants={tableRowVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              whileHover="hover"
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{tx.blockchain_tx_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.token_name}</td>
                            </motion.tr>
                      ))}
                        </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                </motion.div>
            )}
          </div>
          </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {showCreateModal && selectedShipment && (
          <motion.div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative p-6 bg-white w-full max-w-md m-auto rounded-xl shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                Создание новой транзакции
              </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {error.transaction && (
                <motion.div 
                  className="mb-4 text-red-600 text-sm p-4 bg-red-50 rounded-lg flex items-start"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error.transaction}</span>
                </motion.div>
              )}

              <form onSubmit={handleCreateTransaction}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID транзакции в блокчейне
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
                    value={transactionData.blockchainTxId}
                    onChange={(e) => setTransactionData({
                      ...transactionData,
                      blockchainTxId: e.target.value
                    })}
                    required
                  />
                </div>

                <motion.div 
                  className="mb-6 p-4 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-sm font-medium text-blue-900 mb-3">Информация о платеже</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-md">
                      <p className="text-sm text-blue-800 mb-2">Адрес кошелька для оплаты:</p>
                      <p className="text-xs font-mono break-all bg-blue-50 p-2 rounded">
                    {paymentInfo?.payWallet || 'Адрес кошелька не найден'}
                  </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-md">
                        <p className="text-sm text-blue-800">Сумма TRX</p>
                        <p className="text-sm font-medium">
                          {paymentInfo?.sendTrxSumm || selectedShipment.database.crypto_amount}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <p className="text-sm text-blue-800">Сумма USDT</p>
                        <p className="text-sm font-medium">
                          {paymentInfo?.sendUsdtSumm || selectedShipment.database.fiat_amount}
                        </p>
                      </div>
                  </div>
                  {paymentInfo && (
                      <p className="text-xs text-blue-700 mt-2">
                      {paymentInfo.message}
                    </p>
                  )}
                </div>
                </motion.div>

                <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                    onClick={() => setShowCreateModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                    disabled={loading.transaction}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading.transaction ? (
                      <span className="flex items-center">
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Создание...
                      </span>
                    ) : (
                      'Создать'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Transactions; 