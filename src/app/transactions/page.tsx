  "use client"

import { HousePlusIcon, PackagePlusIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import Header from '../(components)/Header';
import { useGetTransactionsQuery, useProductReturnMutation, useProductSaleMutation } from '../state/api';
import AddToShopModal from './AddToShopModal';
import { toast } from 'sonner';
import AddToStoreModal from './AddtoStoreModal';

type TransactionFormData = {
    transactionId: string;
    productId: string;
    quantity: number;
    transactionType: string;
    date: string;
    remarks?: string;
  };

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [IsShopOpen, setIsShopOpen] = useState(false);
  const [IsStoreOpen, setIsStoreOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState("all");

  const { data: Transaction, isLoading, isError } = useGetTransactionsQuery();

  const [ AddtoShop ] = useProductSaleMutation();
  const [ AddtoStore ] = useProductReturnMutation();

  const handleAddToShop = async (transactionData: TransactionFormData) => {
    try {
      await AddtoShop(transactionData).unwrap();
      toast.success('Product Added to Shop successfully!');
      setIsShopOpen(false);
    } catch (error) {
      console.error('Error completing transaction:', error);
      toast.error('Failed to complete the transaction.');
    }
  };

  const handleAddToStore = async (transactionData: TransactionFormData) => {
    try {
      await AddtoStore(transactionData).unwrap();
      toast.success('Product Added to Store successfully!');
      setIsStoreOpen(false);
    } catch (error) {
      console.error('Error completing transaction:', error);
      toast.error('Failed to complete the transaction.');
    }
  };


  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !Transaction) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  const filteredTransactions = Transaction?.filter((transactions) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const matchesSearchTerm =
      transactions.product?.description?.toLowerCase().includes(lowercasedSearchTerm) ||
      transactions.product?.code.toLowerCase().includes(lowercasedSearchTerm) ||
      transactions.product?.name?.toLowerCase().includes(lowercasedSearchTerm);

    const matchesFilter =
      transactionFilter === "all" ||
      transactions.transactionType.toLowerCase() === transactionFilter;

    return matchesSearchTerm && matchesFilter;
  });

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search transfers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Header name="Transactions" />

        <div className="flex items-center gap-4 mb-5">

        <select
            className="py-2 px-4 border rounded bg-gray-200 text-gray-900"
            value={transactionFilter}
            onChange={(e) => setTransactionFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="sale">Sale</option>
            <option value="return">Return</option>
          </select>

          <button 
            className="flex items-center bg-gray-900 hover:bg-orange-400 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsStoreOpen(true)}>
            <PackagePlusIcon className="w-5 h-5 mr-2 !text-gray-200" /> 
            <span className="hidden sm:inline">Return to Store</span>
            <span className="sm:hidden">Store</span>
          </button>
          <button
            className="flex items-center bg-gray-900 hover:bg-green-500 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsShopOpen(true)}>
            <HousePlusIcon className="w-5 h-5 mr-2 !text-gray-200" /> 
            <span className="hidden sm:inline">Add to Shop</span>
            <span className="sm:hidden">Shop</span>
          </button>
        </div>
      </div>

      <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
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
                    <th className="py-6 px-4 font-semibold">Row</th>
                    <th className="py-6 px-4 font-semibold">Quantity</th>
                    <th className="py-6 px-4 font-semibold">Transaction</th>
                    <th className="py-6 px-4 font-semibold">Remarks</th>
                    <th className="py-6 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions?.map((transactions) => {
                    const date = new Date(transactions.date);
                    const formattedDate = date.toLocaleDateString();
                    const formattedTime = date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr
                        key={transactions.transactionId}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-8 px-4 font-semibold">
                          {transactions.product?.code}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {transactions.product?.name? transactions.product.name : '-'}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {transactions.product?.row? transactions.product.row : '-'}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {transactions.quantity}
                        </td>
                        <td
                          className={`py-8 px-4 font-bold ${
                            transactions.transactionType === 'sale'
                              ? 'text-green-500'
                              : 'text-orange-500'
                          }`}
                        >
                          {transactions.transactionType}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {transactions.remarks ? transactions.remarks : '-'}
                        </td>
                        <td className="py-8 px-4 font-semibold">
                          {formattedDate} <br /> {formattedTime}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <AddToStoreModal
        isOpen={IsStoreOpen}
        onClose={() => setIsStoreOpen(false)} 
        onCreate={handleAddToStore}
      />

      <AddToShopModal
        isOpen={IsShopOpen}
        onClose={() => setIsShopOpen(false)} 
        onCreate={handleAddToShop}
      />

    </div>
  );
};

export default Transactions;
