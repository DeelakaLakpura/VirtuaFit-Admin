import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload,faTrash, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { getDatabase, ref as databaseRef, set, remove } from 'firebase/database';


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUvw7F48wXGNNJa_NO58Xru8ucWDjuRzc",
  authDomain: "vfit-8e85e.firebaseapp.com",
  databaseURL: "https://vfit-8e85e-default-rtdb.firebaseio.com",
  projectId: "vfit-8e85e",
  storageBucket: "vfit-8e85e.appspot.com",
  messagingSenderId: "185468595314",
  appId: "1:185468595314:web:50ac7436877a2f716c66eb"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);


const sanitizeFilename = (filename) => {
  return filename.replace(/[.#$/[\]]/g, '_');
};

const EnhancedImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [storedImages, setStoredImages] = useState([]);
  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };

  const handleFileRemove = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  
  const handleUpload = () => {
    setUploadProgress(0);

    selectedFiles.forEach((file) => {
      const sanitizedFilename = sanitizeFilename(file.name);
      const storageReference = storageRef(storage, `posts/${sanitizedFilename}`);
      const uploadTask = uploadBytesResumable(storageReference, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const imageDatabaseRef = databaseRef(database, `posts/${sanitizedFilename}`);
            set(imageDatabaseRef, {
              url: downloadURL,
            });
            console.log('File available at', downloadURL);
            
          });
        }
      );
    });
  };

  const handleDelete = async (filename) => {
    const storageReference = storageRef(storage, `posts/${filename}`);
    try {
      await deleteObject(storageReference);
      // Also remove from database
      const imageDatabaseRef = databaseRef(database, `posts/${filename}`);
      await remove(imageDatabaseRef);
      // Update stored images list
      setStoredImages(prevImages => prevImages.filter(image => image.name !== filename));
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Upload Images</h2>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300"
        >
          <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-2" size="2x" />
          <span className="text-gray-600">Drag & drop or click to upload</span>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="uploaded"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 right-0 m-2 text-red-600 cursor-pointer"
                    onClick={() => handleFileRemove(index)}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={handleUpload}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Upload
            </button>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${
                  uploadProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              />
            </div>
            {uploadProgress === 100 && (
              <div className="flex items-center justify-center mt-4 text-green-500">
                <FontAwesomeIcon icon={faCheckCircle} size="lg" className="mr-2" />
                <span>Upload Complete!</span>
              </div>
            )}
         
          </div>
        )}
        
      </motion.div>

      
    </div>
  );
};

export default EnhancedImageUpload;
