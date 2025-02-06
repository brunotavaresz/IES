import React, { useState, useEffect } from 'react';
import BeachConditionTab from "./BeachStatsTab";
import SeeErrorModal from "../Error/SeeErrorModal";
import SeeErrorConfirmation from "../Error/SeeErrorconfirmation";
import SeeWarningModal from "../Warning/SeeWarningModal";
import CreateWarningModal from "../Warning/CreateWarningModal";
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import SensorValue from "./SensorValue";
import { Modal } from 'flowbite';
import { useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const usePermissions = (role, beachId) => ({
  canAddWarning: role?.toUpperCase() === 'ADMIN' || role?.toUpperCase() === 'LIFEGUARD',
  canChangeFlag: role?.toUpperCase() === 'ADMIN' || (role?.toUpperCase() === 'LIFEGUARD' && localStorage.getItem('assignedBeach') === beachId),
});

export default function BeachCondition() {
  const { beachId } = useParams();
  const location = useLocation();
  const [userRole, setUserRole] = useState(() => {
    try {
      if (location.state?.userRole) {
        return location.state.userRole.toUpperCase();
      }
      const token = localStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.role || 'USER';
      }
      return 'USER';
    } catch (error) {
      console.error('Error initializing user role:', error);
      return 'USER';
    }
  });

  const [isSelected, setIsSelected] = useState(false);
  const [beachData, setBeachData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const permissions = usePermissions(userRole, beachId);
  const [userData, setUserData] = useState(null);
  const [sensorValues, setSensorValues] = useState({});
  const [previousValues, setPreviousValues] = useState({});
  const webSocketRef = useRef(null);
  // Add this useEffect for WebSocket connection


  useEffect(() => {
    const stompClient = new Client({
      brokerURL: `ws://localhost:8080/api/ws/sensors/${beachId}`,
      connectHeaders: {},
      debug: function (str) {
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log('Connected');
      stompClient.subscribe(`/topic/sensors/${beachId}`, message => {
        const data = JSON.parse(message.body);
        console.log('Received sensor update:', data);

        setSensorValues(prevValues => {
          // Store current value as previous before updating
          setPreviousValues(prev => ({
            ...prev,
            [data.type]: prevValues[data.type]?.value || null
          }));

          // Update with new value
          return {
            ...prevValues,
            [data.type]: {
              value: data.value,
              lastChecked: new Date().toISOString()
            }
          };
        });
      });
    };

    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [beachId]);

  // Update your fetchSensorsData function
  const fetchSensorsData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/apiV1/sensors?beachId=${beachId}`);
      const fetchedSensorData = response.data.data;

      // Convert array to object with type as key, including lastChecked
      const sensorValuesObj = fetchedSensorData.reduce((acc, sensor) => {
        acc[sensor.type] = {
          value: sensor.value,
          lastChecked: sensor.state.lastChecked
        };
        return acc;
      }, {});

      setSensorValues(sensorValuesObj);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  // Add this useEffect to fetch initial sensor data
  useEffect(() => {
    fetchSensorsData();
  }, [beachId]);

  const fetchBeachData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/apiV1/beaches?id=${beachId}`);
      const fetchedBeachData = response.data.data[0];
      setBeachData(fetchedBeachData);
      // Set initial flag based on fetched data
      setSelectedFlag(fetchedBeachData.flag || 'green');
    } catch (error) {
      console.error('Error fetching beach data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (location.state?.userRole && location.state.userRole !== userRole) {
      setUserRole(location.state.userRole.toUpperCase());
    }
  }, [location.state?.userRole]);

  useEffect(() => {
    fetchBeachData();
  }, [beachId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          return;
        }

        const decoded = jwtDecode(token);
        const email = decoded.sub;

        const response = await axios.get(`http://localhost:8080/apiV1/users?email=${email}`);
        console.log('Api response:', response);
        const user = response.data.data[0];
        if (user && user.favorites) {
          setUserData(user);
          setIsSelected(user.favorites.includes(beachId));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [beachId]);




  useEffect(() => {
    const savedState = localStorage.getItem(`beach_${beachId}_favorite`);
    if (savedState === 'true') {
      setIsSelected(true);
    }
  }, [beachId]);

  const handleStarClick = async () => {
    if (!userData) {
      console.error('User data is not available.');
      return;
    }

    try {
      const userId = userData.userid;
      const beachId = beachData.beachId;
      if (isSelected) {

        const response = await fetch(`http://localhost:8080/apiV1/users/favorites/remove/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: beachId,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Beach removed from favorites:', data);

        // Update the UI to reflect the removal
        setIsSelected(false);
        localStorage.setItem(`favorite_${beachId}`, 'false');
      } else {
        // If the beach is not in the user's favorites, add it
        const response = await fetch(`http://localhost:8080/apiV1/users/favorites/add/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: beachId,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Beach added to favorites:', data);

        // Update the UI based on the successful response
        setIsSelected(true);
        localStorage.setItem(`favorite_${beachId}`, 'true');
      }
    } catch (error) {
      console.error('Failed to toggle favorite status:', error);
    }
  };

  const handleFlagClick = async (flagColor) => {
    if (permissions.canChangeFlag) {
      setSelectedFlag(flagColor);

      // Verifica se o usuário tem permissão para alterar a bandeira (já está no estado)
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
      }

      const decoded = jwtDecode(token);
      const email = decoded.sub;
      const response = await axios.get(`http://localhost:8080/apiV1/users?email=${email}`);
      const user = response.data.data[0].userid;

      try {
        // Enviar a nova bandeira para o backend
        const response = await axios.put(
          `http://localhost:8080/apiV1/lifeguard/beach/user/${user}/flag/${beachId}`,
          flagColor.toUpperCase(),
          {
            headers: {
              'Authorization': `Bearer ${token}`,  // Passando o token para autenticação
              'Content-Type': 'application/json',  // Informando que o corpo da requisição é um JSON
            },
          }
        );

        if (response.status === 200) {
          console.log('Bandeira alterada com sucesso:', flagColor);
        } else {
          console.error('Falha ao alterar a bandeira');
        }
      } catch (error) {
        console.error('Erro ao tentar alterar a bandeira:', error);
      }
    }
  };


  const handleSubmitReportError = (formData) => {
    console.log('Submitting error report:', formData);
    setShowErrorConfirmation(true);
  };

  const handleWarningClick = () => {
    setShowWarningModal(true);
  };


  const handleDownloadClick = () => {
    const beachMetrics = beachData.beachmetric;

    if (!beachMetrics || beachMetrics.length === 0) {
      alert("No beach metrics to download.");
      return;
    }

    // Flatten nested objects and arrays
    const flattenMetric = (metric) => {
      const flattened = { ...metric };

      // Flatten wind object
      if (metric.wind) {
        flattened.wind_speed = metric.wind.speed;
        flattened.wind_direction = metric.wind.direction;
        delete flattened.wind;
      }

      // Flatten pollutant array into a string
      if (metric.pollutant) {
        flattened.pollutant = metric.pollutant
          .map(p => `type:${p.type},concentration:${p.concentration}`)
          .join(" | ");
      }

      return flattened;
    };

    // Flattened metrics
    const flattenedMetrics = beachMetrics.map(flattenMetric);

    // Extract headers dynamically
    const headers = Array.from(
      new Set(flattenedMetrics.flatMap(metric => Object.keys(metric)))
    );

    // Prepare CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...flattenedMetrics.map(metric =>
        headers
          .map(header => JSON.stringify(metric[header] || "")) // Handle null/undefined
          .join(",")
      )
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${beachData.name}_beachmetric.csv`;
    link.click();

    URL.revokeObjectURL(url); // Clean up
  };

  const handleErrorReportClick = () => {
    setShowErrorModal(true);
  };

  const getFlagColor = (flag) => {
    switch (flag) {
      case 'GREEN': return 'fill-green-500';
      case 'YELLOW': return 'fill-yellow-500';
      case 'RED': return 'fill-red-500';
      default: return 'fill-green-500';
    }
  };

  if (loading || !beachData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="px-4 mx-auto flex flex-col items-center text-center" style={{ paddingTop: '120px' }}>
        <h1 className="text-4xl font-extrabold tracking-tight leading-none text-black md:text-5xl lg:text-6xl">
          {beachData.name}
        </h1>

        {userRole === 'USER'  && (
          <button onClick={handleStarClick} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              width="80"
              height="40"
              className={isSelected ? 'fill-yellow-500' : 'fill-gray-500'}
            >
              <path d="m18.25 15.52 1.36 7.92-7.11-3.74-7.11 3.74 1.36-7.92L1 9.92l7.95-1.16 3.55-7.2 3.55 7.2L24 9.92z" />
            </svg>
          </button>
        )}

        {/* Flag Section */}
        <div className="flex items-center mt-6 w-full justify-between">
          <button
            onClick={handleWarningClick}
            type="button"
            className="ml-10 bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition duration-200"
          >
            {permissions.canAddWarning ? "Add Beach Warning" : `Warnings: ${beachData?.warnings?.length || 0}`}
          </button>

          <button
            onClick={handleDownloadClick}
            type="button"
            className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition duration-200">
            Download Data
          </button>

          <div className="flex items-center">
            {permissions.canChangeFlag ? (
              <div className="flex space-x-4 mr-10">
                {['GREEN', 'YELLOW', 'RED'].map((flag) => (
                  <button
                    key={flag}
                    onClick={() => handleFlagClick(flag)}
                    className={`transition-all duration-300 transform hover:scale-110 hover:shadow-xl rounded-full p-3 ${selectedFlag === flag ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      width="50"
                      height="50"
                      className={`transition-all duration-300 ${selectedFlag === flag ? getFlagColor(flag) : 'fill-gray-400'
                        }`}
                    >
                      <path
                        d="m20.414 12 5.293-5.293A1 1 0 0 0 25 5H11V3a1 1 0 0 0-2 0v25H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-9h14a1 1 0 0 0 .707-1.707z"
                        data-name="Flag"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="50"
                height="50"
                className={getFlagColor(selectedFlag)}
              >
                <path
                  d="m20.414 12 5.293-5.293A1 1 0 0 0 25 5H11V3a1 1 0 0 0-2 0v25H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-9h14a1 1 0 0 0 .707-1.707z"
                  data-name="Flag"
                />
              </svg>
            )}
          </div>
        </div>


      </div>

      <div className="px-10 pt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-3 text-center">
          <h2 className="text-sm font-bold">Water Temperature</h2>
          <SensorValue
            value={sensorValues['WATER_TEMPERATURE']?.value}
            previousValue={previousValues['WATER_TEMPERATURE']}
            lastChecked={sensorValues['WATER_TEMPERATURE']?.lastChecked}
            unit="ºC"
            emoji="🌊"
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-3 text-center">
          <h2 className="text-sm font-bold">Air Temperature</h2>
          <SensorValue
            value={sensorValues['TEMPERATURE']?.value}
            previousValue={previousValues['TEMPERATURE']}
            lastChecked={sensorValues['TEMPERATURE']?.lastChecked}
            unit="ºC"
            emoji="🌡️"
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-3 text-center">
          <h2 className="text-sm font-bold">UV Index</h2>
          <SensorValue
            value={sensorValues['UV_INDEX']?.value}
            previousValue={previousValues['UV_INDEX']}
            lastChecked={sensorValues['UV_INDEX']?.lastChecked}
            unit=""
            emoji="🌞"
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-3 text-center">
          <h2 className="text-sm font-bold">Cloud Cover</h2>
          <SensorValue
            value={sensorValues['CLOUD_COVERAGE']?.value}
            previousValue={previousValues['CLOUD_COVERAGE']}
            lastChecked={sensorValues['CLOUD_COVERAGE']?.lastChecked}
            unit="%"
            emoji="☁️"
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-3 text-center">
          <h2 className="text-sm font-bold">Precipitation</h2>
          <SensorValue
            value={sensorValues['PRECIPITATION']?.value}
            previousValue={previousValues['PRECIPITATION']}
            lastChecked={sensorValues['PRECIPITATION']?.lastChecked}
            unit=" mm/h"
            emoji="🌧️"
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-3 text-center">
          <h2 className="text-sm font-bold">Wind</h2>
          <SensorValue
            value={sensorValues['WIND']?.value}
            previousValue={previousValues['WIND']}
            lastChecked={sensorValues['WIND']?.lastChecked}
            unit=" km/h"
            emoji="🌬️"
          />
        </div>
      </div>



      <div className="flex justify-center px-40 pt-10">
        <BeachConditionTab beachmetric={beachData.beachmetric} beachId={beachId} />
      </div>

      <div className="px-20 pt-10">
        <div className="flex items-center mt-4"> {/* Ajustado para mover para cima */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="40" height="40" className="fill-red-500"> {/* Ícone menor */}
            <path d="m20.414 12 5.293-5.293A1 1 0 0 0 25 5H11V3a1 1 0 0 0-2 0v25H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-9h14a1 1 0 0 0 .707-1.707z" data-name="Flag" />
          </svg>
          <button
            className="text-2xl text-red-500 hover:text-red-800 ml-2"
            onClick={handleErrorReportClick}
            type="button"
          >
            Report Data Error
          </button>
        </div>
        <div className="py-10"></div>
      </div>


      {/* Modals */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <SeeErrorModal onClose={() => setShowErrorModal(false)} beachName={beachData.name} onSubmit={handleSubmitReportError} />
          </div>
        </div>
      )}

      {showErrorConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <SeeErrorConfirmation onClose={() => setShowErrorConfirmation(false)} />
          </div>
        </div>
      )}

      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {permissions.canAddWarning ? (
              <CreateWarningModal
                onClose={() => setShowWarningModal(false)}
                warnings={beachData.warnings}
                beachId={beachData.beachId}
                onWarningChange={fetchBeachData}
              />
            ) : (
              <SeeWarningModal
                onClose={() => setShowWarningModal(false)}
                warnings={beachData.warnings}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

}
