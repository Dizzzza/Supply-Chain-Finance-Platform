import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShip, FaUsers, FaShieldAlt, FaChartLine, FaHandshake, FaGlobe, FaTelegram } from 'react-icons/fa';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const About = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const features = [
    {
      icon: <FaShip className="w-8 h-8 text-blue-600" />,
      title: 'Управление поставками',
      description: 'Эффективное управление морскими поставками с отслеживанием в реальном времени'
    },
    {
      icon: <FaUsers className="w-8 h-8 text-blue-600" />,
      title: 'Взаимодействие участников',
      description: 'Прямое взаимодействие между поставщиками и компаниями без посредников'
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-blue-600" />,
      title: 'Безопасность',
      description: 'Надежная защита данных и безопасные транзакции с использованием блокчейн-технологий'
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
      title: 'Аналитика',
      description: 'Подробная аналитика и отчетность по всем операциям'
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-blue-600" />,
      title: 'Прозрачность',
      description: 'Полная прозрачность всех операций и сделок'
    },
    {
      icon: <FaGlobe className="w-8 h-8 text-blue-600" />,
      title: 'Глобальный охват',
      description: 'Возможность работы с партнерами по всему миру'
    }
  ];

  const team = [
    {
      name: 'Катя',
      role: 'Тимлид и фронтенд-разработчик',
      telegram: 'https://t.me/Kucenok'
    },
    {
      name: 'Артур',
      role: 'Бэкенд-разработчик и интеграция API',
      telegram: 'https://t.me/ARARIO'
    },
    {
      name: 'Досжан',
      role: 'Дизайнер и фронтенд-разработчик',
      telegram: 'https://t.me/dr_dos_152'
    },
    {
      name: 'Диас',
      role: 'Техлид и разработчик смарт-контрактов',
      telegram: 'https://t.me/tegdlyaAbyla'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Заголовок */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">О нашей платформе</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Инновационная платформа для управления морскими поставками, объединяющая поставщиков и компании
        </p>
      </motion.div>

      {/* Основные преимущества */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * index }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Миссия и видение */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-16"
      >
        <h2 className="text-3xl font-bold mb-6">Наша миссия</h2>
        <p className="text-lg mb-6">
          Мы стремимся революционизировать индустрию морских поставок, создавая прозрачную и эффективную
          экосистему для всех участников рынка.
        </p>
        <h2 className="text-3xl font-bold mb-6">Наше видение</h2>
        <p className="text-lg">
          Стать ведущей платформой для управления морскими поставками, обеспечивающей безопасность,
          прозрачность и эффективность для всех участников рынка.
        </p>
      </motion.div>

      {/* Контактная информация */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center relative"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h2>
        <p className="text-gray-600 mb-8">
          Если у вас есть вопросы или предложения, выберите специалиста для связи
        </p>
        <div className="relative inline-block text-left">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <span>Выбрать специалиста</span>
            <ChevronDownIcon className="w-5 h-5 ml-2" />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              >
                <div className="py-1">
                  {team.map((member, index) => (
                    <a
                      key={index}
                      href={member.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-gray-500">{member.role}</p>
                      </div>
                      <FaTelegram className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About; 