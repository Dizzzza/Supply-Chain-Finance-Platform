import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  ChartBarIcon, 
  TruckIcon,
  WalletIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  PhoneIcon,
  DocumentIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Главная', href: '/', icon: HomeIcon },
  { name: 'Панель управления', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Поставки', href: '/supplier/shipments', icon: TruckIcon },
  { name: 'Транзакции', href: '/blockchain/transactions', icon: WalletIcon },
];

const additionalLinks = [
  { name: 'О платформе', href: '/about', icon: InformationCircleIcon },
  { name: 'Контакты', href: '/contact', icon: PhoneIcon },
  { name: 'Условия', href: '/terms', icon: DocumentIcon },
  { name: 'Конфиденциальность', href: '/privacy', icon: LockClosedIcon },
];

const Sidebar = () => {
  const location = useLocation();

  // Анимации для компонентов
  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.2
      }
    }
  };

  const NavLink = ({ item, isActive }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={item.href}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
          ${isActive 
            ? 'bg-primary-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-primary-500/10 hover:text-white'
          }`}
      >
        <motion.div
          whileHover={{ rotate: isActive ? 0 : 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <item.icon
            className={`mr-3 h-5 w-5 transition-colors duration-200
              ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'}`}
            aria-hidden="true"
          />
        </motion.div>
        <span className="font-medium">{item.name}</span>
      </Link>
    </motion.div>
  );

  return (
    <motion.div
      className="bg-gray-900 rounded-xl shadow-xl overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      {/* Логотип */}
      <motion.div 
        className="flex items-center justify-center h-16 px-4 bg-gray-800/50 backdrop-blur-sm"
        variants={logoVariants}
      >
        <motion.span 
          className="text-xl font-bold text-white tracking-wider"
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 400 }
          }}
        >
          SupplyChain
          <motion.span 
            className="text-primary-500"
            animate={{ 
              opacity: [1, 0.8, 1],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Finance
          </motion.span>
        </motion.span>
      </motion.div>

      {/* Основная навигация */}
      <div className="flex flex-col min-h-0">
        <motion.nav 
          className="flex-1 px-3 py-4 space-y-2"
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={location.pathname === item.href}
              />
            ))}
          </AnimatePresence>
        </motion.nav>

        {/* Разделитель */}
        <motion.div 
          className="px-3 py-4"
          variants={itemVariants}
        >
          <motion.div 
            className="h-px bg-gray-700/50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5 }}
          />
        </motion.div>

        {/* Дополнительные ссылки */}
        <motion.nav 
          className="px-3 pb-4 space-y-1"
          variants={itemVariants}
        >
          <motion.p 
            className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            variants={itemVariants}
          >
            Дополнительно
          </motion.p>
          <AnimatePresence mode="wait">
            {additionalLinks.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={location.pathname === item.href}
              />
            ))}
          </AnimatePresence>
        </motion.nav>
      </div>
    </motion.div>
  );
};

export default Sidebar; 