import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

 
export interface Product{
    productId:string,
    name?:string,
    code:string,
    description?:string,
    row?:string
    quantity:number,
    createdAt:string
}

export interface newProduct{
    name?:string,
    code:string,
    description?:string,
    row?:string,
    quantity:number,
}

export interface Transaction{
    transactionId:string,
    productId?:string,
    quantity:number,
    transactionType:string,
    date:string,
    remarks?:string,
    product?:Product
}
export interface newTransaction{
    productId:string,
    quantity:number,
    transactionType:string,
    date:string,
    remarks?:string,
}

export interface TotalTransactionsQuantity{
    transactionId:string,
    quantity:number,
    type:string,
}


export interface DashboardMetrics{
    lowProducts: Product[],
    lastTransactions: Transaction[],
    totalTransactionsQuantity: TotalTransactionsQuantity[],
    totalProductQuantity: number
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
    reducerPath: "api",
    tagTypes: ["DashboardMetrics","Products","Transaction"],
    endpoints: (build) => ({
        getDashboardMetrics: build.query<DashboardMetrics, void>({
            query: () => '/dashboard',
            providesTags: ['DashboardMetrics']
        }),

        getProducts: build.query<Product[], string | void>({
            query: () => ({
                url: "/products",
            }),
            providesTags: ['Products']
        }),

        createProduct: build.mutation<Product, newProduct>({
            query: (newProduct) => ({
                url: "/products",
                method: "POST",
                body: newProduct
            }),
            invalidatesTags: ['Products']
        }),

        deleteProduct: build.mutation<void, string>({
            query: (productId) => ({
                url: `/products/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Products'],
        }),

        editProduct: build.mutation<Product, { productId: string; updatedProduct: Partial<Product> }>({
            query: ({ productId, updatedProduct }) => ({
                url: `/products/${productId}`,
                method: "PUT",
                body: updatedProduct,
            }),
            invalidatesTags: ["Products"],
        }),

        getTransactions : build.query<Transaction[], string | void>({
            query: () => ({
                url: "/transactions",
            }),
            providesTags: ['Transaction']
        }),

        productSale: build.mutation<Transaction, newTransaction>({
            query: (newTransaction) => ({
                url: "/transactions/AddtoShop",
                method: "POST",
                body: newTransaction
            }),
            invalidatesTags: ['Transaction']
        }),

        productReturn: build.mutation<Transaction, newTransaction>({
            query: (newTransaction) => ({
                url: "/transactions/AddtoStore",
                method: "POST",
                body: newTransaction
            }),
            invalidatesTags: ['Transaction']
        }),
    }) ,
});
    
export const { useGetDashboardMetricsQuery, useGetProductsQuery, useCreateProductMutation, useGetTransactionsQuery, useProductSaleMutation, useProductReturnMutation, useDeleteProductMutation, useEditProductMutation } = api ;