import { useState } from "react";
import TabCloudConditions from "./BeachConditionsTabs/TabCloudConditions";
import TabPollutants from "./BeachConditionsTabs/TabPollutants";
import TabPrecipitation from "./BeachConditionsTabs/TabPrecipitation";
import TabTemperature from "./BeachConditionsTabs/TabTemperature";
import TabUvIndex from "./BeachConditionsTabs/TabUvIndex";
import TabWaterConditions from "./BeachConditionsTabs/TabWaterConditions";

export default function BeachConditionTab({ beachmetric = [], beachId }) {
    const [activeTab, setActiveTab] = useState("water");

    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {/* Tabs */}
            <ul
                className="flex flex-wrap text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg dark:divide-gray-600 dark:text-gray-400"
                data-tabs-toggle="#fullWidthTabContent"
                role="tablist"
            >
                <li className="flex-1">
                    <button
                        type="button"
                        className={`inline-block w-full p-4 ${activeTab === "water" ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                            }`}
                        onClick={() => setActiveTab("water")}
                    >
                        Water Conditions
                    </button>
                </li>
                <li className="flex-1">
                    <button
                        type="button"
                        className={`inline-block w-full p-4 ${activeTab === "cloud" ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                            }`}
                        onClick={() => setActiveTab("cloud")}
                    >
                        Atmospheric Conditions
                    </button>
                </li>
                <li className="flex-1">
                    <button
                        type="button"
                        className={`inline-block w-full p-4 ${activeTab === "temperature" ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                            }`}
                        onClick={() => setActiveTab("temperature")}
                    >
                        Temperature
                    </button>
                </li>
                <li className="flex-1">
                    <button
                        type="button"
                        className={`inline-block w-full p-4 ${activeTab === "Uv" ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                            }`}
                        onClick={() => setActiveTab("Uv")}
                    >
                        UV Index
                    </button>
                </li>
                <li className="flex-1">
                    <button
                        type="button"
                        className={`inline-block w-full p-4 ${activeTab === "precipitation" ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                            }`}
                        onClick={() => setActiveTab("precipitation")}
                    >
                        Precipitation
                    </button>
                </li>
                <li className="flex-1">
                    <button
                        type="button"
                        className={`inline-block w-full p-4 ${activeTab === "pollutants" ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                            }`}
                        onClick={() => setActiveTab("pollutants")}
                    >
                        Pollutants
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            <div id="fullWidthTabContent" className="p-4 bg-gray-50 dark:bg-gray-900">
                {activeTab === "water" && <TabWaterConditions beachmetric={beachmetric} beachId={beachId} />}
                {activeTab === "cloud" && <TabCloudConditions beachmetric={beachmetric} beachId={beachId} />}
                {activeTab === "temperature" && <TabTemperature beachmetric={beachmetric} beachId={beachId} />}
                {activeTab === "Uv" && <TabUvIndex beachmetric={beachmetric} beachId={beachId} />}
                {activeTab === "precipitation" && <TabPrecipitation beachmetric={beachmetric} beachId={beachId} />}
                {activeTab === "pollutants" && <TabPollutants beachmetric={beachmetric} beachId={beachId} />}
            </div>
        </div>
    );
}
