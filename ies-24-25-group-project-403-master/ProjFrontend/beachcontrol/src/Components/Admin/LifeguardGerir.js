import React, { useState, useEffect } from 'react';
import { TextInput, Button } from 'flowbite-react';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const LifeguardGerir = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [filteredLifeguards, setFilteredLifeguards] = useState([]);
    const [searchLifeguard, setSearchLifeguard] = useState("");
    const [beachName, setBeachName] = useState('');
    const [allBeaches, setAllBeaches] = useState([]);
    const [filteredBeaches, setFilteredBeaches] = useState([]);
    const [selectedBeach, setSelectedBeach] = useState(null);
    const [selectedBeachImage, setSelectedBeachImage] = useState('');
    const [showBeachSuggestions, setShowBeachSuggestions] = useState(false);

    const [lifeguards, setLifeguards] = useState([]);
    const [selectedLifeguard, setSelectedLifeguard] = useState(null);
    const [lifeguardError, setLifeguardError] = useState('');
    const handleSetLifeGuardSearch = (value) => {
        setSearchLifeguard(value);
        setLifeguardError("");
    };
    const navigate = useNavigate();
    useEffect(() => {
            const token = localStorage.getItem('authToken');
            if (!token || !(jwtDecode(token).role === "ADMIN")) {
                navigate('/home');
            }

        if (searchLifeguard.length >= 3) {
          setFilteredLifeguards(
            lifeguards.filter((lifeguard) =>
              lifeguard.name.toLowerCase().includes(searchLifeguard.toLowerCase())
            )
          );
        } else {
          setFilteredLifeguards(lifeguards);
        }
      }, [searchLifeguard, lifeguards]);
    
    useEffect(() => {
        const fetchAllBeaches = async () => {
            try {
                const response = await fetch('http://localhost:8080/apiV1/beaches');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();
                if (responseData.data) {
                    setAllBeaches(responseData.data);
                }
            } catch (error) {
                console.error('Error fetching beaches:', error);
                setError('Failed to load beaches: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllBeaches();
    }, []);
    const fetchLifeguards = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No JWT token found');

            const response = await fetch('http://localhost:8080/apiV1/admin/lifeguards', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch lifeguards');
            }

            const responseData = await response.json();
            if (responseData.status === 'OK' && Array.isArray(responseData.data)) {
                setLifeguards(responseData.data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching lifeguards:', error);
            setError('Failed to load lifeguards: ' + error.message);
        }
    };

    useEffect(() => {
        

        fetchLifeguards();
    }, []);

    useEffect(() => {
        if (beachName.length < 2) {
            setFilteredBeaches([]);
            setShowBeachSuggestions(false);
            return;
        }

        if (!selectedBeach) {
            const filtered = allBeaches.filter(beach =>
                beach.name.toLowerCase().includes(beachName.toLowerCase()) ||
                beach.location.city.toLowerCase().includes(beachName.toLowerCase())
            );
            setFilteredBeaches(filtered);
            setShowBeachSuggestions(true);
        }
    }, [beachName, allBeaches, selectedBeach]);

    const handleCancelEdit = () => {
        setSelectedLifeguard(null);
        setEmail('');
        setName('');
        setPassword('');
        setSelectedBeach(null);
        setBeachName('');
        setIsEditing(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.suggestions-container')) {
                setShowBeachSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleBeachSelect = (beach) => {
        setBeachName(`${beach.name}, ${beach.location.city}`);
        setSelectedBeach(beach);
        setSelectedBeachImage(beach.image_url || '');
        setFilteredBeaches([]);
        setShowBeachSuggestions(false);
    };

    const handleEditClick = (lifeguard) => {
        setSelectedLifeguard(lifeguard);
        setEmail(lifeguard.email);
        setName(lifeguard.name);
        setPassword(''); // Clear password field
        setSelectedBeach(null);
        setIsEditing(true);
        setBeachName('');
        console.log('Selected lifeguard:', lifeguard);
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional for a smooth scroll
        });
        setSearchLifeguard("");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if all required fields are filled
        if (!email || !name || (!isEditing && !password)) {
            setError('Please fill out all fields before submitting');
            return;
        }
    
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No JWT token found');
    
            let response;
    
            if (selectedLifeguard) {
                // If editing existing lifeguard, call the endpoint to update the assigned beach
                if (isEditing) {
                    const beachId = selectedBeach ? selectedBeach.beachId : '0'; // Send '0' if no beach is selected
                    response = await fetch(`http://localhost:8080/apiV1/admin/${selectedLifeguard.userid}/editAssignedBeach/${beachId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to update assigned beach');
                    }
    
                    toast.success('Assigned beach updated successfully!');
                    setEmail('');
                    setName('');
                    setPassword('');
                    setSelectedBeach(null);
                    setBeachName('');
                    setSelectedLifeguard(null);
                    setError(''); // Clear any previous errors
                    fetchLifeguards();
                    setIsEditing(false);
                    return; // Exit the function after the beach update
                }
    
                // Edit existing lifeguard (not updating the beach)
                response = await fetch(`http://localhost:8080/apiV1/admin/${selectedLifeguard.userid}/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                });
            } else {
                // Create new lifeguard
                const requestBody = {
                    role: 'lifeguard',
                    name,
                    email,
                    password,
                };
                let url = 'http://localhost:8080/apiV1/auth/register';
    
                // Add selectedBeach to the request if it exists
                if (selectedBeach) {
                    console.log('Selected beach:', selectedBeach);
                    url += `?selectedBeach=${selectedBeach.beachId}`;
                }
                console.log('Request body:', requestBody);
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody),
                });
    
                if (response.status === 409) {
                    toast.error('Email already in use');
                }
            }
    
            if (!response.ok) {
                const errorData = await response.json();
               toast.error(errorData.message || 'An error occurred while submitting');
            }
    
            if (selectedLifeguard) {
                toast.success('Lifeguard updated successfully!');
            } else {
                toast.success('Lifeguard created successfully!');
            }
    
            // Reset form fields
            setEmail('');
            setName('');
            setPassword('');
            setSelectedBeach(null);
            setBeachName('');
            setSelectedLifeguard(null);
            setError(''); // Clear any previous errors
            fetchLifeguards();
        } catch (error) {
            toast.error(error.message || 'An error occurred while submitting');
        }
    };
    
    

    

    return (
            
        <div className="max-w-6xl mx-auto mt-24 p-6">
            <ToastContainer position="top-right" autoClose={5000} transition={Bounce} />
            <h2 className="text-2xl font-semibold text-center text-[#003366] mb-8">
                {selectedLifeguard ? 'Edit Lifeguard' : 'Create Lifeguard and Assign to Beach'}
            </h2>

            {error && (
                <p className="text-red-500 text-center mb-6">{error}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Information */}
                <div
                    className="bg-white rounded-xl shadow-lg border-2 border-opacity-20 p-6  md:col-span-1"
                >
                    <h3 className="text-lg font-medium text-[#003366] mb-4">
                        User Information
                    </h3>

                    <div className="mb-4">
                        <TextInput
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                            className="w-full"
                            readOnly={isEditing}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <TextInput
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="w-full"
                            readOnly={isEditing}
                            required
                        />
                    </div>

                    {!isEditing && (
                        <div className="mb-4">
                            <TextInput
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full"
                                required
                            />
                        </div>
                    )}
                </div>

                {/* Beach Assignment */}
                
                    <div className="bg-white rounded-xl shadow-lg border-2 border-opacity-20 p-6">
                        <h3 className="text-lg font-medium text-[#003366] mb-4">
                            Beach Assignment
                        </h3>

                        <div className="relative mb-4 suggestions-container">
                            <TextInput
                                id="beachName"
                                type="text"
                                value={beachName}
                                onChange={(e) => setBeachName(e.target.value)}
                                onFocus={() => !selectedBeach && beachName.length >= 2 && setShowBeachSuggestions(true)}
                                placeholder="Start typing a beach name..."
                                className="w-full"
                            />

                            {showBeachSuggestions && filteredBeaches.length > 0 && (
                                <div className="absolute w-full z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                                    <ul className="py-1">
                                        {filteredBeaches.map((beach) => (
                                            <li
                                                key={beach.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleBeachSelect(beach)}
                                            >
                                                <span className="font-medium">{beach.name}, {beach.location.city}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {selectedBeach && (
                            <div className="mb-4">
                                <img
                                    src={selectedBeachImage}
                                    alt={`Image of selected beach`}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        )}
                    </div>
                
            </div>



            {/* Form Section */}
            <form onSubmit={handleSubmit} className="mt-8 col-span-full">
                <div className="flex justify-center mt-8 space-x-4">
                    {isEditing ? (
                        <>
                            <Button
                                type="submit"
                                disabled={!email || !name}
                                className="bg-[#003366] hover:bg-[#002244] px-4 py-2"
                                onClick={handleSubmit}
                            >
                                Update Lifeguard
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                            >
                                Cancel Edit
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isSubmitting || !email || !name || !password}
                            className="bg-[#003366] hover:bg-[#002244] px-4 py-2"
                        >
                            {isSubmitting ? 'Submitting...' : 'Create and Assign'}
                        </Button>
                    )}
                </div>
            </form>

            {/* Display Lifeguards */}
            <div className="mt-8" style={{ maxHeight: '100%', overflowY: 'auto', paddingBottom: '3rem' }}>
                <h3 className="text-lg font-medium text-[#003366] mb-4">Lifeguards List</h3>
            <div className="p-4">
        <input
            type="text"
            value={searchLifeguard}
            onChange={(e) => handleSetLifeGuardSearch(e.target.value)}
            className="w-64 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Search lifeguards by name"
        />
    </div>
    {filteredLifeguards.length > 0 ? (
        <ul className="space-y-2">
            {filteredLifeguards.map((lifeguard) => {
                const assignedBeach = allBeaches.find(beach => beach.beachId === lifeguard.assigned_beach);
                return (
                    <li key={lifeguard.userid} className="p-4 border border-gray-200 rounded-lg shadow-md">
                        <p className="font-medium">Name: {lifeguard.name}</p>
                        <p>Email: {lifeguard.email}</p>
                        <p>Role: {lifeguard.role}</p>
                        <p>Assigned Beach: {assignedBeach ? `${assignedBeach.name}` : 'Not assigned'}</p>
                        <Button
                            onClick={() => handleEditClick(lifeguard)}
                            className="mt-2 bg-[#003366] hover:bg-[#002244]"
                        >
                            Assign to a different beach
                        </Button>
                    </li>
                );
            })}
        </ul>
    ) : (
        <p>No lifeguards match your search.</p>
    )}

        </div>
    </div>
    );
};

export default LifeguardGerir;
