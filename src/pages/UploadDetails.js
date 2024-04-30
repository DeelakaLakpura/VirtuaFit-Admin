// UploadDetails.js
import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

const UploadDetails = () => {
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productHTMLContent, setProductHTMLContent] = useState('');
    const [images, setImages] = useState([]);
    const [models, setModels] = useState([]);

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleModelChange = (e) => {
        setModels(e.target.files);
    };

    const handleUpload = async () => {
        const storageRef = firebase.storage().ref();
        const imagesRef = storageRef.child('images');
        const modelsRef = storageRef.child('models');

        const imageUploadPromises = Array.from(images).map(async (image) => {
            const imageRef = imagesRef.child(image.name);
            await imageRef.put(image);
            return imageRef.getDownloadURL();
        });

        const modelUploadPromises = Array.from(models).map(async (model) => {
            const modelRef = modelsRef.child(model.name);
            await modelRef.put(model);
            return modelRef.getDownloadURL();
        });

        try {
            const imageUrls = await Promise.all(imageUploadPromises);
            const modelUrls = await Promise.all(modelUploadPromises);

            const details = {
                productName,
                productCategory,
                productDescription,
                productHTMLContent, // Include HTML content
                images: imageUrls,
                models: modelUrls
            };

            firebase.database().ref('products').push(details);
            Swal.fire('Success!', 'Product Added successful', 'success');
        } catch (error) {
            console.error("Error uploading:", error);
            Swal.fire('Error!', 'Error uploading. Please try again later.', 'error');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-4 text-center">Upload Product Details</h1>
            <div className="space-y-4">
                <div className="relative">
                    <input required type="text" placeholder="Product Name" className="input-field pl-10 b-1 py-2 rounded-sm border border-gray-300 w-full" onChange={(e) => setProductName(e.target.value)} />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                </div>
                <div className="relative">
                    <select required className="input-field pl-10 pr-4 py-2 rounded-sm border  text-gray-400 border-gray-300 w-full" onChange={(e) => setProductCategory(e.target.value)}>
                        <option value="">Select Product Category</option>
                        <option value="Sofa">Sofa</option>
                        <option value="Chair">Chair</option>
                        <option value="Tables">Tables</option>
                        {/* Add more options as needed */}
                    </select>
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <FontAwesomeIcon icon={faList} />
                    </span>
                </div>
                <textarea placeholder="Product Description" className="input-field resize-none b-1 py-2 rounded-sm border border-gray-300 w-full p-2 h-24" onChange={(e) => setProductDescription(e.target.value)} />
                <textarea placeholder="Product HTML Content" className="input-field resize-none b-1 py-2 rounded-sm border border-gray-300 w-full p-2 h-24" onChange={(e) => setProductHTMLContent(e.target.value)} />
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-bold">Upload Images</label>
                    <input required type="file" multiple onChange={handleImageChange} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out">
                        <FontAwesomeIcon icon={faUpload} className="mr-2" /> Select Images
                    </label>
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-bold">Upload Models</label>
                    <input type="file" multiple onChange={handleModelChange} className="hidden" id="model-upload" />
                    <label htmlFor="model-upload" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out">
                        <FontAwesomeIcon icon={faUpload} className="mr-2" /> Select Models
                    </label>
                </div>
                <button onClick={handleUpload} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 w-50 rounded focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105">
                    Upload
                </button>
            </div>
        </div>
    );
};

export default UploadDetails;
