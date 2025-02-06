import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoCloseCircleSharp } from 'react-icons/io5';
import { jwtDecode } from 'jwt-decode';


const BeachSearch = () => {
  const [beaches, setBeaches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeaches, setFilteredBeaches] = useState([]);
  const [beachError, setBeachError] = useState("");
  const navigate = useNavigate();

  // Carregar lista de praias no início
  useEffect(() => {
    const token = localStorage.getItem('authToken');
        if (!token || !(jwtDecode(token).role === "ADMIN")) {
            navigate('/home');
        }
    const fetchBeaches = async () => {
      try {
        const response = await axios.get("http://localhost:8080/apiV1/beaches");
        setBeaches(response.data.data);
        setFilteredBeaches(response.data.data);  // Inicializa as praias filtradas com todas as praias
      } catch (error) {
        console.error("Error fetching beaches:", error);
      }
    };


    fetchBeaches();
  }, []);

  // Filtrar as praias com base na pesquisa
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredBeaches(beaches); // Exibe todas as praias quando a pesquisa está vazia
    } else {
      const filtered = beaches.filter(beach =>
        beach.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBeaches(filtered); // Atualiza as praias filtradas
    }
  }, [searchQuery, beaches]);

  // Navegar para a página da praia selecionada pelo cartão
  const handleCardClick = (beach) => {
    navigate(`/sensors/${beach.beachId}`, { state: { selectedBeach: beach } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container mx-auto pt-32">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#003366" }}>
          Search for a Beach
        </h1>

        <div className="flex items-center py-4">
  <input
    type="text"
    placeholder="Search for a beach..."
    className="block w-full sm:w-1/4 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  {searchQuery && (
    <button
      onClick={() => setSearchQuery('')}
      className="absolute right-0 top-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
    >
      <IoCloseCircleSharp size={24} />
    </button>
  )}
</div>



        {beachError && <p className="text-red-500 mt-2">{beachError}</p>}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {filteredBeaches.length > 0 ? (
            filteredBeaches.map((beach) => (
              <div
                key={beach.beachId}
                className="transform transition-transform hover:scale-105"
              >
                <div
                  onClick={() => handleCardClick(beach)} // Clique apenas no card
                  className="cursor-pointer max-w-sm bg-white border border-gray-200 rounded-lg shadow"
                >
                  <img
                    className="w-full h-48 object-cover rounded-t-lg"
                    src={beach.image_url}
                    alt={beach.name}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900">{beach.name}</h3>
                    <p className="mt-2 text-gray-600">{beach.description || "Description coming soon..."}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No beaches found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeachSearch;
