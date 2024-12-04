import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "../(components)/Header";
import { toast } from "sonner";

type ProductFormData = {
  name: string;
  code: string;
  description?: string;
  price: number;
  quantity: number;
  location: string;
  createdAt: string;
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (FormData: ProductFormData) => void;
};

const CreateProductModel = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    productId: v4(),
    name: "",
    code: "",
    description: "",
    price: 0,
    quantity: 0,
    location: "",
    createdAt: new Date().toISOString(),
  });

  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) : value,
    });
  };

  const handleLocationChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocationQuery(query);

    if (query.trim().length > 2) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1`
      );
      const data = await response.json();
      setLocationSuggestions(
        data.map((location: any) => ({
          label: location.display_name,
          lat: location.lat,
          lon: location.lon,
        }))
      );
    } else {
      setLocationSuggestions([]);
    }
  };

  const selectLocation = (location: any) => {
    setFormData({ ...formData, location: location.label });
    setLocationQuery(location.label);
    setLocationSuggestions([]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Product Name is required.");
      return;
    }

    if (!formData.code.trim()) {
      toast.error("Product Code is required.");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    if (formData.quantity < 0) {
      toast.error("Quantity cannot be negative.");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please select a location.");
      return;
    }

    onCreate(formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      productId: v4(),
      name: "",
      code: "",
      description: "",
      price: 0,
      quantity: 0,
      location: "",
      createdAt: new Date().toISOString(),
    });
    setLocationQuery("");
    setLocationSuggestions([]);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md bg-gray-100 focus:bg-white";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
        <label htmlFor="productName" className={labelCssStyles} >
             Product Name
          </label>
          <input  
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          <label htmlFor="productCode" className={labelCssStyles}>
            Code
          </label>
          <input
            type="text"
            name="code"
            placeholder="Code"
            onChange={handleChange}
            value={formData.code}
            className={inputCssStyles}
            required
          />

          <label htmlFor="productDescription" className={labelCssStyles}>
            Description
          </label>
          <input
            type="text"
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
            className={inputCssStyles}
          />

          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />
          
          <label htmlFor="productQuantity" className={labelCssStyles}>
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChange}
            value={formData.quantity}
            className={inputCssStyles}
            required
          />

          <label htmlFor="productLocation" className={labelCssStyles}>
            Location
          </label>
          <input
            type="text"
            name="locationQuery"
            placeholder="Search for a location"
            onChange={handleLocationChange}
            value={locationQuery}
            className={inputCssStyles}
          />

          {locationSuggestions.length > 0 && (
            <ul className="bg-white border rounded-md shadow-md max-h-48 overflow-auto">
              {locationSuggestions.map((location, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectLocation(location)}
                >
                  {location.label}
                </li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModel;
