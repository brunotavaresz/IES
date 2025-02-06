import React, { useState } from 'react';
import 'flowbite';
import loginImage from "../../Images/Login.png";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Ícones para mostrar/ocultar senha

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSetEmail = (value) => {
    localStorage.setItem("userEmail", value || ""); // Armazena o e-mail no localStorage
    const parts = value.split("@");
    localStorage.setItem("userName", parts[0] || ""); // Armazena o nome no localStorage
    setEmail(value);
  };

  const handleSetPassword = (value) => setPassword(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/apiV1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials. Please try again.");
      }

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem("authToken", data.jwt);
        localStorage.setItem("isLoggedIn", "true"); // Atualiza o status de login
        window.dispatchEvent(new Event("storage")); // Dispara o evento storage

        if (jwtDecode(data.jwt).role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        throw new Error("Token not found in the API response.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome back!</h2>
        <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>

        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Exibe o erro, se houver */}

        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email address
            </label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => handleSetEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                placeholder="Enter your password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => handleSetPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-gray-600 mt-4">
          Don’t have an account? <a href="/register " className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>

      <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }}>
        {/* Imagem de fundo aplicada via CSS inline */}
      </div>
    </div>
  );
}

export default Login;
