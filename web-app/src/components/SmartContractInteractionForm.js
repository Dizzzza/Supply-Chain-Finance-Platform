import React, { useState } from 'react';

const SmartContractInteractionForm = ({ contract, onSubmit }) => {
  const [method, setMethod] = useState('');
  const [params, setParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setMethod(selectedMethod);
    // Сброс параметров при смене метода
    setParams({});
  };

  const handleParamChange = (paramName, value) => {
    setParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(method, params);
    } catch (error) {
      console.error('Ошибка при вызове метода:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderParamInput = (param) => {
    const { name, type } = param;
    switch (type) {
      case 'uint256':
      case 'int256':
        return (
          <input
            type="number"
            value={params[name] || ''}
            onChange={(e) => handleParamChange(name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={`Введите ${name}`}
          />
        );
      case 'address':
        return (
          <input
            type="text"
            value={params[name] || ''}
            onChange={(e) => handleParamChange(name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={`Введите адрес ${name}`}
          />
        );
      case 'string':
        return (
          <input
            type="text"
            value={params[name] || ''}
            onChange={(e) => handleParamChange(name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={`Введите ${name}`}
          />
        );
      case 'bool':
        return (
          <select
            value={params[name] || ''}
            onChange={(e) => handleParamChange(name, e.target.value === 'true')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Выберите значение</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Метод контракта
        </label>
        <select
          value={method}
          onChange={handleMethodChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Выберите метод</option>
          {contract?.methods?.map((method) => (
            <option key={method.name} value={method.name}>
              {method.name}
            </option>
          ))}
        </select>
      </div>

      {method && contract?.methods?.find(m => m.name === method)?.params?.map((param) => (
        <div key={param.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {param.name} ({param.type})
          </label>
          {renderParamInput(param)}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Выполняется...' : 'Вызвать метод'}
        </button>
      </div>
    </form>
  );
};

export default SmartContractInteractionForm; 