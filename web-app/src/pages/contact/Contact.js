import React from 'react';
import { FaTelegram } from 'react-icons/fa';
import KatyaImage from './creators/Катя.jpg';
import ArturImage from './creators/Артур.jpg';
import DoszhanImage from './creators/Досжан.jpg';
import DiasImage from './creators/Диас.jpg';

const Contact = () => {
  const team = [
    {
      name: 'Катя',
      role: 'Тимлид и фронтенд-разработчик',
      telegram: 'https://t.me/Kucenok',
      image: KatyaImage
    },
    {
      name: 'Артур',
      role: 'Бэкенд-разработчик и интеграция API',
      telegram: 'https://t.me/ARARIO',
      image: ArturImage
    },
    {
      name: 'Досжан',
      role: 'Дизайнер и фронтенд-разработчик',
      telegram: 'https://t.me/dr_dos_152',
      image: DoszhanImage
    },
    {
      name: 'Диас',
      role: 'Техлид и разработчик смарт-контрактов',
      telegram: 'https://t.me/tegdlyaAbyla',
      image: DiasImage
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Наша команда
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Познакомьтесь с разработчиками, которые создали эту платформу
        </p>
      </div>

      {/* Команда разработчиков */}
      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="relative h-[400px]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{member.role}</p>
                <a
                  href={member.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaTelegram className="h-5 w-5 mr-2" />
                  Написать в Telegram
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact; 