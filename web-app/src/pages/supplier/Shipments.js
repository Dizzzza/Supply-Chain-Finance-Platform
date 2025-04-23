import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState({
    entities: false,
    shipments: false,
    wallet: false
  });
  const [error, setError] = useState({
    entities: null,
    shipments: null,
    wallet: null
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
        inProgress: response.data.filter(s => s.status === 'InProgress').length,
        completed: response.data.filter(s => s.status === 'Completed').length,
        cancelled: response.data.filter(s => s.status === 'Cancelled').length
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
      case 'Started':
        return 'bg-yellow-100 text-yellow-800';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="container mx-auto px-4 py-8">
      {error.shipments && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error.shipments}
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Управление поставками</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите тип
              </label>
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedEntityId('');
                }}
              >
                <option value="company">Компания</option>
                <option value="supplier">Поставщик</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedType === 'company' ? 'Выберите компанию' : 'Выберите поставщика'}
              </label>
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
              >
                <option value="">
                  {selectedType === 'company' 
                    ? '-- Выберите компанию --' 
                    : '-- Выберите поставщика --'}
                </option>
                {selectedType === 'company'
                  ? companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))
                  : suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))
                }
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              onClick={() => setShowWalletsModal(true)}
              className="px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Кошельки поставщиков
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Создать поставку
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего поставок</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">В пути</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Доставлено</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Отменено</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
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
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.handler}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(shipment.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Создание новой поставки</h3>
              {error.entities && (
                <div className="mb-4 text-red-600 text-sm">
                  {error.entities}
                </div>
              )}
              <form onSubmit={handleCreateShipment}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Компания
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Поставщик
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Сумма (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.fiatAmount}
                    onChange={(e) => setFormData({...formData, fiatAmount: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Описание
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
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
                  >
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showWalletsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Кошельки поставщиков
                </h3>
                <button
                  onClick={() => setShowWalletsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              {error.wallet && (
                <div className="mb-4 text-red-600 text-sm">
                  {error.wallet}
                </div>
              )}

              {suppliers.map(supplier => (
                <div key={supplier.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 font-bold">
                      {supplier.name}
                    </label>
                    {editingWallet !== supplier.id && (
                      <button
                        onClick={() => handleEditClick(supplier.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {editingWallet === supplier.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Адрес кошелька"
                        value={tempWalletAddress}
                        onChange={(e) => setTempWalletAddress(e.target.value)}
                      />
                      <button
                        onClick={() => handleWalletSubmit(supplier.id)}
                        disabled={loading.wallet}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
                      >
                        {loading.wallet ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        onClick={() => setEditingWallet(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-600 break-all">
                      {walletAddresses[supplier.id] || 'Адрес не указан'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipments; 