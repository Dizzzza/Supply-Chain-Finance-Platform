import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  TruckIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  CubeTransparentIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWalletsModal, setShowWalletsModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [walletAddresses, setWalletAddresses] = useState({});
  const [editingWallet, setEditingWallet] = useState(null);
  const [tempWalletAddress, setTempWalletAddress] = useState('');
  const [selectedType, setSelectedType] = useState('company');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [formData, setFormData] = useState({
    companyId: '',
    supplierId: '',
    fiatAmount: '',
    status: 'Started',
    handler: 'Manufacturer',
    name: '',
    description: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    created: 0,
    confirmed: 0
  });
  const [loading, setLoading] = useState({
    entities: false,
    shipments: false,
    wallet: false,
    details: false
  });
  const [error, setError] = useState({
    entities: null,
    shipments: null,
    wallet: null,
    details: null
  });
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZnJvbnRlbmQiLCJpYXQiOjE3NDUxMzcxMDZ9.GUyvQfstgNuUuD_9WqMMlH6UhbYSUYVbNmlzLm6fJK4');
    fetchCompaniesAndSuppliers();
  }, []);

  useEffect(() => {
    if (selectedEntityId) {
      fetchShipments();
    }
  }, [selectedType, selectedEntityId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Если токен не найден, перенаправляем на страницу логина
      window.location.href = '/login';
      return {};
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
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
      
      const stats = {
        total: response.data.length,
        created: response.data.filter(s => !s.init).length,
        confirmed: response.data.filter(s => s.init).length
      };
      setStats(stats);
    } catch (error) {
      console.error('Ошибка при получении поставок:', error);
      if (error.response?.status === 401) {
        setError(prev => ({ ...prev, shipments: 'Необходима авторизация' }));
        // Можно добавить редирект на страницу логина
        window.location.href = '/login';
      } else {
        setError(prev => ({ ...prev, shipments: 'Ошибка при загрузке поставок' }));
      }
    } finally {
      setLoading(prev => ({ ...prev, shipments: false }));
    }
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
        // Можно добавить редирект на страницу логина
        window.location.href = '/login';
      } else {
        setError(prev => ({ ...prev, entities: 'Ошибка при загрузке компаний и поставщиков' }));
      }
    } finally {
      setLoading(prev => ({ ...prev, entities: false }));
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3003/ship/createShipment',
        {
          ...formData,
          companyId: parseInt(formData.companyId),
          supplierId: parseInt(formData.supplierId),
          fiatAmount: parseFloat(formData.fiatAmount)
        },
        getAuthHeaders()
      );
      
      if (response.data.success) {
        setShowCreateModal(false);
        fetchShipments();
        setFormData({
          companyId: '',
          supplierId: '',
          fiatAmount: '',
          status: 'Started',
          handler: 'Manufacturer',
          name: '',
          description: ''
        });
      }
    } catch (error) {
      console.error('Ошибка при создании поставки:', error);
      if (error.response?.status === 401) {
        alert('Необходима авторизация');
        window.location.href = '/login';
      } else {
        alert('Ошибка при создании поставки. Пожалуйста, проверьте введенные данные.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Created':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Created':
        return 'Создано';
      case 'Confirmed':
        return 'Подтверждено';
      default:
        return status;
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

  const handleWalletAddressChange = (supplierId, address) => {
    setWalletAddresses(prev => ({
      ...prev,
      [supplierId]: address
    }));
  };

  const handleEditClick = (supplierId) => {
    setEditingWallet(supplierId);
    setTempWalletAddress(walletAddresses[supplierId] || '');
  };

  const handleWalletSubmit = async (supplierId) => {
    setLoading(prev => ({ ...prev, wallet: true }));
    setError(prev => ({ ...prev, wallet: null }));
    
    try {
      const response = await axios.post(
        'http://localhost:3003/ship/addSupplierWallet',
        {
          supplierID: supplierId,
          walletAddress: tempWalletAddress
        },
        getAuthHeaders()
      );

      if (response.data.success) {
        setWalletAddresses(prev => ({
          ...prev,
          [supplierId]: tempWalletAddress
        }));
        setEditingWallet(null);
      }
    } catch (error) {
      console.error('Ошибка при сохранении адреса кошелька:', error);
      setError(prev => ({ 
        ...prev, 
        wallet: 'Ошибка при сохранении адреса кошелька' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, wallet: false }));
    }
  };

  const fetchShipmentDetails = async (shipmentId) => {
    setLoading(prev => ({ ...prev, details: true }));
    setError(prev => ({ ...prev, details: null }));
    try {
      const response = await axios.get(
        `http://localhost:3003/ship/getShipment/${shipmentId}`,
        getAuthHeaders()
      );
      setSelectedShipment(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Ошибка при получении деталей поставки:', error);
      setError(prev => ({ 
        ...prev, 
        details: 'Ошибка при загрузке деталей поставки' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, details: false }));
    }
  };

  // Определение анимаций
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
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
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
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="mb-8"
        variants={cardVariants}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <TruckIcon className="h-8 w-8 text-primary-600" />
          Управление поставками
        </h1>
        <p className="text-gray-600">
          Создавайте и отслеживайте поставки, управляйте транзакциями
        </p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        variants={cardVariants}
        whileHover="hover"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div whileHover="hover" variants={cardVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите тип
            </label>
            <div className="relative">
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors pl-3 pr-10 py-2"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedEntityId('');
                }}
              >
                <option value="company">Компания</option>
                <option value="supplier">Поставщик</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {selectedType === 'company' ? (
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </motion.div>

          <motion.div whileHover="hover" variants={cardVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedType === 'company' ? 'Выберите компанию' : 'Выберите поставщика'}
            </label>
            <div className="relative">
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors pl-3 pr-10 py-2"
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
              >
                <option value="">
                  {selectedType === 'company' ? '-- Выберите компанию --' : '-- Выберите поставщика --'}
                </option>
                {(selectedType === 'company' ? companies : suppliers).map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {loading.entities ? (
                  <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
                ) : (
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-end gap-4">
          <motion.button 
            onClick={() => setShowWalletsModal(true)}
            className="px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CurrencyDollarIcon className="h-5 w-5" />
            Кошельки поставщиков
          </motion.button>
          <motion.button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CubeTransparentIcon className="h-5 w-5" />
            Создать поставку
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего поставок</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Создано</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.created}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Подтверждено</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        variants={cardVariants}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Компания</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Поставщик</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Обработчик</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время создания</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {shipments.map((shipment) => (
                  <motion.tr 
                    key={shipment.id}
                    variants={tableRowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shipment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.shipment_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.company_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.supplier_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                        {getStatusText(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.handler}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(shipment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <motion.button 
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center gap-2"
                        onClick={() => fetchShipmentDetails(shipment.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                        Подробнее
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 m-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CubeTransparentIcon className="h-6 w-6 text-primary-600" />
                  Создание поставки
                </h3>
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>

              {error.entities && (
                <motion.div 
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error.entities}</p>
                </motion.div>
              )}

              <form onSubmit={handleCreateShipment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      Компания
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-all duration-200"
                        value={formData.companyId}
                        onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                        required
                        disabled={loading.entities}
                      >
                        <option value="">Выберите компанию</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      Поставщик
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-all duration-200"
                        value={formData.supplierId}
                        onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                        required
                        disabled={loading.entities}
                      >
                        <option value="">Выберите поставщика</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Сумма (USD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-all duration-200"
                      value={formData.fiatAmount}
                      onChange={(e) => setFormData({...formData, fiatAmount: e.target.value})}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Название
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-all duration-200"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-all duration-200 min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </motion.div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    type="button"
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                    onClick={() => setShowCreateModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Создать
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWalletsModal && (
          <motion.div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 m-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                  Кошельки поставщиков
                </h3>
                <motion.button
                  onClick={() => setShowWalletsModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>

              {error.wallet && (
                <motion.div 
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error.wallet}</p>
                </motion.div>
              )}

              <div className="space-y-4">
                {suppliers.map((supplier, index) => (
                  <motion.div 
                    key={supplier.id} 
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-200 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <BuildingStorefrontIcon className="h-5 w-5 text-gray-500" />
                        <h4 className="text-lg font-medium text-gray-900">
                          {supplier.name}
                        </h4>
                      </div>
                      {editingWallet !== supplier.id && (
                        <motion.button
                          onClick={() => handleEditClick(supplier.id)}
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </motion.button>
                      )}
                    </div>

                    {editingWallet === supplier.id ? (
                      <motion.div 
                        className="flex gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <input
                          type="text"
                          className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="Введите адрес кошелька"
                          value={tempWalletAddress}
                          onChange={(e) => setTempWalletAddress(e.target.value)}
                        />
                        <motion.button
                          onClick={() => handleWalletSubmit(supplier.id)}
                          disabled={loading.wallet}
                          className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 transition-colors flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {loading.wallet ? (
                            <>
                              <ArrowPathIcon className="h-4 w-4 animate-spin" />
                              Сохранение...
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="h-4 w-4" />
                              Сохранить
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingWallet(null)}
                          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <XMarkIcon className="h-4 w-4" />
                          Отмена
                        </motion.button>
                      </motion.div>
                    ) : (
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Адрес кошелька:</p>
                        <p className="text-sm font-mono break-all text-gray-900">
                          {walletAddresses[supplier.id] || 'Адрес не указан'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailsModal && selectedShipment && (
          <motion.div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDetailsModal(false);
              }
            }}
          >
            <motion.div 
              className="relative mx-auto w-full max-w-5xl bg-white rounded-2xl shadow-xl m-4"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              {/* Заголовок */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Поставка #{selectedShipment.database.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Создана {formatDate(selectedShipment.database.created_at)}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </motion.button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Левая колонка */}
                  <div className="col-span-2 space-y-6">
                    {/* Основная информация */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
                          <CubeTransparentIcon className="h-5 w-5 text-blue-600" />
                          Основная информация
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Название</p>
                          <p className="text-base font-medium text-gray-900">
                            {selectedShipment.database.shipment_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">UUID</p>
                          <p className="text-sm font-mono text-gray-900 break-all bg-gray-50 p-2 rounded">
                            {selectedShipment.database.uuid}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Описание</p>
                          <p className="text-base text-gray-900">
                            {selectedShipment.database.shipment_description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Участники */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
                          <UsersIcon className="h-5 w-5 text-blue-600" />
                          Участники
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Компания</p>
                            <p className="text-base font-medium text-gray-900">
                              {selectedShipment.database.company_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Поставщик</p>
                            <p className="text-base font-medium text-gray-900">
                              {selectedShipment.database.supplier_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Правая колонка */}
                  <div className="space-y-6">
                    {/* Статус */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
                          <ChartBarIcon className="h-5 w-5 text-blue-600" />
                          Статус
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Текущий статус</p>
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedShipment.database.status)}`}>
                            {getStatusText(selectedShipment.database.status)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Обработчик</p>
                          <p className="text-base font-medium text-gray-900">
                            {selectedShipment.database.handler}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Инициализация</p>
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${selectedShipment.database.init ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {selectedShipment.database.init ? 'Выполнена' : 'Не выполнена'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Финансы */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
                          <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                          Финансы
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-2">FIAT</p>
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">
                              {selectedShipment.database.fiat_amount}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              {selectedShipment.database.fiat_currency}
                            </span>
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-2">Крипто</p>
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">
                              {selectedShipment.database.crypto_amount}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">TRX</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* История транзакций */}
                {selectedShipment.transactions.length > 0 && (
                  <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-blue-600" />
                        История транзакций
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TX Hash</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сумма</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Токен</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedShipment.transactions.map((tx) => (
                            <motion.tr 
                              key={tx.id}
                              className="hover:bg-gray-50 transition-colors"
                              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {tx.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-mono text-gray-500 break-all">
                                  {tx.blockchain_tx_id}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-900">
                                  {tx.amount}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                  {tx.token_name}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Shipments; 