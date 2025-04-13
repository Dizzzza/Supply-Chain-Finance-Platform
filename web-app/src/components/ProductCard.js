import React from 'react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          </div>
          <span className="text-lg font-bold text-blue-600">{product.price} TRX</span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">{product.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Количество:</span>
            <span className="font-medium">{product.quantity} {product.unit}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="text-blue-600 hover:text-blue-800"
            >
              Редактировать
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-800"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 