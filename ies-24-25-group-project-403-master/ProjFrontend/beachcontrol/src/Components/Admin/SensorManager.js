import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const SensorManager = () => {
  const location = useLocation();
  const { selectedBeach } = location.state || {};

  const [footerHeight, setFooterHeight] = useState(0);
  const extraSpace = 100;
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [newSensor, setNewSensor] = useState({ type: "", value: "", status: "" });
  const [addSensorError, setAddSensorError] = useState("");
  const [selectedSensorType, setSelectedSensorType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const SENSOR_TYPES = [
    "TEMPERATURE",
    "WATER_TEMPERATURE",
    "HUMIDITY",
    "CLOUD_COVERAGE",
    "UV_INDEX",
    "WIND",
    "PRECIPITATION",
    "POLUTANT",
    "WAVE_HEIGHT",
    "TIDE_HEIGHT"
  ];
  const navigate = useNavigate();
  useEffect(() => {

    const token = localStorage.getItem('authToken');
    if (!token || !(jwtDecode(token).role === "ADMIN")) {
      navigate('/home');
    }

    if (selectedBeach) {
      const fetchSensors = async () => {
        try {
          const response = await axios.get("http://localhost:8080/apiV1/sensors", {
            params: { beachId: selectedBeach.beachId },
          });
          setSensors(response.data.data || []);
          setFilteredSensors(response.data.data || []);
        } catch (error) {
          console.error("Error fetching sensors:", error);
          setSensors([]);
          setFilteredSensors([]);
        }
      };

      fetchSensors();
    }
  }, [selectedBeach]);

  useEffect(() => {
    let filtered = sensors;

    // Filtragem por tipo de sensor
    if (selectedSensorType) {
      filtered = filtered.filter(sensor => sensor.type === selectedSensorType);
    }

    // Filtragem por status
    if (selectedStatus) {
      const isAvailable = selectedStatus === "available";
      filtered = filtered.filter(sensor => sensor.state?.state === isAvailable);
    }

    setFilteredSensors(filtered);
  }, [selectedSensorType, selectedStatus, sensors]);

  const handleAddSensor = async () => {
    if (!newSensor.type || !newSensor.status) {
      setAddSensorError("Please select the sensor type and status.");
      return;
    }

    try {
      if (!selectedBeach) {
        setAddSensorError("Beach not selected.");
        return;
      }

      const validSensorId = `${selectedBeach.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`;

      const newSensorData = {
        sensorId: validSensorId,
        type: newSensor.type,
        value: newSensor.value ? parseFloat(newSensor.value) : 0,
        state: {
          state: newSensor.status === "available",
          lastChecked: new Date(),
        },
        beachId: selectedBeach.beachId,
      };

      const response = await axios.post("http://localhost:8080/apiV1/admin/sensor/create", newSensorData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      setSensors((prev) => [...prev, response.data.data]);
      setNewSensor({ type: "", value: "", status: "" });
      setAddSensorError("");
    } catch (error) {
      console.error("Error adding sensor:", error);
      if (error.response?.status === 409) {
        setAddSensorError("A sensor of this type already exists on the selected beach.");
      } else {
        setAddSensorError("Failed to add sensor.");
      }
    }
  };

  const handleDeleteSensor = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/apiV1/admin/sensor/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setSensors((prev) => prev.filter((sensor) => sensor.sensorId !== id));

      // Exibe a notificação de sucesso ao excluir o sensor
      toast.success("Sensor successfully deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting sensor:", error);
    }
  };

  const handleToggleStatus = async (sensorId, currentStatus) => {
    try {
      const newStatus = currentStatus === "available" ? "unavailable" : "available";

      const response = await axios.put(
        `http://localhost:8080/apiV1/admin/sensor/update-status/${sensorId}`,
        { state: { state: newStatus === "available" } },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        }
      );

      setSensors(prevSensors =>
        prevSensors.map(sensor =>
          sensor.sensorId === sensorId ? { ...sensor, state: { ...sensor.state, state: newStatus === "available" } } : sensor
        )
      );
    } catch (error) {
      console.error("Error updating sensor status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ paddingBottom: `${footerHeight + extraSpace}px` }}>
      <div className="container mx-auto pt-32 flex-1 overflow-auto">
        <h1 className="text-3xl font-bold mb-5" style={{ color: "#003366" }}>
          Manage Beach Sensors
        </h1>

        {selectedBeach && (
          <div className="bg-white rounded shadow p-4 border border-black mb-5">
            <h3 className="text-xl font-bold mb-3" style={{ color: "#003366" }}>
              Add New Sensor
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
                <select
                  className="block w-full p-2 bg-white border border-black rounded"
                  value={newSensor.type}
                  onChange={(e) => setNewSensor({ ...newSensor, type: e.target.value })}
                >
                  <option value="">Select...</option>
                  {SENSOR_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                <select
                  className="block w-full p-2 bg-white border border-black rounded"
                  value={newSensor.status}
                  onChange={(e) => setNewSensor({ ...newSensor, status: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
            <div className="mb-4 mt-3">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleAddSensor}
              >
                Add Sensor
              </button>
              {addSensorError && <p className="text-red-500 mt-2">{addSensorError}</p>}
            </div>
          </div>
        )}

        {selectedBeach && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold" style={{ color: "#003366" }}>
                Sensors on {selectedBeach.name}
              </h2>
            </div>

            <div className="flex space-x-6 mb-6">
              {/* Filtro por Tipo */}
              <div className="flex items-center">
                <label className="mr-2 text-lg font-medium text-gray-700">Type</label>  {/* Texto em cinza */}
                <select
                  className="p-1 bg-white border border-black rounded w-40"
                  value={selectedSensorType}
                  onChange={(e) => setSelectedSensorType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {SENSOR_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Status */}
              <div className="flex items-center">
                <label className="mr-2 text-lg font-medium text-gray-700">Status</label>  {/* Texto em cinza */}
                <select
                  className="p-1 bg-white border border-black rounded w-40"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <ul className="bg-white rounded shadow p-4 border border-black">
              {filteredSensors.map((sensor) => (
                <li
                  key={`${sensor.sensorId}-${sensor.type}`}
                  className="flex items-center justify-between border-b last:border-b-0 py-2"
                >
                  <div>
                    <strong>Type:</strong> {sensor.type} <br />
                    <strong>State:</strong> {sensor.state?.state ? "Available" : "Unavailable"} <br />
                    <strong>Last Checked:</strong> {new Date(sensor.state?.lastChecked).toLocaleString()}
                  </div>
                  <div>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleToggleStatus(sensor.sensorId, sensor.state?.state ? "available" : "unavailable")}
                    >
                      {sensor.state?.state ? "Set Unavailable" : "Set Available"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                      onClick={() => handleDeleteSensor(sensor.sensorId)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SensorManager;