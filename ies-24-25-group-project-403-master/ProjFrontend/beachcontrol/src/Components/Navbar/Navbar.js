import React, { useState, useEffect } from 'react';
import Logo from '../../Images/Logo.png';
import 'flowbite';
import NavbarLogedout from './NavbarLogedout';
import NavbarLogin from './NavbarLogin';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [beaches, setBeaches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  // Check for login status on initial render and on 'storage' event
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
    };

    // Initial check
    checkLoginStatus();

    // Listen for changes in localStorage
    window.addEventListener('storage', checkLoginStatus);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Fetch user data only if logged in
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            setIsLoggedIn(false);
            return;
          }

          const decoded = jwtDecode(token);
          localStorage.setItem('userRole', decoded.role);
          const email = decoded.sub;

          // Set user role
          setUserRole(decoded.role);

          const response = await axios.get(`http://localhost:8080/apiV1/users?email=${email}`);
          const user = response.data.data[0];
          if (user) {
            setUserData(user);
            if (userRole === 'USER') {
            const favoritesResponse = await axios.get(`http://localhost:8080/apiV1/users/favorites/${user.userid}`);
            setFavorites(favoritesResponse.data);

            if (favoritesResponse.data.length > 0) {
              const beachResponses = await Promise.all(
                favoritesResponse.data.map((beachId) =>
                  axios.get(`http://localhost:8080/apiV1/beaches?id=${beachId}`)
                )
              );
              const fetchedBeaches = beachResponses.map(response => response.data.data[0]).filter(Boolean);
              setBeaches(fetchedBeaches);
            }}
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUser();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/login');
  };

  const handleModalToggle = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  return (
    <nav className="border bg-white fixed w-full z-10 top-0 start-0 bg-no-repeat">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={Logo} className="h-8" alt="Logo" />
        </a>

        {isLoggedIn ? (
          <NavbarLogin name={userData?.name} email={userData?.email} onLogout={handleLogout} />
        ) : (
          <NavbarLogedout />
        )}

        {isLoggedIn && (
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-gray-200">
              {userRole === 'USER' && (
                <>
                  <li>
                    <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                      Database
                    </a>
                  </li>
                  <li>
                    <button
                      className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                      onClick={handleModalToggle}
                    >
                      Favoritos
                    </button>
                  </li>
                  <li>
                    <a href="/about-us" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About Us</a>
                  </li>
                </>
              )}

              {userRole === 'ADMIN' && (
                <li>
                  <a
                    href="/admin"
                    className="block py-2 px-4 text-gray-600 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-800 shadow-sm"
                  >
                    Admin Page
                  </a>
                </li>
              )}


            </ul>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded shadow-lg p-4 w-1/3">
            <h2 className="text-xl font-bold mb-4">Your Favorite Beaches</h2>
            {beaches.length > 0 ? (
              <ul>
                {beaches.map((beach, index) => (
                  <li key={index} className="py-2">
                    <a href={`/beach-conditions/${beach.beachId}`} className="text-blue-500 hover:underline">
                      {beach.name}, {beach.location.city}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no favorite beaches.</p>
            )}
            <button className="mt-4 bg-gray-800 text-white py-1 px-3 rounded hover:bg-gray-600" onClick={handleModalToggle}>
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
