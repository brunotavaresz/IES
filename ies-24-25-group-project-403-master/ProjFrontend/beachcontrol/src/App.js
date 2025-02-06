import React from 'react';
import './App.css';
import BeachConditions from './Components/BeachConditions/BeachConditions';
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import Register from './Components/Login/Register';
import AdminPage from './Components/Admin/AdminPage';
import LifeguardGerir from './Components/Admin/LifeguardGerir';
import AdminReports from './Components/Admin/AdminReports';
import Lifeguard from './Components/Lifeguard/BeachConditionsLifeguard'
import AdminBeach from './Components/Admin/AdminBeach';
import AdminSensor from './Components/Admin/AdminSensor';
import AboutUs from './Components/Documentation/AboutUs';
import Terms from './Components/Documentation/Terms';
import BeachSearch from './Components/Admin/BeachSearch';
import SensorManager from './Components/Admin/SensorManager';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rota principal (início) */}
        <Route path="/" element={<Home />} />
        {/* Outras rotas */}
        <Route path="/home" element={<Home />} />
        <Route path="/beach-conditions/:beachId" element={<BeachConditions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path='/lifeguard' element={<Lifeguard />} />
        <Route path="/LifeguardGerir" element={<LifeguardGerir />} />
        <Route path="/AdminReports" element={<AdminReports />} />
        <Route path="/AdminBeach" element={<AdminBeach />} />
        <Route path="/AdminSensor" element={<AdminSensor />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sensors" element={<BeachSearch />} />
        <Route path="/sensors/:beachId" element={<SensorManager />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
