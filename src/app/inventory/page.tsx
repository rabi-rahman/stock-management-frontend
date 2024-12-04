"use client"

import { useGetProductsQuery } from '../state/api'
import Header from '@/app/(components)/Header';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


const columns:GridColDef[] = [
    { field: "productId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product Name", width: 200 },
    { field: "code", headerName: "Product Code", width: 110 },
    {
      field: "price",
      headerName: "Price",
      width: 80,
      type: "number",
      valueGetter: (value,row) => `﷼
       ${row.price}`,
    },
    {
      field: "quantity",
      headerName: "Stock Quantity",
      width: 100,
      type: "number",
    },
    {
      field: "location",
      headerName: "Location",
      width: 350,
    },
    { 
      field: "createdDate",
      headerName: "Date",
      width: 150,
      valueGetter: (value,row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
            });
        }
    },
    { 
      field: "createdTime",
      headerName: "Time",
      width: 150,
      valueGetter: (value, row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
            });
        }
    },
  ];

const Inventory = () => {
    const {data: Products, isError, isLoading } = useGetProductsQuery();

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

  return (
    <div className="flex flex-col ">
      <Header name="Inventory" />
      <DataGrid
        rows={Products}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        className="bg-slate-50 shadow rounded-lg border border-gray-200 mt-5 text-gray-700" 
        />
    </div>
  )
}

export default Inventory