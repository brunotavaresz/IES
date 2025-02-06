import BeachCard from "./BeachCard";
import HomepageImage from "./../../Images/Homepage.png";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { IoCloseCircleSharp } from 'react-icons/io5'; // Ícone de fechar

// Utility function to get user role from JWT
const getUserRole = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return 'USER';
    const decoded = jwtDecode(token);
    return decoded.role?.toUpperCase() || 'USER';
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return 'USER';
  }
};

// Create axios instance with auth interceptor
const axiosWithAuth = axios.create();
axiosWithAuth.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Home() {
  const navigate = useNavigate();
  const [beaches, setBeaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(getUserRole());
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBeaches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosWithAuth.get('http://localhost:8080/apiV1/beaches');
      console.log(response);
      setBeaches(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch beaches');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeaches();
  }, [navigate]);

  // Update role if token changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(getUserRole());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const renderBeaches = () => {
    if (loading) {
      return <p className="text-white text-xl">Loading beaches...</p>;
    }

    if (error) {
      return (
        <div className="text-white text-center">
          <p className="text-xl mb-4">Failed to load beaches</p>
          <button
            onClick={fetchBeaches}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!beaches.length) {
      return <p className="text-white text-xl">No beaches available</p>;
    }

    // Filtra todas as praias com base na pesquisa (não limitado a 3 praias)
    const filteredBeaches = beaches.filter(beach =>
      beach.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Limitar a exibição a no máximo 3 praias após filtrar
    const beachesToDisplay = filteredBeaches.slice(0, 3);

    return beachesToDisplay.map((beach) => (
      <div
        key={beach.beachId}
        className="cursor-pointer transform transition-transform hover:scale-105"
      >
        <BeachCard
          name={beach.name}
          description={beach.description || "Description coming soon..."}
          image={beach.image_url}
          beachId={beach.beachId}
        />
      </div>
    ));
  };

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    setSearchQuery(''); // Clear search when toggling search
  };

  return (
    <div className="w-full min-h-screen">
      <section
        className="bg-no-repeat bg-gray-400 bg-blend-multiply w-full min-h-screen"
        style={{
          backgroundImage: `url(${HomepageImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="px-4 mx-auto max-w-screen-xl text-center pt-40">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            BeachControl
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48 py-4">
            Find Information on the condition of various beaches
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 py-4">
            {!isSearchActive ? (
              <button
                type="button"
                onClick={handleSearchToggle}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-300 focus:ring-4 shadow-lg focus:ring-gray-100 font-medium rounded-lg text-m px-10 py-2 me-2 mb-2"
              >
                Find your beach
              </button>
            ) : (
              <div
                className={`relative w-full sm:w-1/2 transition-all duration-700 ease-in-out transform ${isSearchActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'}`} // Animação mais visível
              >
                <input
                  type="text"
                  placeholder="Search for a beach..."
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={handleSearchToggle}
                  className="absolute right-0 top-0 mt-2 mr-2 text-gray-500 hover:text-gray-700 transition-all transform scale-110 hover:scale-125"
                >
                  <IoCloseCircleSharp size={24} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 flex justify-center pt-20 gap-8 flex-wrap">
          {renderBeaches()}
        </div>

        <div className="py-20"></div>
      </section>
    </div>
  );
}
