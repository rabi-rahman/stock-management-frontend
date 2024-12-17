import React, { FormEvent, useEffect, useState, useRef } from 'react';
import { useGetProductsQuery, useAddStockMutation } from '../state/api';
import { toast } from 'sonner';
import Header from '../(components)/Header';

type AddProductQuantityModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddProductQuantityModal = ({ isOpen, onClose }: AddProductQuantityModalProps) => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const { data: products, isLoading, refetch } = useGetProductsQuery();
  const [addStock] = useAddStockMutation();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error('Please select a product.');
      return;
    }

    console.log(Number(quantity))
    console.log(selectedProduct.productId)

    if (quantity === '' || Number(quantity) <= 0) {
      toast.error('Quantity must be greater than 0.');
      return;
    }

    try {
      await addStock({
        productId: selectedProduct.productId,
        quantity: Number(quantity),
      }).unwrap();

      toast.success('Stock quantity updated successfully!');
      resetForm();
    } catch (error) {
      toast.error('Failed to update stock quantity.');
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity('');
    setHighlightedIndex(-1);
    refetch();
  };

  const filteredProducts =
    products?.filter((product) =>
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      if (highlightedIndex < (filteredProducts?.length || 0) - 1) {
        setHighlightedIndex(highlightedIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (highlightedIndex > 0) {
        setHighlightedIndex(highlightedIndex - 1);
      }
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        handleProductSelect(filteredProducts[highlightedIndex]);
      }
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-[400px] shadow-lg rounded-md bg-white">
        <Header name="Add Stock Quantity" />
        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
            Product
          </label>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md bg-gray-100 focus:bg-white"
          />
          {searchTerm && (
            <div className="max-h-40 overflow-y-auto bg-white mt-2 shadow">
              {isLoading ? (
                <div className="p-2 text-gray-500">Loading...</div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product: any, index: number) => (
                  <div
                    key={product.productId}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      highlightedIndex === index ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    code: {product.code} | name: {product.name}
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
              <p className="text-gray-600 mt-1">Code: {selectedProduct.code}</p>
              <p className="text-gray-600 mt-1">Name: {selectedProduct.name}</p>
              <p className="text-gray-600 mt-1">Description: {selectedProduct.description}</p>
              <p className="text-gray-600 mt-1">Row: {selectedProduct.row}</p>
              <p className="text-gray-600 mt-1">
                Quantity Available: {selectedProduct.quantity}
              </p>
            </div>
          )}
          {selectedProduct && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
                Quantity to Add
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md bg-gray-100 focus:bg-white"
                min={1}
              />
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

export default AddProductQuantityModal;
