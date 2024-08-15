import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import firebase from 'firebase/compat/app';

import Swal from 'sweetalert2';

const ViewDetails = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProductName, setEditedProductName] = useState('');
  const [editedProductCategory, setEditedProductCategory] = useState('');
  const [editedProductDescription, setEditedProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productModel, setProductModel] = useState(null);

  useEffect(() => {
    const firebaseConfig = {
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const database = firebase.database();
    const productsRef = database.ref('products');

    const fetchData = () => {
      productsRef.on('value', (snapshot) => {
        const productsData = snapshot.val();
        if (productsData) {
          const productsArray = Object.keys(productsData).map((key) => ({
            id: key,
            ...productsData[key]
          }));
          setProducts(productsArray);
        } else {
          setProducts([]);
        }
      });
    };

    fetchData();

    return () => {
      productsRef.off('value');
    };
  }, []);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditedProductName(product.productName);
    setEditedProductCategory(product.productCategory);
    setEditedProductDescription(product.productDescription);
    setProductImage(null);
    setProductModel(null);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
  };

  const handleProductNameChange = (event) => {
    setEditedProductName(event.target.value);
  };

  const handleProductCategoryChange = (event) => {
    setEditedProductCategory(event.target.value);
  };

  const handleProductDescriptionChange = (event) => {
    setEditedProductDescription(event.target.value);
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setProductImage(imageFile);
  };

  const handleModelUpload = (event) => {
    const modelFile = event.target.files[0];
    setProductModel(modelFile);
  };

  const updateProduct = async () => {
    const { id } = selectedProduct;

    const database = firebase.database();
    const productRef = database.ref(`products/${id}`);

    try {
      await productRef.update({
        productName: editedProductName,
        productCategory: editedProductCategory,
        productDescription: editedProductDescription
      });

      if (productImage) {
        const imageStorageRef = firebase.storage().ref(`images/${id}`);
        await imageStorageRef.put(productImage);
      }

      if (productModel) {
        const modelStorageRef = firebase.storage().ref(`models/${id}`);
        await modelStorageRef.put(productModel);
      }

      Swal.fire('Updated!', 'Product details have been updated.', 'success');
      closeEditModal();
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire('Error!', 'Failed to update product details.', 'error');
    }
  };

  const deleteProduct = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const database = firebase.database();
        const productRef = database.ref(`products/${productId}`);

        productRef
          .remove()
          .then(() => {
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
          })
          .catch((error) => {
            console.error('Error deleting product:', error);
            Swal.fire('Error!', 'Failed to delete product.', 'error');
          });
      }
    });
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold ml-20 mb-4">View Products</h1>
      <div className="overflow-x-auto ml-20">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>

              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product, index) => (
              <motion.tr key={product.id} className={index % 2 === 0 ? 'bg-gray-100' : ''} whileHover={{ scale: 1.05 }}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{product.productName}</td>
                <td className="border px-4 py-2">{product.productCategory}</td>
                <td className="border px-4 py-2">{product.productDescription}</td>


                <td className="border px-4 py-2 flex justify-center gap-2">
                  <motion.button
                    onClick={() => openEditModal(product)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded transition duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaTrash />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="mb-4">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={editedProductName}
                onChange={handleProductNameChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700">
                Product Category
              </label>
              <input
                type="text"
                id="productCategory"
                name="productCategory"
                value={editedProductCategory}
                onChange={handleProductCategoryChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
                Product Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={editedProductDescription}
                onChange={handleProductDescriptionChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full h-32"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <input
                type="file"
                id="productImage"
                name="productImage"
                onChange={handleImageUpload}
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productModel" className="block text-sm font-medium text-gray-700">
                Product Model
              </label>
              <input
                type="file"
                id="productModel"
                name="productModel"
                onChange={handleModelUpload}
                className="mt-1"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={updateProduct}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300"
              >
                Update
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 ml-2 rounded transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;
