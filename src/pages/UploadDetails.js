// UploadDetails.js
import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

const UploadDetails = () => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productHTMLContent, setProductHTMLContent] = useState('');
  const [modelImagePairs, setModelImagePairs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleAddPair = () => {
    if (modelImagePairs.length < 5) {
      setModelImagePairs([...modelImagePairs, { model: null, image: null }]);
    } else {
      Swal.fire('Error!', 'You can only upload up to 5 models.', 'error');
    }
  };

  const handleModelChange = (index, e) => {
    const updatedPairs = modelImagePairs.map((pair, i) =>
      i === index ? { ...pair, model: e.target.files[0] } : pair
    );
    setModelImagePairs(updatedPairs);
  };

  const handleImageChange = (index, e) => {
    const updatedPairs = modelImagePairs.map((pair, i) =>
      i === index ? { ...pair, image: e.target.files[0] } : pair
    );
    setModelImagePairs(updatedPairs);
  };

  const handleUpload = async () => {
    setUploading(true);

    const storageRef = firebase.storage().ref();
    const modelsRef = storageRef.child('models');
    const imagesRef = storageRef.child('images');

    try {
      const uploadPromises = modelImagePairs.map(async (pair) => {
        const modelRef = modelsRef.child(pair.model.name);
        await modelRef.put(pair.model);
        const modelUrl = await modelRef.getDownloadURL();

        const imageRef = imagesRef.child(pair.image.name);
        await imageRef.put(pair.image);
        const imageUrl = await imageRef.getDownloadURL();

        return { modelUrl, imageUrl };
      });

      const uploadedPairs = await Promise.all(uploadPromises);

      const details = {
        productName,
        productCategory,
        productDescription,
        productHTMLContent,
        modelImagePairs: uploadedPairs
      };

      await firebase.database().ref('products').push(details);

      Swal.fire('Success!', 'Product added successfully', 'success');

      setProductName('');
      setProductCategory('');
      setProductDescription('');
      setProductHTMLContent('');
      setModelImagePairs([]);
    } catch (error) {
      console.error("Error uploading:", error);
      Swal.fire('Error!', 'Error uploading. Please try again later.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Product Details</h1>
      <div className="space-y-4">
        <div className="relative">
          <input required type="text" placeholder="Product Name" className="input-field pl-10 py-2 rounded-sm border border-gray-300 w-full" value={productName} onChange={(e) => setProductName(e.target.value)} />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FontAwesomeIcon className='absolute left-3 top-1/2 transform -translate-y-1/2' icon={faUser} />
          </span>
        </div>
        <div className="relative">
          <select required className="input-field pl-10 pr-4 py-2 rounded-sm border text-gray-400 border-gray-300 w-full" value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
            <option value="">Select Product Category</option>
            <option value="Sofa">Sofa</option>
            <option value="Chair">Chair</option>
            <option value="Tables">Tables</option>
            <option value="Electronics">Electronics</option>
            <option value="Bookshelf">Bookshelf</option>
          </select>
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FontAwesomeIcon className='absolute left-3 top-1/2 transform -translate-y-1/2' icon={faList} />
          </span>
        </div>
        <textarea placeholder="Product Description" className="input-field resize-none py-2 rounded-sm border border-gray-300 w-full p-2 h-24" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
        <textarea placeholder="Product 3D View Link" className="input-field resize-none py-2 rounded-sm border border-gray-300 w-full p-2 h-24" value={productHTMLContent} onChange={(e) => setProductHTMLContent(e.target.value)} />
        {modelImagePairs.map((pair, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold">Upload Model {index + 1}</label>
              <input required type="file" onChange={(e) => handleModelChange(index, e)} className="hidden" id={`model-upload-${index}`} />
              <label htmlFor={`model-upload-${index}`} className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out">
                <FontAwesomeIcon icon={faUpload} className="mr-2" /> Select Model
              </label>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold">Upload Image {index + 1}</label>
              <input required type="file" onChange={(e) => handleImageChange(index, e)} className="hidden" id={`image-upload-${index}`} />
              <label htmlFor={`image-upload-${index}`} className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out">
                <FontAwesomeIcon icon={faUpload} className="mr-2" /> Select Image
              </label>
            </div>
          </div>
        ))}
        {modelImagePairs.length < 5 && (
          <button onClick={handleAddPair} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105">
            Add Model-Image Pair
          </button>
        )}
        <button onClick={handleUpload} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105">
          Upload
        </button>
      </div>

      {/* Progress dialog */}
      {uploading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-75 flex justify-center items-center z-50">
          <div className="text-white">Uploading...</div>
        </div>
      )}
    </div>
  );
};

export default UploadDetails;
