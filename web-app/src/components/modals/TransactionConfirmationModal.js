import React from 'react';
import Modal from '../Modal';

const TransactionConfirmationModal = ({ isOpen, onClose, transaction, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Подтверждение транзакции">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Сумма</p>
            <p className="font-medium">{transaction?.amount} TRX</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Комиссия</p>
            <p className="font-medium">{transaction?.fee || '0.1'} TRX</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">От</p>
            <p className="font-medium">{transaction?.from}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Кому</p>
            <p className="font-medium">{transaction?.to}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Описание</p>
          <p className="text-gray-700">{transaction?.description || 'Нет описания'}</p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionConfirmationModal; 