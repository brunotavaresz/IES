import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from 'flowbite';

const SensorManager = () => {
  const [footerHeight, setFooterHeight] = useState(0);
  const extraSpace = 100;

  const [beaches, setBeaches] = useState([]);
  const [selectedBeach, setSelectedBeach] = useState(null);
  const [searchBeach, setSearchBeach] = useState("");
  const [sensors, setSensors] = useState([]);
  const [newSensor, setNewSensor] = useState({ type: "", value: "", status: "" });
  const [addSensorError, setAddSensorError] = useState("");
  const [beachError, setBeachError] = useState("");

  const [confirmDeleteSensor, setConfirmDeleteSensor] = useState(null); // Para armazenar o sensor a ser excluído

  // Carregar lista de praias no início
  useEffect(() => {
    const fetchBeaches = async () => {
      try {
        const response = await axios.get("http://localhost:8080/apiV1/beaches");
        setBeaches(response.data.data);
      } catch (error) {
        console.error("Error fetching beaches:", error);
      }
    };

    fetchBeaches();
  }, []);

  const handleBeachSelect = async () => {
    try {
      const beach = beaches.find(
        (beach) => beach.name.toLowerCase() === searchBeach.toLowerCase()
      );
      if (!beach) {
        setBeachError("Invalid beach. Please select an existing beach.");
        return;
      }
      setSelectedBeach(beach); // Armazenamos o objeto completo da praia
      console.log("Selected Beach:", beach);
      console.log("Selected Beach ID:", beach.beachId);
      setBeachError("");

      // Fetch sensors para a praia selecionada
      const response = await axios.get("http://localhost:8080/apiV1/sensors", {
        params: { beachId: beach.beachId },
      });
      setSensors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sensors:", error);
      setSensors([]);
    }
  };

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
          lastChecked: new Date(),  // Envio do valor correto de lastChecked
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

  const handleDeleteSensor = async () => {
    if (confirmDeleteSensor) {
      try {
        await axios.delete(`http://localhost:8080/apiV1/admin/sensor/delete/${confirmDeleteSensor.sensorId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setSensors((prev) => prev.filter((sensor) => sensor.sensorId !== confirmDeleteSensor.sensorId));
        setConfirmDeleteSensor(null); // Fechar o modal
      } catch (error) {
        console.error("Error deleting sensor:", error);
      }
    }
  };

  const handleToggleStatus = async (sensorId, currentStatus) => {
    try {
      const newStatus = currentStatus === "available" ? "unavailable" : "available";  // Alterna o status

      const response = await axios.put(
        `http://localhost:8080/apiV1/admin/sensor/update-status/${sensorId}`,
        { state: { state: newStatus === "available" } }, // Enviar o objeto completo conforme esperado no back-end
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        }
      );


      // Atualizar o estado dos sensores localmente
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
  
        {/* Beach Selection */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Choose a beach</label>
          <input
            type="text"
            className={`block w-full p-2 bg-white border ${beachError ? "border-red-500" : "border-black"} rounded`}
            placeholder="Enter the beach name..."
            value={searchBeach}
            onChange={(e) => setSearchBeach(e.target.value)}
            list="beach-suggestions"
          />
          <datalist id="beach-suggestions">
            {beaches.map((beach) => (
              <option key={`${beach.id}-${beach.name}`} value={beach.name} />
            ))}
          </datalist>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleBeachSelect}
          >
            Select Beach
          </button>
          {beachError && <p className="text-red-500 mt-2">{beachError}</p>}
        </div>
  
        {/* Sensors List */}
        {selectedBeach && (
          <div>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: "#003366" }}>
              Sensors on {selectedBeach.name}
            </h2>
            <ul className="bg-white rounded shadow p-4 mb-5 border border-black">
              {sensors.map((sensor) => (
                <li key={`${sensor.sensorId}-${sensor.type}`} className="flex items-center justify-between border-b last:border-b-0 py-2">
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
                      onClick={() => setConfirmDeleteSensor(sensor)} // Armazenar o sensor a ser excluído
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Add New Sensor */}
        {selectedBeach && (
          <div className="bg-white rounded shadow p-4 border border-black">
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
                  <option value="TEMPERATURE">TEMPERATURE</option>
                  <option value="WATER_TEMPERATURE">WATER_TEMPERATURE</option>
                  <option value="HUMIDITY">HUMIDITY</option>
                  <option value="CLOUD_COVERAGE">CLOUD_COVERAGE</option>
                  <option value="UV_INDEX">UV_INDEX</option>
                  <option value="WIND">WIND</option>
                  <option value="PRECIPITATION">PRECIPITATION</option>
                  <option value="POLUTANT">POLUTANT</option>
                  <option value="WAVE_HEIGHT">WAVE_HEIGHT</option>
                  <option value="TIDE_HEIGHT">TIDE_HEIGHT</option>
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

        {/* Modal de Confirmação */}
        {confirmDeleteSensor && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: "#003366" }}>
                Are you sure you want to delete this sensor?
              </h3>
              <div className="flex justify-between">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleDeleteSensor}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setConfirmDeleteSensor(null)} // Fechar o modal
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorManager;