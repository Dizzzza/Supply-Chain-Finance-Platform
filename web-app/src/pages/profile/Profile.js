import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaUserTag, FaBuilding, FaInfoCircle, FaWallet, FaPlus } from 'react-icons/fa';

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
  const token = process.env.REACT_APP_API_TOKEN;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Проверяем наличие данных пользователя
        if (!user || !user.user_id) {
          setLoading(false);
          return;
        }

        if (!token) {
          setError('Требуется авторизация');
          setLoading(false);
          return;
        }

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
          role: userResponse.data.role_type === 'company' ? 'Компания' : 'Поставщик',
          entityName: entityResponse.data.data.name || 'Не указано',
          entityDescription: entityResponse.data.data.description || 'Не указано',
          entityWallet: entityResponse.data.data.wallet_address || 'Не указан'
        });
      } catch (err) {
        console.error('Ошибка при загрузке данных профиля или сущности:', err);
        if (err.response) {
          setError(`Ошибка: ${err.response.data.message || 'Не удалось загрузить данные профиля'}`);
        } else {
          setError('Не удалось загрузить данные профиля. Попробуйте позже.');
        }
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchUserData();
  }, [user]);

  const handleAddWallet = async () => {
    try {
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка профиля...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6 text-red-500 bg-red-50 rounded-lg shadow-sm"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
    >
      <div className="px-4 py-6 sm:px-0">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-lg rounded-xl overflow-hidden"
        >
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-700">
            <h3 className="text-2xl font-bold text-white">Профиль пользователя</h3>
            <p className="mt-2 text-blue-100">Личная информация</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-100 transition-colors duration-200"
              >
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Имя пользователя
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.username}</dd>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaEnvelope className="mr-2 text-blue-600" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.email}</dd>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-100 transition-colors duration-200"
              >
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUserTag className="mr-2 text-blue-600" />
                  Роль
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.role}</dd>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaBuilding className="mr-2 text-blue-600" />
                  Название организации
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.entityName}</dd>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-100 transition-colors duration-200"
              >
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaInfoCircle className="mr-2 text-blue-600" />
                  Описание организации
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.entityDescription}</dd>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaWallet className="mr-2 text-blue-600" />
                  Кошелек организации
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  {userData.entityWallet}
                  {userData.entityWallet === 'Не указан' && !showWalletInput && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowWalletInput(true)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Добавить кошелек
                    </motion.button>
                  )}
                </dd>
              </motion.div>
              {showWalletInput && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4"
                >
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FaWallet className="mr-2 text-blue-600" />
                    Введите кошелек
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Введите адрес кошелька"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddWallet}
                      className="mt-3 px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Сохранить
                    </motion.button>
                  </dd>
                </motion.div>
              )}
            </dl>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;