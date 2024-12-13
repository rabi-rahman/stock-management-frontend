import { useState } from "react";
import { useEditProductMutation,Product } from "../state/api";
import { toast } from "sonner";


interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const EditProductModal = ({ isOpen, onClose, product } : EditProductModalProps) => {
    const [editProduct] = useEditProductMutation();
    const [formData, setFormData] = useState({
        name: product?.name || "",
        code: product?.code || "",
        description: product?.description || "",
        row: product?.row || "",
        quantity: product?.quantity
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    };

    const handleSave = async () => {
        if (!product) {
            toast.error("No product selected!");
            return;
        }
        if (!formData.code.trim()) {
            toast.error("Product Code is required.");
            return;
          }
    
        try {
            await editProduct({
                productId: product.productId,
                updatedProduct: formData,
            }).unwrap();
            toast.success("Product updated successfully!");
            onClose();
        } catch (error) {
            toast.error("Failed to update product");
            console.error("Error updating product:", error);
        }
    };

    if (!isOpen) return null;

    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md bg-gray-100 text-gray-900 focus:bg-white";


    return (
        <div className="fixed inset-0 bg-gray-600 text-gray-200 bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-50 rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-lg text-gray-900 font-semibold mb-4">Edit Product</h2>
                <div className="space-y-4">
                    <div>
                        <label className={labelCssStyles}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputCssStyles}                        />
                    </div>
                    <div>
                        <label className={labelCssStyles}>Code</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className={inputCssStyles}                        />
                    </div>
                    <div>
                        <label className={labelCssStyles}>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={inputCssStyles}
                        />
                    </div>
                    <div>
                        <label className={labelCssStyles}>Row</label>
                        <input
                            type="text"
                            name="row"
                            value={formData.row}
                            onChange={handleChange}
                            className={inputCssStyles}
                        />
                    </div>
                    {/* <div>
                        <label className={labelCssStyles}>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className={inputCssStyles}
                        />
                    </div> */}
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        className="bg-gray-900 text-gray-100 px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
