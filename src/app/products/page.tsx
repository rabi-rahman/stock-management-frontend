  "use client"

  import { useState } from "react";
  import { useCreateProductMutation, useGetProductsQuery } from "../state/api";
  import { PlusCircleIcon, SearchIcon } from "lucide-react";
  import Header from "../(components)/Header";
  import CreateProductModel from "./CreateProductModal";
  import { toast } from "sonner";

  type ProductFormData = {
      name: string;
      code: string;
      description?: string;
      price: number;
      quantity: number;
      createdAt: string;
    };


  const Products = () => {

      const [searchTerm, setSearchTerm] = useState("");
      const [isModalOpen, setIsModalOpen] = useState(false);
      

      const {data: Products, isLoading, isError } = useGetProductsQuery();

      const [ createProduct ] = useCreateProductMutation();

      const handleCreateProduct = async (productData: ProductFormData) => {
        try{
          await createProduct(productData).unwrap();
          toast.success("Product created successfully!");
          setIsModalOpen(false);
          

        }catch (error) {
          console.error("Error creating product:", error);
          toast.error("Failed to create the product. Please try again.");
      }
    }

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

      const filteredProducts = Products?.filter((product) => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        product.code.toLowerCase().includes(lowercasedSearchTerm)
      );
    });

      


    return (
      <div className="mx-auto pb-5 w-full">
          <div className="mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded">
              <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
              <input
                  className="w-full py-2 px-4 rounded bg-white"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
          </div>

          <div className="flex justify-between items-center mb-6">
          <Header name="Products" />
          
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-100 font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-100" /> Create Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
              filteredProducts?.length > 0 ? (
                  filteredProducts.map((product) => (
              <div
                key={product.productId}
                className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
              >
              <div className="flex flex-col items-center">img
                  <div className="flex items-center gap-3">
                  <h3 className="text-lg text-gray-900 font-semibold">
                    {product.name}
                  </h3>
                  <h3>|</h3>
                  <h3 className="text-lg text-gray-900 font-semibold">
                    {product.code}
                  </h3>
                  </div>
              
                  <p className="text-gray-800 mt-1">﷼ {product.price}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    Stock: {product.quantity}
                  </div>
                  {product.description}z
                </div>
              </div>
            ))
          ) : (
              <div className="text-center text-gray-500 col-span-full">
                No products found.
              </div>
          )
          )}
          </div>

          <CreateProductModel 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onCreate={handleCreateProduct}
          />
      </div>
    )
  }

  export default Products