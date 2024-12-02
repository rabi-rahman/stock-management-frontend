import React from 'react'
import { useGetDashboardMetricsQuery } from '../state/api';


const CardTotalProducts = () => {
    const {data: DashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

    if (!DashboardMetrics) {
        return <div>No data available</div>;
      }


  return (
    <div className="flex flex-col row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
        <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
          Total Summary
        </h2>
        <hr />
        </div>
        <div className="flex justify-center items-center h-full">
            <h1 className="text-2xl md:text-3xl">Coming soon</h1>
        </div>
        </>
    )}
    </div>
  )
}


export default CardTotalProducts