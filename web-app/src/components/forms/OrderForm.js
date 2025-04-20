import React, { useState } from 'react';

const OrderForm = ({ products, suppliers, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    products: [],
    deliveryAddress: '',
    deliveryDate: '',
    paymentTerms: '30',
    notes: ''
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleProductQuantityChange = (productId, quantity) => {
    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, quantity: parseInt(quantity) } : p
      )
    );
  };

  const handleProductRemove = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      products: selectedProducts,
      totalAmount: calculateTotal()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Поставщик
          </label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Выберите поставщика</option>
            {suppliers?.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес доставки
          </label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата доставки
          </label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Условия оплаты (дни)
          </label>
          <input
            type="number"
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Добавить продукт
        </label>
        <div className="flex space-x-2">
          <select
            onChange={(e) => handleProductSelect(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Выберите продукт</option>
            {products?.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.price} TRX
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Выбранные продукты</h3>
        {selectedProducts.map(product => (
          <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">{product.price} TRX/шт</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => handleProductQuantityChange(product.id, e.target.value)}
                min="1"
                className="w-20 px-2 py-1 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => handleProductRemove(product.id)}
                className="text-red-600 hover:text-red-800"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Итого:</span>
          <span className="text-xl font-bold">{calculateTotal()} TRX</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Примечания
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Создать заказ
        </button>
      </div>
    </form>
  );
};

export default OrderForm; 