import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ComputerDesktopIcon,
  LockClosedIcon,
  UserGroupIcon,
  CogIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Privacy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const sections = [
    {
      title: "Сбор информации",
      icon: <UserIcon className="h-8 w-8 text-primary-600" />,
      items: [
        "Персональные данные (имя, email, телефон)",
        "Данные компании (название, регистрационные данные)",
        "Финансовая информация (транзакции, балансы)",
        "Технические данные (IP-адрес, cookies)"
      ]
    },
    {
      title: "Использование информации",
      icon: <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />,
      items: [
        "Предоставления доступа к платформе",
        "Обработки транзакций",
        "Улучшения качества сервиса",
        "Обеспечения безопасности",
        "Коммуникации с пользователями"
      ]
    },
    {
      title: "Защита информации",
      icon: <LockClosedIcon className="h-8 w-8 text-primary-600" />,
      items: [
        "Шифрование данных при передаче",
        "Безопасное хранение в зашифрованном виде",
        "Регулярное обновление систем безопасности",
        "Строгий контроль доступа к данным"
      ]
    },
    {
      title: "Передача данных третьим лицам",
      icon: <UserGroupIcon className="h-8 w-8 text-primary-600" />,
      items: [
        "С явного согласия пользователя",
        "Для выполнения требований законодательства",
        "Для обработки платежей (только необходимые данные)",
        "Партнерам платформы (в обезличенном виде)"
      ]
    },
    {
      title: "Права пользователей",
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-600" />,
      items: [
        "Доступ к своим данным",
        "Исправление неточных данных",
        "Удаление данных",
        "Ограничение обработки данных",
        "Получение копии данных"
      ]
    },
    {
      title: "Cookies и трекинг",
      icon: <ComputerDesktopIcon className="h-8 w-8 text-primary-600" />,
      items: [
        "Улучшения работы платформы",
        "Анализа использования сервиса",
        "Персонализации контента",
        "Обеспечения безопасности"
      ]
    }
  ];

  return (
    <motion.div 
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center"
        variants={sectionVariants}
      >
        <div className="flex justify-center mb-6">
          <ShieldCheckIcon className="h-16 w-16 text-primary-600" />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
          Политика конфиденциальности
        </h2>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Мы заботимся о безопасности ваших данных и гарантируем их надежную защиту
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            variants={sectionVariants}
          >
            <div className="flex items-center gap-4 mb-6">
              {section.icon}
              <h3 className="text-xl font-bold text-gray-900">
                {section.title}
              </h3>
            </div>
            <ul className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <motion.li
                  key={itemIndex}
                  className="flex items-start gap-2 text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                >
                  <div className="h-2 w-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        variants={sectionVariants}
      >
        <div className="flex items-center gap-4 mb-6">
          <CogIcon className="h-8 w-8 text-primary-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Изменения в политике конфиденциальности
          </h3>
        </div>
        <p className="text-gray-600">
          Мы оставляем за собой право вносить изменения в политику конфиденциальности. 
          Пользователи будут уведомлены о существенных изменениях через email или 
          уведомления на платформе.
        </p>
      </motion.div>

      <motion.div 
        className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg p-8 text-white"
        variants={sectionVariants}
      >
        <div className="flex items-center gap-4 mb-6">
          <EnvelopeIcon className="h-8 w-8" />
          <h3 className="text-xl font-bold">
            Контакты
          </h3>
        </div>
        <p className="mb-6">
          По вопросам, связанным с обработкой персональных данных, обращайтесь:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <EnvelopeIcon className="h-6 w-6" />
            <span>privacy@supplychain.finance</span>
          </div>
          <div className="flex items-center gap-3">
            <PhoneIcon className="h-6 w-6" />
            <span>+7 (777) 777-77-77</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-6 w-6" />
            <span>Алматы, ул. Сатпаева 22, офис 505</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Privacy; 