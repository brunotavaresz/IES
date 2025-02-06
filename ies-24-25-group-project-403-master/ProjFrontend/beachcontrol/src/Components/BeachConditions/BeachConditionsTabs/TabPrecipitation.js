import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfDay, endOfDay, isAfter } from 'date-fns';

const PrecipitationDashboard = ({ beachId }) => {
  const [rainData, setRainData] = useState([]);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleStartDateChange = (e) => {
    const newStartDate = startOfDay(new Date(e.target.value));
    if (isAfter(newStartDate, endDate)) {
      setError('Start date cannot be after end date');
      return;
    }
    setError('');
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = endOfDay(new Date(e.target.value));
    if (isAfter(startDate, newEndDate)) {
      setError('End date cannot be before start date');
      return;
    }
    setError('');
    setEndDate(newEndDate);
  };

  const fetchBeachData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/apiV1/beaches?id=${beachId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const formattedData = data.data[0].beachmetric
        .map((item) => ({
          timestamp: new Date(item.timestamp),
          precipitation: item.precipitation || null,
        }))
        .filter(item => item.precipitation !== null);
      setRainData(formattedData);
    } catch (error) {
      console.error('Error fetching beach data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!error) {
      fetchBeachData();
    }
  }, [beachId, startDate, endDate]);

  const formatDataForChart = (data) => {
    return data.map(item => ({
      timestamp: format(new Date(item.timestamp), 'MMM d, HH:mm'),
      precipitation: item.precipitation,
      intensity: getPrecipitationIntensity(item.precipitation)
    }));
  };

  const getPrecipitationIntensity = (precipitation) => {
    if (precipitation === 0) return 'None';
    if (precipitation < 2.5) return 'Light';
    if (precipitation < 7.6) return 'Moderate';
    if (precipitation < 50) return 'Heavy';
    return 'Violent';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const precipitation = payload[0].value;
      const intensity = getPrecipitationIntensity(precipitation);
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="text-sm font-bold">{label}</p>
          <p className="text-sm" style={{ color: '#36a2eb' }}>
            Precipitation: {precipitation.toFixed(2)} mm/h
          </p>
          <p className="text-sm">
            Intensity: {intensity}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Date Selection */}
      <div className="space-y-2">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={handleStartDateChange}
              className="border rounded p-2"
              max={format(endDate, 'yyyy-MM-dd')}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={handleEndDateChange}
              className="border rounded p-2"
              min={format(startDate, 'yyyy-MM-dd')}
            />
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Chart Section */}
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-xl font-bold mb-4">Precipitation Per Hour</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formatDataForChart(rainData)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 90 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={Math.ceil(rainData.length / 10)}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{
                      value: 'Precipitation (mm/h)',
                      angle: -90,
                      position: 'insideLeft',
                      offset: -5
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="precipitation"
                    name="Precipitation (mm/h)"
                    stroke="#36a2eb"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-xl font-bold mb-4">Raw Data</h2>
            <div className="h-[400px] overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="border p-2 text-left">Time</th>
                    <th className="border p-2 text-left">Precipitation (mm/h)</th>
                    <th className="border p-2 text-left">Intensity</th>
                  </tr>
                </thead>
                <tbody>
                  {rainData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">
                        {format(item.timestamp, 'MMM d, HH:mm')}
                      </td>
                      <td className="border p-2">
                        {item.precipitation?.toFixed(2) ?? 'N/A'}
                      </td>
                      <td className="border p-2">
                        {getPrecipitationIntensity(item.precipitation)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrecipitationDashboard;