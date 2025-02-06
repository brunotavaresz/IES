import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { XCircle } from 'lucide-react';

export default function AddWarning({ onClose, beachId, onWarningChange }) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'Warning_title' ? 'title' : 'description']: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const warning = {
        title: formData.title,
        description: formData.description,
        beachId: beachId,
        date: new Date().toISOString(),
      };

      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://localhost:8080/apiV1/lifeguard/beach/warning/${beachId}`,
        warning,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        onWarningChange();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create warning');
      console.error('Error creating warning:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-4 w-full max-w-2xl max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 py-1 border border-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Create New Warning</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="max-w-sm mx-auto py-10" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="Warning_title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              id="Warning_title"
              value={formData.title}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Warning title"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="Warning_description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description (optional)
            </label>
            <textarea
              id="Warning_description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide additional details about the warning..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-black-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Warning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}