import React from 'react'
import { useGetDashboardMetricsQuery } from '../state/api'

const CardLowQuantityProducts = () => {
    const {data: DashboardMetrics, isLoading } = useGetDashboardMetricsQuery();


  return (
    <div className='row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16'>
        {isLoading ? (
            <div className='m-5'>Loading...</div>
        ) : (
            <>
                <h3 className='text-lg font-semibold px-7 pt-5 pb-2'>
                    Low Quantity Products
                </h3>
                <hr />
                <div className="overflow-auto h-full">
                {DashboardMetrics?.lowProducts.map((product) => (
                <div 
                    key={product.productId}
                    className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                >
                <div className="flex items-center gap-3">
                  <div>img</div>
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700">
                      {product.name}
                    </div>
                    <div className="flex text-sm items-center">
                    {product.code}
                      <span className="mx-2">|</span>
                      <span className="font-bold text-blue-500 text-xs ">
                        {product.row} 
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`text-xs flex items-center ${product.quantity < 5 ? 'text-red-500' : 'text-slate-100'}`}>
                  {product.quantity}
                </div>
              </div>
            ))}
          </div>
            </>
        )}
    </div>
  )
}

export default CardLowQuantityProducts