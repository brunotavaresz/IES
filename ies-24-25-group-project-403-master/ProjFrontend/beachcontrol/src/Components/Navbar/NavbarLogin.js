import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from './../../Images/PersonIcon.png';
import zezinho from './../../Images/zezinho.jpeg';
import { useEffect } from 'react';

export default function NavbarLogin({ name, email }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('#user-menu-button') && !event.target.closest('#user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.setItem("isLoggedIn", "false");
    window.dispatchEvent(new Event("storage"));
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse px-20 relative">
      <button
        type="button"
        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded={isDropdownOpen}
        onClick={toggleDropdown}
      >
        <span className="sr-only">Open user menu</span>
        <img className="w-8 h-8 rounded-full" src={zezinho} alt="user photo" />
      </button>

      {isDropdownOpen && (
        <div className="z-50 absolute top-full mt-2 right-0 text-base list-none rounded-lg shadow bg-gray-300 w-72">
          <div className="px-10 py-3">
            <span className="block text-m text-gray-900 dark:text-white">{name}</span>
            <span className="block text-m text-gray-500 truncate bg-gray-300 py-2">{email}</span>
          </div>
          <ul className="py-2" aria-labelledby="user-menu-button">
            <li>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 bg-gray-300"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
