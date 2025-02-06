import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfDay, endOfDay, isAfter } from 'date-fns';

const PollutantsConditionsDashboard = ({ beachId }) => {
  const [pollutantData, setPollutantData] = useState([]);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pollutantConfig = {
    OIL: {
      color: '#ff6384',
      unit: 'ppm',
      description: 'Oil concentration in parts per million'
    },
    CHEMICALS: {
      color: '#36a2eb',
      unit: 'mg/L',
      description: 'Chemical concentration in milligrams per liter'
    },
    ALGAE: {
      color: '#4bc0c0',
      unit: 'cells/mL',
      description: 'Algae concentration in cells per milliliter'
    },
    BACTERIA: {
      color: '#ffcd56',
      unit: 'CFU/100mL',
      description: 'Bacterial count in colony-forming units per 100 milliliters'
    }
  };

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

  const fetchPollutantData = async () => {
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
        .map((item) => {
          const pollutants = Array.isArray(item.polutant)
            ? item.polutant.reduce((acc, pollutant) => {
              acc[pollutant.type] = pollutant.concentration;
              return acc;
            }, {})
            : {};

          return {
            timestamp: format(new Date(item.timestamp), 'MMM d, HH:mm'), // Format here
            OIL: pollutants["OIL"] ?? null,
            CHEMICALS: pollutants["CHEMICALS"] ?? null,
            ALGAE: pollutants["ALGAE"] ?? null,
            BACTERIA: pollutants["BACTERIA"] ?? null,
          };
        })
        .filter(
          (item) =>
            item.OIL !== null ||
            item.CHEMICALS !== null ||
            item.ALGAE !== null ||
            item.BACTERIA !== null
        );



      setPollutantData(formattedData);

    } catch (error) {
      console.error('Error fetching pollutant data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!error) {
      fetchPollutantData();
    }
  }, [beachId, startDate, endDate]);

  const formatDataForChart = (data) => {
    return data.map(item => ({
      ...item,
      timestamp: item.timestamp, // Already formatted in the data-fetching step
    }));
  };

  const getPollutantSeverityClass = (type, concentration) => {
    // Example thresholds - adjust based on actual requirements
    const thresholds = {
      OIL: { moderate: 5, high: 10 },
      CHEMICALS: { moderate: 2, high: 5 },
      ALGAE: { moderate: 1000, high: 5000 },
      BACTERIA: { moderate: 200, high: 500 }
    };

    if (!concentration || !thresholds[type]) return 'text-gray-700';
    const { moderate, high } = thresholds[type];

    if (concentration >= high) return 'text-red-600 font-bold';
    if (concentration >= moderate) return 'text-yellow-600';
    return 'text-green-600';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="text-sm font-bold mb-2">{label}</p>
          {payload.map((entry, index) => {
            const pollutant = entry.dataKey;
            const config = pollutantConfig[pollutant];
            if (entry.value !== null) {
              return (
                <div key={index} className="mb-1">
                  <p className="text-sm" style={{ color: entry.color }}>
                    {pollutant}: {entry.value?.toFixed(2)} {config.unit}
                  </p>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  const getStats = () => {
    if (pollutantData.length === 0) return null;

    const stats = {};
    Object.keys(pollutantConfig).forEach(type => {
      const values = pollutantData
        .map(item => item[type])
        .filter(val => val !== null);

      if (values.length > 0) {
        stats[type] = {
          max: Math.max(...values),
          min: Math.min(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length
        };
      }
    });
    return stats;
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
          {/* Statistics Section */}
          <div className="border rounded-lg p-4 bg-white shadow col-span-2">
            <h2 className="text-xl font-bold mb-4">Pollutant Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(getStats() || {}).map(([type, stats]) => (
                <div key={type} className="p-4 border rounded-lg" style={{ borderColor: pollutantConfig[type].color }}>
                  <h3 className="font-bold mb-2" style={{ color: pollutantConfig[type].color }}>{type}</h3>
                  <p className="text-sm">Max: {stats.max.toFixed(2)} {pollutantConfig[type].unit}</p>
                  <p className="text-sm">Min: {stats.min.toFixed(2)} {pollutantConfig[type].unit}</p>
                  <p className="text-sm">Avg: {stats.avg.toFixed(2)} {pollutantConfig[type].unit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-xl font-bold mb-4">Pollutants Concentration Chart</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formatDataForChart(pollutantData)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 90 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={Math.ceil(pollutantData.length / 10)}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    label={{
                      value: 'Concentration',
                      angle: -90,
                      position: 'insideLeft',
                      offset: -5
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  {Object.entries(pollutantConfig).map(([pollutant, config]) => (
                    <Line
                      key={pollutant}
                      type="monotone"
                      dataKey={pollutant}
                      name={`${pollutant}`}
                      stroke={config.color}
                      activeDot={{ r: 8 }}
                      connectNulls
                    />
                  ))}
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
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Concentration</th>
                    <th className="border p-2 text-left">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {pollutantData.map((item, index) => (
                    Object.entries(pollutantConfig).map(([type, config]) => {
                      if (item[type] !== null) {
                        return (
                          <tr key={`${index}-${type}`} className="hover:bg-gray-50">
                            <td className="border p-2">
                              {item.timestamp} {/* Already a string, no additional formatting needed */}
                            </td>

                            <td className="border p-2" style={{ color: config.color }}>
                              {type}
                            </td>
                            <td className={`border p-2 ${getPollutantSeverityClass(type, item[type])}`}>
                              {item[type]?.toFixed(2)}
                            </td>
                            <td className="border p-2 text-gray-600">
                              {config.unit}
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })
                  )).flat().filter(Boolean)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollutantsConditionsDashboard;