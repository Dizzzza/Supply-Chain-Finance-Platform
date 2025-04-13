import React, { useState } from 'react';
import Modal from '../Modal';

const ContractInteractionModal = ({ isOpen, onClose, contract, onSubmit }) => {
  const [method, setMethod] = useState('');
  const [params, setParams] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ method, params: JSON.parse(params) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Взаимодействие со смарт-контрактом">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес контракта
          </label>
          <input
            type="text"
            value={contract?.address}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Метод
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Выберите метод</option>
            {contract?.methods?.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Параметры (JSON)
          </label>
          <textarea
            value={params}
            onChange={(e) => setParams(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder='{"param1": "value1", "param2": "value2"}'
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Выполнить
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContractInteractionModal; 