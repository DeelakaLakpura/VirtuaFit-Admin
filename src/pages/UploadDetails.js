import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser, faList, faAdd } from '@fortawesome/free-solid-svg-icons';
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
      setModelImagePairs([...modelImagePairs, { model: {name: ''}, image: {name: ''} }]);
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
        if (!pair.model || !pair.image) {
          throw new Error('Both model and image must be selected for each pair.');
        }
  
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
      Swal.fire('Error!', error.message || 'Error uploading. Please try again later.', 'error');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Product Details</h1>
      <div className="space-y-6">
        <div className="relative">
          <input
            required
            type="text"
            placeholder="Product Name"
            className="input-field pl-12 py-3 rounded-md border border-gray-300 w-full"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
            <FontAwesomeIcon icon={faUser} />
          </span>
        </div>

        <div className="relative">
          <select
            required
            className="input-field pl-12 pr-4 py-3 rounded-md border text-gray-600 border-gray-300 w-full"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          >
            <option value="">Select Product Category</option>
            <option value="Sofa">Sofa</option>
            <option value="Chair">Chair</option>
            <option value="Tables">Tables</option>
            <option value="Electronics">Electronics</option>
            <option value="Bookshelf">Bookshelf</option>
          </select>
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
            <FontAwesomeIcon icon={faList} />
          </span>
        </div>

        <textarea
          placeholder="Product Description"
          className="input-field resize-none py-3 rounded-md border border-gray-300 w-full p-3 h-32"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />

        <textarea
          placeholder="Product 3D View Link"
          className="input-field resize-none py-3 rounded-md border border-gray-300 w-full p-3 h-32"
          value={productHTMLContent}
          onChange={(e) => setProductHTMLContent(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modelImagePairs.map((pair, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-md border border-gray-200">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-semibold">Upload Model {index + 1}</label>
                  <input
                    required
                    type="file"
                    onChange={(e) => handleModelChange(index, e)}
                    className="hidden"
                    id={`model-upload-${index}`}
                  />
                  <br></br>
                  <label
                    htmlFor={`model-upload-${index}`}
                    className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md cursor-pointer hover:opacity-80 transition duration-300 ease-in-out"
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" /> Select Model
                  </label>
                  {pair.model && <p className="text-gray-600 mt-2">Model: {pair.model.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold">Upload Image {index + 1}</label>
                  <input
                    required
                    type="file"
                    onChange={(e) => handleImageChange(index, e)}
                    className="hidden"
                    id={`image-upload-${index}`}
                  />
                  <br></br>
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md cursor-pointer hover:opacity-80 transition duration-300 ease-in-out"
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" /> Select Image
                  </label>
                  {pair.image && <p className="text-gray-600 mt-2">Image: {pair.image.name}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {modelImagePairs.length < 5 && (
          <button
            onClick={handleAddPair}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 w-full rounded-md focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105"
          >
            <FontAwesomeIcon icon={faAdd} className="mr-2" />
            Add Model-Image Pair
          </button>
        )}

        <button
          onClick={handleUpload}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 w-full rounded-md focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105"
        >
          Upload
        </button>
      </div>

      {/* Progress dialog */}
      {uploading && (
        <div className="fixed inset-0 bg-gray-800 opacity-75 flex justify-center items-center z-50">
          <div className="text-white text-lg font-bold"> <FontAwesomeIcon icon={faUpload} /> Uploading...</div>
        </div>
      )}
    </div>
  );
};

export default UploadDetails;
