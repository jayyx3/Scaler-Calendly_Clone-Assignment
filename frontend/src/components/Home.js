import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventTypesAPI } from '../services/api';

function Home() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const response = await eventTypesAPI.getAll();
      setEventTypes(response.data);
    } catch (error) {
      console.error('Error fetching event types:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Calendly Clone
        </h1>
        <p className="text-xl text-gray-600">
          Schedule meetings effortlessly with our booking platform
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Available Event Types
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : eventTypes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No event types available. Please create one from the Event Types page.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventTypes.map((eventType) => (
              <Link
                key={eventType.id}
                to={`/book/${eventType.slug}`}
                className="block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {eventType.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {eventType.description || 'No description'}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {eventType.duration} minutes
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/event-types"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-primary-600 mb-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Event Types</h3>
          <p className="text-gray-600 text-sm">Create and configure different types of meetings</p>
        </Link>

        <Link
          to="/availability"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-primary-600 mb-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Availability</h3>
          <p className="text-gray-600 text-sm">Configure your available days and time slots</p>
        </Link>

        <Link
          to="/meetings"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-primary-600 mb-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Meetings</h3>
          <p className="text-gray-600 text-sm">See all your upcoming and past meetings</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
