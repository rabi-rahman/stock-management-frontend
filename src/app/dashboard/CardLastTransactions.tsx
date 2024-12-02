import React from 'react'
import { useGetDashboardMetricsQuery } from '../state/api';

const CardLastTransactions = () => {
    const {data: DashboardMetrics, isLoading } = useGetDashboardMetricsQuery();


    return (
      <div className='row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16'>
          {isLoading ? (
              <div className='m-5'>Loading...</div>
          ) : (
              <>
                  <h3 className='text-lg font-semibold px-7 pt-5 pb-2'>
                      
                  </h3>
                  <hr />
                  <div className="overflow-auto h-full">
                    {DashboardMetrics?.lastTransactions.map((transactions) => {
                     const date = new Date(transactions.date);

                     const formattedDate = date.toLocaleDateString(); 
                     const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div 
                      key={transactions.transactionId}
                      className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                  >
                  <div className="flex items-center font-bold gap-3">
                    {transactions.quantity}
                      <div className="font-bold text-gray-700">
                        {transactions.product.name}
                      </div>
                      <div className="flex text-sm items-center">
                        <span className={`font-bold text-xs ${transactions.transactionType === 'sale' ? 'text-green-500': 'text-orange-500'}`}>
                        {transactions.transactionType === 'sale' ? 'Sold' : 'Returned'} 
                        </span>
                      </div>
                    
                  </div>

                    <div className='flex flex-col text-xs items-end gap-2'>
                    <div >
                        {formattedDate}
                    </div>
                    <div>
                        {formattedTime}
                    </div>
                  </div>
                </div>
                )}
            )}
            </div>
              </>
          )}
      </div>
        
    )}
  

export default CardLastTransactions