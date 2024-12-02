import React, { FormEvent, useEffect, useState } from 'react';
import { useGetProductsQuery } from '../state/api';
import { v4 } from 'uuid';
import Header from '../(components)/Header';
import { toast } from 'sonner';

type TransactionFormData = {
  transactionId: string;
  productId: string;
  quantity: number;
  transactionType: string;
  date: string;
  remarks?: string;
};

type AddToShopModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (transactionData: TransactionFormData) => void;
};

const AddToShopModal = ({ isOpen, onClose, onCreate }: AddToShopModalProps) => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [remarks, setRemarks] = useState<string>('');

  const { data: products, isLoading, refetch } = useGetProductsQuery();

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setSearchTerm('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProduct) {
        toast.error('Please select a product.');
      return;
    }

    if (quantity === '' || Number(quantity <= 0)) {
        toast.error('Quantity Must be greater than 0.');
      return;
    }

    if (selectedProduct.quantity < Number(quantity)) {
        toast.error('Insufficient stock.');
        return;
      }

    const transactionData: TransactionFormData = {
      transactionId: v4(),
      productId: selectedProduct.productId,
      quantity: Number(quantity),
      transactionType: 'sale',
      date: new Date().toISOString(),
      remarks,
    };

    onCreate(transactionData);
    resetForm();
    refetch();
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity('');
    setRemarks('');
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = products?.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-[400px] shadow-lg rounded-md bg-white">
        <Header name="Add Product to Shop" />
        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
            Product
          </label>
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md bg-gray-100 focus:bg-white"
          />
          {searchTerm && (
            <div className="max-h-40 overflow-y-auto bg-white mt-2 shadow">
              {isLoading ? (
                <div className="p-2 text-gray-500">Loading...</div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product: any) => (
                  <div
                    key={product.productId}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleProductSelect(product)}
                  >
                    {product.name} - {product.code}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No products found</div>
              )}
            </div>
          )}
          {selectedProduct && (
            <div className="mt-4 border border-gray-300 rounded-md p-2">
              <h3 className="text-gray-700 font-semibold">Selected Product:</h3>
              <p className="text-gray-600 mt-1">Name: {selectedProduct.name}</p>
              <p className="text-gray-600 mt-1">Code: {selectedProduct.code}</p>
              <p className="text-gray-600 mt-1">Price: ﷼{selectedProduct.price}</p>
              <p className="text-gray-600 mt-1">
                Quantity Available: {selectedProduct.quantity}
              </p>
            </div>
          )}
          {selectedProduct && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md bg-gray-100 focus:bg-white"
                min={1}
              />
              <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
                Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md bg-gray-100 focus:bg-white"
              ></textarea>
            </>
          )}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddToShopModal;
