import React from 'react';
import { XIcon, InfoIcon } from 'lucide-react';

export default function SeeWarningConfirmation({ onClose }) {
    return (
        <div className="relative p-4 w-full max-w-2xl">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <div className="flex items-center">
                        <InfoIcon className="w-8 h-8 text-blue-500" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                            Data Error Sent
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 transition-colors dark:hover:bg-gray-600 dark:hover:text-white"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                    <p className="text-base text-center text-gray-500 dark:text-gray-400">
                        Your help maintaining BeachControl Error Free is appreciated
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-center p-4 md:p-5 border-t dark:border-gray-600">
                    <button
                        onClick={onClose}
                        className="w-full max-w-xs text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center transition-colors dark:hover:bg-blue-800 dark:focus:ring-blue-900"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}