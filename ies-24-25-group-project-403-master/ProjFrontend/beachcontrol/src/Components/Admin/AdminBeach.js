import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'flowbite-react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function AddBeach() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [city, setCity] = useState('');
  const [beaches, setBeaches] = useState([]);
  const [filteredBeaches, setFilteredBeaches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedBeach, setSelectedBeach] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [searchBeach, setSearchBeach] = useState('');
  const [beachError, setBeachError] = useState('');

  const handleSetName = (value) => setName(value);
  const handleSetDescription = (value) => setDescription(value);
  const handleSetLatitude = (value) => setLatitude(value);
  const handleSetLongitude = (value) => setLongitude(value);
  const handleSetImageUrl = (value) => setImageUrl(value);
  const handleSetCity = (value) => setCity(value);
  const handleSetSearchBeach = (value) => {
    setSearchBeach(value);
    setBeachError('');
  };

  const navigate = useNavigate();

  const fetchBeaches = async () => {
    try {
      const response = await axios.get('http://localhost:8080/apiV1/beaches');
      console.log('Beaches:', response.data.data);
      setBeaches(response.data.data);
    } catch (error) {
      console.error('Error fetching beaches:', error);
    }
  };



  useEffect(() => {

    const token = localStorage.getItem('authToken');
        if (!token || !(jwtDecode(token).role === "ADMIN")) {
            navigate('/home');
        }

    if (searchBeach.length >= 3) {
      setFilteredBeaches(
        beaches.filter((beach) =>
          beach.name.toLowerCase().includes(searchBeach.toLowerCase())
        )
      );
    } else {
      setFilteredBeaches(beaches);
    }
  }, [searchBeach, beaches]);


  useEffect(() => {
    fetchBeaches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let beachData;

    const token = localStorage.getItem('authToken');
    try {
      if (isUpdateMode) {
        beachData = {
          name: name,
          description: description,
          location: {
            latitude: latitude,
            longitude: longitude,
            city: city,
          },
          image_url: imageUrl,
          beachmetric: selectedBeach.beachmetric,
          warnings: selectedBeach.warnings,
          flag: selectedBeach.flag,
        };
        
        const response = await axios.put(
          `http://localhost:8080/apiV1/admin/beach/${selectedBeach.beachId}`, 
          beachData, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.status === 200) {
          
        } 
      } else {
        beachData = {
          name,
          description,
          location: {
            latitude: latitude || null,
            longitude: longitude || null,
            city: city || null,
          },
          image_url: imageUrl || null,
          beachmetric: [],
          warnings: [],
          flag: "RED",
        };
        const response = await axios.post(
          'http://localhost:8080/apiV1/admin/beach/create', 
          beachData, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.status === 200) {
          toast.success('Beach created successfully!');               
          fetchBeaches();                                   
        }
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create beach.');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setLatitude('');
    setLongitude('');
    setImageUrl('');
    setCity('');
    setIsUpdateMode(false);
    setSelectedBeach(null);
  };

  const handleUpdateBeach = (beach) => {
    setIsUpdateMode(true);
    setSelectedBeach(beach);
    setName(beach.name);
    setDescription(beach.description || '');
    setLatitude(beach.location.latitude);
    setLongitude(beach.location.longitude);
    setImageUrl(beach.image_url);
    setCity(beach.location.city);
  };

  const handleDeleteBeach = async (beachId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/apiV1/admin/beach/${beachId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Beach deleted successfully!');
      fetchBeaches();
      setIsConfirmationModalOpen(false);
    } catch (error) {
      console.error('Error deleting beach:', error);
      toast.error('Failed to delete beach. Please try again.');
    }
  };

  const confirmDeleteBeach = (beach) => {
    setSelectedBeach(beach);
    setIsConfirmationModalOpen(true);
  };

  const handleShowDetails = (beach) => {
    setSelectedBeach(beach);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBeach(null);
  };


  return (
    <><ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} transition={Bounce}/>
    <div className="min-h-screen flex flex-col items-center pt-40 relative">
      {/* Title Section */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Beach Management
      </h1>

      {/* Main content container */}
      <div className="flex w-full max-w-7xl relative">
        {/* Form Section */}
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 py-1 border border-black w-full max-w-2xl mr-10 z-10" style={{ height: 'calc(66vh)' }}>
          <form className="max-w-sm mx-auto py-10" onSubmit={handleSubmit}>
            {/* Beach Name Input */}
            <div className="mb-5">
              <label
                htmlFor="Beach_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Beach Name
              </label>
              <input
                id="Beach_name"
                value={name}
                onChange={(e) => handleSetName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Beach Name"
                required />
            </div>

            {/* Description Input */}
            <div className="mb-5">
              <label
                htmlFor="Beach_description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description (optional)
              </label>
              <textarea
                id="Beach_description"
                rows="4"
                value={description}
                onChange={(e) => handleSetDescription(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Leave a description about the beach..." />
            </div>

            {/* Latitude and Longitude Inputs */}
            <div className="mb-5 flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="Beach_latitude"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Latitude
                </label>
                <input
                  id="Beach_latitude"
                  value={latitude}
                  onChange={(e) => handleSetLatitude(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Latitude"
                  required />
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="Beach_longitude"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Longitude
                </label>
                <input
                  id="Beach_longitude"
                  value={longitude}
                  onChange={(e) => handleSetLongitude(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Longitude"
                  required />
              </div>
            </div>

            {/* City Input */}
            <div className="mb-5">
              <label
                htmlFor="Beach_city"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                City
              </label>
              <input
                id="Beach_city"
                value={city}
                onChange={(e) => handleSetCity(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="City"
                required />
            </div>

            {/* Image URL Input */}
            <div className="mb-5">
              <label
                htmlFor="Beach_image_url"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Image URL (optional)
              </label>
              <input
                id="Beach_image_url"
                value={imageUrl}
                onChange={(e) => handleSetImageUrl(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Image URL" />
            </div>

            {/* Submit Button */}
            <div className="mb-5 flex justify-center space-x-4">
              {isUpdateMode ? (
                <>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                  >
                    Update Beach
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                >
                  Create Beach
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Beach List Section */}
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 py-1 border border-black w-full max-w-2xl z-10" style={{ height: 'calc(66vh)' }}>
        <div className="p-4">
          <input
            type="text"
            value={searchBeach}
            onChange={(e) => handleSetSearchBeach(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Search beaches by name"
          />
        </div>
              {searchBeach.length >= 3 && filteredBeaches.length === 0 ? (
        <p className="text-center text-gray-500 mt-5">No beaches found matching your search.</p>
      ) : (
        <ul className="space-y-4 p-5">
          {filteredBeaches.map((beach) => (
            <li key={beach._id} className="flex justify-between items-center">
              <div>
                <strong>{beach.name}</strong>
                <div className="text-sm text-gray-500">{beach.location.city}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateBeach(beach)}
                  className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg transition-all"
                  title="Update Beach"
                >
                  ✏️
                </button>
                <button
                  onClick={() => confirmDeleteBeach(beach)}
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                  title="Delete Beach"
                >
                  🗑️
                </button>
                <button
                  onClick={() => handleShowDetails(beach)}
                  className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                  title="View Details"
                >
                  👁️
                </button>
              </div>
            </li>
          ))}
        </ul>)}
      </div>
      </div>



      <Modal show={isConfirmationModalOpen} onClose={() => setIsConfirmationModalOpen(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the beach "{selectedBeach?.name}"?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => setIsConfirmationModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteBeach(selectedBeach.beachId)}
              className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>{selectedBeach?.name}</Modal.Header>
        <Modal.Body>
          <p><strong>Description: </strong> {selectedBeach?.description || 'No description available.'}</p>
          <p><strong>City: </strong> {selectedBeach?.location?.city}</p>
          {selectedBeach?.image_url && <img src={selectedBeach.image_url} alt={selectedBeach.name} />}
        </Modal.Body>
      </Modal>
    </div></>
  );
  
}
