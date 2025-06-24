import React from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UserIcon,
  KeyIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const Terms = () => {
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
      title: "Общие положения",
      icon: <DocumentTextIcon className="h-8 w-8 text-primary-600" />,
      content: "Настоящие Условия использования регулируют отношения между платформой SupplyChain Finance (далее - 'Платформа') и пользователями платформы (далее - 'Пользователи')."
    },
    {
      title: "Регистрация и использование платформы",
      icon: <UserGroupIcon className="h-8 w-8 text-primary-600" />,
      content: "Для использования платформы необходимо пройти процедуру регистрации. Пользователь обязуется предоставить достоверную информацию при регистрации и поддерживать её актуальность.",
      items: [
        "Пользователь должен быть не младше 18 лет",
        "Пользователь должен иметь право заключать юридически обязывающие соглашения",
        "Регистрация компании должна быть подтверждена соответствующими документами"
      ]
    },
    {
      title: "Безопасность и конфиденциальность",
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-600" />,
      content: "Пользователь обязуется обеспечить безопасность своей учетной записи:",
      items: [
        "Хранить в тайне свои учетные данные",
        "Использовать надежные пароли",
        "Немедленно сообщать о подозрительной активности"
      ]
    },
    {
      title: "Финансовые операции",
      icon: <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />,
      content: "Все финансовые операции на платформе проводятся через смарт-контракты:",
      items: [
        "Транзакции являются необратимыми",
        "Комиссии указываются до проведения операции",
        "Пользователь несет ответственность за правильность указания реквизитов"
      ]
    },
    {
      title: "Ответственность сторон",
      icon: <ExclamationTriangleIcon className="h-8 w-8 text-primary-600" />,
      content: "Платформа не несет ответственности за:",
      items: [
        "Действия третьих лиц",
        "Технические сбои вне нашего контроля",
        "Упущенную выгоду пользователей"
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
          <DocumentTextIcon className="h-16 w-16 text-primary-600" />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
          Условия использования
        </h2>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Ознакомьтесь с правилами и условиями использования нашей платформы
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            variants={sectionVariants}
          >
            <div className="flex items-center gap-4 mb-6">
              {section.icon}
              <h3 className="text-2xl font-bold text-gray-900">
                {section.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              {section.content}
            </p>
            {section.items && (
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    className="flex items-start gap-3 text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        variants={sectionVariants}
      >
        <div className="flex items-center gap-4 mb-6">
          <ArrowPathIcon className="h-8 w-8 text-primary-600" />
          <h3 className="text-2xl font-bold text-gray-900">
            Изменение условий
          </h3>
        </div>
        <p className="text-gray-600">
          Платформа оставляет за собой право изменять настоящие условия использования. 
          Пользователи будут уведомлены о существенных изменениях через электронную почту 
          или уведомления на платформе.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Terms; 