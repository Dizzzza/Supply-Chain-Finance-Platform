import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth(); // Получаем данные пользователя из контекста
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: '',
    entityName: '',
    entityDescription: '',
    entityWallet: ''
  });
  const [loading, setLoading] = useState(true); // Состояние для отображения загрузки
  const [error, setError] = useState(null); // Состояние для обработки ошибок
  const [walletInput, setWalletInput] = useState(''); // Состояние для ввода кошелька
  const [showWalletInput, setShowWalletInput] = useState(false); // Состояние для отображения поля ввода

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Запрос на получение данных профиля
        const userResponse = await axios.get(`http://localhost:3003/auth/profile/${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Запрос на получение данных сущности
        const entityResponse = await axios.get(
          `http://localhost:3003/ship/getEntityData?type=${user.role_type}&entityId=${user.entity_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Установка данных профиля
        setUserData({
          username: userResponse.data.username,
          email: userResponse.data.email,
          role: userResponse.data.role === 'company' ? 'Компания' : 'Поставщик',
          entityName: entityResponse.data.data.name || 'Не указано',
          entityDescription: entityResponse.data.data.description || 'Не указано',
          entityWallet: entityResponse.data.data.wallet_address || 'Не указан'
        });
      } catch (err) {
        console.error('Ошибка при загрузке данных профиля или сущности:', err);
        setError('Не удалось загрузить данные профиля. Попробуйте позже.');
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchUserData();
  }, [user]);

  const handleAddWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3003/ship/addSupplierWallet',
        {
          supplierID: user.entity_id,
          walletAddress: walletInput
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setUserData((prevData) => ({
          ...prevData,
          entityWallet: walletInput
        }));
        setShowWalletInput(false); // Скрываем поле ввода
        setWalletInput(''); // Очищаем поле ввода
      }
    } catch (err) {
      console.error('Ошибка при добавлении кошелька:', err);
      setError('Не удалось добавить кошелек. Попробуйте позже.');
    }
  };

  if (loading) {
    return <div className="text-center py-6">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Профиль пользователя</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Личная информация</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Имя пользователя</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.username}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.email}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Роль</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.role}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Название организации</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.entityName}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Описание организации</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.entityDescription}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Кошелек организации</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.entityWallet}
                  {userData.entityWallet === 'Не указан' && !showWalletInput && (
                    <button
                      onClick={() => setShowWalletInput(true)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                    >
                      Добавить кошелек
                    </button>
                  )}
                </dd>
              </div>
              {showWalletInput && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Введите кошелек</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      placeholder="Введите адрес кошелька"
                    />
                    <button
                      onClick={handleAddWallet}
                      className="mt-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                    >
                      Сохранить
                    </button>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;