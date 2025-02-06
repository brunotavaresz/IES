import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ERROR_TYPES = [
  { value: 'water_temperature', label: 'Water Temperature' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'cloud_conditions', label: 'Cloud Conditions' },
  { value: 'uv_index', label: 'UV Index' },
  { value: 'precipitation', label: 'Precipitation' },
  { value: 'pollutants', label: 'Pollutants' },
];

export default function ImprovedWarningModal({ onClose, beachName, onSubmit, userID }) {
  const [formData, setFormData] = useState({
    errorDate: new Date().toISOString().split('T')[0],
    errorType: ERROR_TYPES[0].value,
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.errorDate) {
      newErrors.errorDate = 'Please select a date';
    }
    if (!formData.errorType) {
      newErrors.errorType = 'Please select an error type';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const selectedErrorType = ERROR_TYPES.find(type => type.value === formData.errorType);
        
        const reportData = {
          beachName,
          title: selectedErrorType.label,
          description: formData.description || `Report for ${selectedErrorType.label}`,
          date: new Date(formData.errorDate).toISOString(),
          userID: userID || "123"
        };        

        const response = await fetch('http://localhost:8080/apiV1/users/addReport', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reportData)
        });

        if (!response.ok) {
          throw new Error('Failed to submit report');
        }

        const responseData = await response.json();
        onSubmit(responseData);
        onClose();
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to submit report. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Report Data Error at {beachName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Date */}
          <div>
            <label htmlFor="errorDate" className="block mb-2 text-sm font-medium text-gray-700">
              Date of Error
            </label>
            <input
              type="date"
              id="errorDate"
              value={formData.errorDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg transition-all 
                ${errors.errorDate 
                  ? 'border-red-500 ring-2 ring-red-100' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
            />
            {errors.errorDate && (
              <p className="mt-1 text-sm text-red-500">{errors.errorDate}</p>
            )}
          </div>

          {/* Error Type */}
          <div>
            <label htmlFor="errorType" className="block mb-2 text-sm font-medium text-gray-700">
              Type of Error
            </label>
            <select
              id="errorType"
              value={formData.errorType}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg transition-all 
                ${errors.errorType 
                  ? 'border-red-500 ring-2 ring-red-100' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
            >
              {ERROR_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.errorType && (
              <p className="mt-1 text-sm text-red-500">{errors.errorType}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Provide additional details about the error..."
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all 
                ${isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300'
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}