import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Анимации для компонентов
  const headerVariants = {
    hidden: { y: -100 },
    visible: { 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.7
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.2
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.4
      }
    },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    hover: { 
      rotate: 360,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <motion.header
      className="bg-white shadow-sm"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Пустая левая секция для баланса */}
          <div className="flex-1" />

          {/* Центральная секция с логотипом */}
          <motion.div 
            className="flex-1 flex justify-center items-center"
            variants={logoVariants}
          >
            <Link to="/" className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
                SupplyChain Finance
              </Link>
          </motion.div>

          {/* Правая секция */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            {user ? (
              <>
                <motion.div
                  whileHover="hover"
                  variants={iconVariants}
                >
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                    <UserCircleIcon className="h-6 w-6" />
                  </Link>
                </motion.div>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Выйти
                </motion.button>
              </>
            ) : (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                >
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Войти
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header; 