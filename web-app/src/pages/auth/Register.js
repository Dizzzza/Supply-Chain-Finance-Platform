import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const [userType, setUserType] = useState('company');
  const [formData, setFormData] = useState({
    email: '',
    entityName: '',
    description: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Валидация
    if (!formData.email || !formData.entityName || !formData.username || !formData.password) {
      setError('Все поля обязательны для заполнения');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        password: formData.password,
        role: userType,
        entityName: formData.entityName,
        description: formData.description,
        email: formData.email
      });

      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Ошибка при регистрации');
      }
    } catch (err) {
      setError('Произошла ошибка при регистрации');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500/10 via-white to-primary-500/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Создать аккаунт
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Зарегистрируйтесь для доступа к платформе
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-sm transition-all duration-300 animate-fade-in-up" role="alert">
            <span className="block text-sm">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Тип пользователя */}
            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">
                Тип пользователя
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {userType === 'company' ? (
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <select
                  id="user-type"
                  name="user-type"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 sm:text-sm bg-white cursor-pointer hover:border-primary-400"
                >
                  <option value="company" className="py-2">Компания</option>
                  <option value="supplier" className="py-2">Поставщик</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDownIcon className="h-4 w-4 text-gray-400 transform transition-transform duration-200 group-hover:text-primary-500" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email адрес
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 sm:text-sm"
                  placeholder="Введите email адрес"
                />
              </div>
            </div>

            {/* Название организации */}
            <div>
              <label htmlFor="entityName" className="block text-sm font-medium text-gray-700">
                Название {userType === 'company' ? 'компании' : 'поставщика'}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="entityName"
                  name="entityName"
                  type="text"
                  value={formData.entityName}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 sm:text-sm"
                  placeholder={`Введите название ${userType === 'company' ? 'компании' : 'поставщика'}`}
                />
              </div>
            </div>

            {/* Описание */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Описание {userType === 'company' ? 'компании' : 'поставщика'}
              </label>
              <div className="mt-1 relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 sm:text-sm"
                  placeholder={`Введите описание ${userType === 'company' ? 'компании' : 'поставщика'}`}
                  rows="3"
                />
              </div>
            </div>

            {/* Имя пользователя */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 sm:text-sm"
                  placeholder="Введите имя пользователя"
                />
              </div>
            </div>

            {/* Пароль */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 sm:text-sm"
                  placeholder="Минимум 6 символов"
                />
              </div>
            </div>

            {/* Подтверждение пароля */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Подтвердите пароль
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 sm:text-sm"
                  placeholder="Повторите пароль"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Регистрация...
                </span>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link 
                to="/login" 
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Уже есть аккаунт? Войти
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 