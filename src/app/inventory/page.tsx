"use client"

import { SearchIcon, SquarePen, X } from 'lucide-react';
import { useState } from 'react';
import Header from '../(components)/Header';
import { Product, useDeleteProductMutation, useGetProductsQuery } from '../state/api';
import { toast } from 'sonner';
import EditProductModal from './EditProductModal';

const inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: Products, isLoading, isError, refetch } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();


  const openModal = (products:Product) => {
    setSelectedProduct(products);
    setModalOpen(true);
};

const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
    refetch();
};

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !Products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  const handleDelete = async (productId: string) => {
    toast('Are you sure you want to delete this product? ', {
      action: {
        label: 'Yes',
        onClick: async () => {
          try {
          await deleteProduct(productId).unwrap();
          toast.success('Product deleted successfully');
          refetch(); 
        } catch (error) {
          toast.error('Failed to delete product');
          console.log(error);
          
        }}
      },
      cancel: {
        label: 'No',
        onClick: () => {}
      }
    });
  };

  const filteredProducts = Products?.filter((products) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      products.name?.toLowerCase().includes(lowercasedSearchTerm) ||
      products.code.toLowerCase().includes(lowercasedSearchTerm) ||
      products.description?.toLowerCase().includes(lowercasedSearchTerm)    );
  });


  return (
    <div className="mx-auto pb-5 w-full">
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Header name="Inventory" />
      </div>

      <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16 mt-4">
        {isLoading ? (
          <div className="m-5">Loading...</div>
        ) : isError ? (
          <div className="m-5 text-red-500">Error loading transactions</div>
        ) : (
          <>
          <div className="overflow-auto h-full">
              <table className="w-full table-auto">
                <thead className="bg-gray-800 text-gray-100">
                  <tr className="text-left border-b">
                    <th className="py-6 px-4 font-semibold">Product Code</th>
                    <th className="py-6 px-4 font-semibold">Product Name</th>
                    <th className="py-6 px-4 font-semibold">Description</th>
                    <th className="py-6 px-4 font-semibold">Quantity</th>
                    <th className="py-6 px-4 font-semibold">Row</th>
                    <th className="py-6 px-4 font-semibold">Date</th>
                    <th className="py-6 px-4 font-semibold">Edit</th>
                    <th className="py-6 px-4 font-semibold">Delete</th>
                    
                  </tr>
                </thead>
                <tbody>
                {filteredProducts?.map((products) => {
                    const date = new Date(products.createdAt);
                    const formattedDate = date.toLocaleDateString();
                    const formattedTime = date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr
                        key={products.productId}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-8 px-4 font-semibold">
                          {products.code}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {products.name}
                        </td>
                        <td className="py-8 px-4 font-semibold break-words max-w-[10rem]">
                          {products.description}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {products.quantity}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {products.row}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {formattedDate} <br /> {formattedTime}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          <button onClick={()=>openModal(products)}>                        
                            <SquarePen className="w-6 h-6 mr-2 text-blue-500" />
                          </button>
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          <button onClick={()=>handleDelete(products.productId)}>
                            <X className="w-6 h-6 mr-2 text-red-500" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
                <EditProductModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    product={selectedProduct}
                />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default inventory