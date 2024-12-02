import React from 'react'
import { useGetDashboardMetricsQuery } from '../state/api';
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { TrendingUp } from 'lucide-react';

const CardTotalQuantities = () => {
    const {data: DashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

    if (!DashboardMetrics) {
        return <div>No data available</div>;
      }
    

      const saleQuantity = DashboardMetrics.totalTransactionsQuantity.find(
        (t) => t.type === "sale"
      )?.quantity || 0;
    
      const returnQuantity = DashboardMetrics.totalTransactionsQuantity.find(
        (t) => t.type === "return"
      )?.quantity || 0;

      const pieData = [
        {
          name: "Sale Quantity",
          value: saleQuantity,
        },
        {
          name: "Return Quantity",
          value: returnQuantity,
        },
      ];
        
      const COLORS = ['#00C49F', '#FF8042'];

      const totalTransactionsQty = saleQuantity + returnQuantity;
      // const totalProductQuantity = DashboardMetrics.totalProductQuantity;
      const salePercentage = ((saleQuantity / totalTransactionsQty) * 100).toFixed(0);
    
  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
        <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Total Transaction Quantity
            </h2>
            <hr />
        </div>
        <div className="xl:flex justify-between pr-7">
            <div className="relative basis-3/5 mt-2">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={60}
                    fill="#8884d8"
                  >
                    {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
                <span className="flex flex-col font-bold text-xl">
                    <div className='text-sm'>Total</div>
                    <div>{totalTransactionsQty}</div>
                </span>
              </div>
            </div>
            <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
              {pieData.map((entry, index) => (
                <li
                  key={`legend-${index}`}
                  className="flex items-center text-xs"
                >
                  <span
                    className="mr-2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            {pieData && (
              <div className="mt-3 flex justify-between items-center px-7 mb-4">
                <span>Total Sale : {saleQuantity}</span>
              <span className="text-green-500 flex items-center mt-2">
                <TrendingUp className="m-2 text-green-500" />
                <span className='text-gray-900'>{salePercentage}%</span>
              </span>
            </div>
            )}
          </div>
        </>
    )}
    </div>
  )
}

export default CardTotalQuantities