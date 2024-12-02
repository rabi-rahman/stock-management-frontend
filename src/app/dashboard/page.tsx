"use client"

import CardLastTransactions from "./CardLastTransactions"
import CardLowQuantityProducts from "./CardLowQuantityProducts"
import CardTotalProducts from "./CardTotalProducts"
import CardTotalQuantities from "./CardTotalQuantities"

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardLowQuantityProducts />
      <CardLastTransactions />
      <CardTotalQuantities />
      <CardTotalProducts />
    </div>
  )
}

export default Dashboard