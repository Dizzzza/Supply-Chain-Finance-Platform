import React, { useState } from 'react';

const WalletConnectButton = ({ onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const handleConnect = async () => {
    try {
      if (window.tronWeb) {
        const accounts = await window.tronWeb.request({ method: 'tron_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          onConnect?.(accounts[0]);
        }
      } else {
        alert('Пожалуйста, установите TronLink');
      }
    } catch (error) {
      console.error('Ошибка подключения кошелька:', error);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    onDisconnect?.();
  };

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {formatAddress(address)}
          </span>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Отключить
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Подключить кошелек
        </button>
      )}
    </div>
  );
};

export default WalletConnectButton; 