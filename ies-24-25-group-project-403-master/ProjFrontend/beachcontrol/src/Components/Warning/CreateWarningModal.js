import { useState } from 'react';
import axios from 'axios';
import AddWarning from './AddWarning';
import LifeguardWarningCard from './LifeguardWarningCard';
import { XCircle } from 'lucide-react';

export default function CreateWarningModal({ onClose, warnings = [], beachId, onWarningChange }) {
  const [showAddWarningModal, setShowAddWarningModal] = useState(false);

  const handleAddWarning = () => {
    setShowAddWarningModal(true);
  };

  const handleCloseAddWarning = () => {
    setShowAddWarningModal(false);
  };

  const handleDeleteWarning = async (warning) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(
        `http://localhost:8080/apiV1/lifeguard/beach/warning/${beachId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: warning
        }
      );
      onWarningChange(); // Now this prop is properly defined
    } catch (error) {
      console.error('Error deleting warning:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-800 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-100 dark:bg-gray-800 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Beach Warnings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Warnings List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {warnings.map((warning, index) => (
            <div key={warning.id || index} className="p-4 border rounded-lg relative hover:shadow-lg transition-shadow duration-300 bg-gray-50 dark:bg-gray-900">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Description:</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{warning.description || "No description"}</p>
              </div>

              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span>Warning made by: </span>
                  <span className="font-medium text-gray-900 dark:text-white">{warning.lifeguardId}</span>
                </div>
                <div>
                  <span>Issued: </span>
                  <span className="font-medium text-gray-900 dark:text-white">{new Date(warning.date).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDeleteWarning(warning)}
                  className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition duration-300"
                >
                  Remove Warning
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Warning Button */}
        <div className="p-4">
          <button
            onClick={handleAddWarning}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Add Beach Warning
          </button>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>

      {/* Add Warning Modal */}
      {showAddWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 max-w-2xl w-full">
            <AddWarning
              onClose={handleCloseAddWarning}
              beachId={beachId}
              onWarningChange={onWarningChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
