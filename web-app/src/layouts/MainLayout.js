import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex bg-gray-100">
        <div className="flex-1 flex">
          {/* Контейнер для сайдбара и основного контента */}
          <div className="flex-1 flex gap-6 px-4 sm:px-6 lg:px-8 pt-6">
            {/* Сайдбар */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-6">
                <Sidebar />
              </div>
            </div>
            
            {/* Основной контент */}
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout; 