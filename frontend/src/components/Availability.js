import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function Availability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState(null);
  const [formData, setFormData] = useState({
    day_of_week: '',
    start_time: '09:00',
    end_time: '17:00',
    timezone: 'UTC'
  });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await availabilityAPI.getAll();
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await availabilityAPI.upsert(formData);
      fetchAvailability();
      resetForm();
    } catch (error) {
      alert('Error saving availability');
    }
  };

  const handleEdit = (avail) => {
    setFormData({
      day_of_week: avail.day_of_week,
      start_time: avail.start_time.substring(0, 5),
      end_time: avail.end_time.substring(0, 5),
      timezone: avail.timezone
    });
    setEditingDay(avail.day_of_week);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        await availabilityAPI.delete(id);
        fetchAvailability();
      } catch (error) {
        alert('Error deleting availability');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      day_of_week: '',
      start_time: '09:00',
      end_time: '17:00',
      timezone: 'UTC'
    });
    setEditingDay(null);
  };

  const getAvailabilityForDay = (day) => {
    return availability.find(a => a.day_of_week === day);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Availability Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Set Your Available Hours</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day of Week *
            </label>
            <select
              value={formData.day_of_week}
              onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a day</option>
              {DAYS_OF_WEEK.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {editingDay ? 'Update' : 'Add'} Availability
            </button>
            {editingDay && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Weekly Schedule</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {DAYS_OF_WEEK.map(day => {
              const avail = getAvailabilityForDay(day);
              return (
                <div key={day} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{day}</span>
                  </div>
                  <div className="flex-1 text-center">
                    {avail ? (
                      <span className="text-sm text-gray-600">
                        {avail.start_time.substring(0, 5)} - {avail.end_time.substring(0, 5)}
                        <span className="text-xs text-gray-400 ml-2">({avail.timezone})</span>
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Unavailable</span>
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    {avail ? (
                      <>
                        <button
                          onClick={() => handleEdit(avail)}
                          className="text-primary-600 hover:text-primary-900 mr-4 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(avail.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setFormData({ ...formData, day_of_week: day })}
                        className="text-primary-600 hover:text-primary-900 text-sm"
                      >
                        Add hours
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Availability;
