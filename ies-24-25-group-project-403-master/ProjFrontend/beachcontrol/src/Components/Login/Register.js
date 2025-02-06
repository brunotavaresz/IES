import React, { useState } from 'react';
import 'flowbite';
import registerImage from '../../Images/Register.png'; 
import Logo from '../../Images/Logo.png';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Ícones para mostrar/ocultar senha

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // Para mostrar/ocultar a senha
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Para mostrar/ocultar a confirmação de senha
  const navigate = useNavigate();

  const handleSetName = (value) => setName(value);
  const handleSetEmail = (value) =>{
    localStorage.setItem("userEmail", value || ""); 
    const parts = value.split("@");
    localStorage.setItem("userName", parts[0] || ""); 
    setEmail(value);
  };
  const handleSetPassword = (value) => setPassword(value);
  const handleSetConfirmPassword = (value) => setConfirmPassword(value);
  const handleSetAgreeTerms = (value) => setAgreeTerms(value);

  const getName = () => name;
  const getEmail = () => email;
  const getPassword = () => password;
  const getConfirmPassword = () => confirmPassword;
  const getAgreeTerms = () => agreeTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!getAgreeTerms()) {
      alert("Você deve concordar com os termos e políticas");
      return;
    }

    if (getPassword() !== getConfirmPassword()) {
      alert("As senhas não correspondem");
      return;
    }

    try {
      console.log("Nome:", getName());
      console.log("Email:", getEmail());

      const response = await fetch('http://localhost:8080/apiV1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: getName(),
          email: getEmail(),
          password: getPassword(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error signing up. Please try again.');
      }

      const data = await response.json();
      console.log('Registration response:', data);

      if (data.jwt) {
        localStorage.setItem("authToken", data.jwt);
        localStorage.setItem("isLoggedIn", "true"); // Update login status
        window.dispatchEvent(new Event("storage")); // Trigger the storage event

        if (jwtDecode(data.jwt).role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate('/home');
        }
      } else {
        throw new Error('Token not found in the API response.');
      }
    } catch (error) {
      console.error("Erro ao fazer o registro:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:block w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${registerImage})` }}>
        <div className="absolute top-10 left-10 z-10"></div>
      </div>   
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 bg-white">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Get Started Now</h2>
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Enter your name" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => handleSetName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email address</label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <input 
                type={passwordVisible ? "text" : "password"} 
                id="password" 
                placeholder="Enter your password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => handleSetPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setPasswordVisible(!passwordVisible)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {passwordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <input 
                type={confirmPasswordVisible ? "text" : "password"} 
                id="confirmPassword" 
                placeholder="Confirm your password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => handleSetConfirmPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {confirmPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <input 
              type="checkbox" 
              id="terms" 
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={agreeTerms}
              onChange={(e) => handleSetAgreeTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">I agree to the <a className="text-blue-600 underline hover:text-blue-800" target='blank' href='/terms'>terms & conditions</a> </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Sign up
          </button>
        </form>
        
        <p className="text-gray-600 mt-4">
          Have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
