// src/components/SensorValue.jsx
import React, { useState, useEffect } from 'react';

const SensorValue = ({ value, previousValue, unit, emoji, lastChecked }) => {
    const [showDiff, setShowDiff] = useState(false);

    useEffect(() => {
        if (previousValue !== null) {
            setShowDiff(true);
            const timer = setTimeout(() => {
                setShowDiff(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [value, previousValue]);

    const isDataStale = () => {
        if (!lastChecked) return true;
        const lastCheckTime = new Date(lastChecked);
        const currentTime = new Date();
        const diffInMilliseconds = currentTime - lastCheckTime;
        const diffInMinutes = diffInMilliseconds / (1000 * 60);
        return diffInMinutes > 1;
    };

    const numericValue = Number(value);
    const numericPrevValue = Number(previousValue);

    if (isNaN(numericValue) || !value || isDataStale()) {
        return <p className="text-sm">{emoji} N/A</p>;
    }

    const difference = !isNaN(numericPrevValue) ? numericValue - numericPrevValue : 0;
    const showTrend = !isNaN(numericPrevValue) && previousValue !== null;

    return (
        <div className="flex items-center justify-center">
            <p className="text-sm relative">
                {emoji} {numericValue.toFixed(1)}{unit}
                {showTrend && (
                    <span className="inline-flex items-center">
                        <span className={`text-xl ml-1 ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {difference >= 0 ? '↑' : '↓'}
                        </span>
                        {showDiff && (
                            <span
                                className={`absolute left-full ml-1 transition-opacity duration-200 ${difference >= 0 ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                ({Math.abs(difference).toFixed(2)})
                            </span>
                        )}
                    </span>
                )}
            </p>
        </div>
    );
};

export default SensorValue;