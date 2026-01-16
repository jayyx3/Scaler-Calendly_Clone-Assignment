import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventTypesAPI, bookingsAPI } from '../services/api';

function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [formData, setFormData] = useState({
    invitee_name: '',
    invitee_email: ''
  });

  useEffect(() => {
    fetchEventType();
  }, [slug]);

  useEffect(() => {
    if (selectedDate && eventType) {
      fetchAvailableSlots();
    }
  }, [selectedDate, eventType]);

  const fetchEventType = async () => {
    try {
      const response = await eventTypesAPI.getBySlug(slug);
      setEventType(response.data);
    } catch (error) {
      console.error('Error fetching event type:', error);
      alert('Event type not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await bookingsAPI.getAvailableSlots(selectedDate, eventType.id);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await bookingsAPI.create({
        event_type_id: eventType.id,
        invitee_name: formData.invitee_name,
        invitee_email: formData.invitee_email,
        meeting_date: selectedDate,
        meeting_time: selectedSlot
      });
      setBookingDetails(response.data);
      setShowConfirmation(true);
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating booking');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const days = getDaysInMonth(currentMonth);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isDateSelectable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!eventType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Event type not found</p>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">Your meeting has been successfully scheduled</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Meeting Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Event:</span> {bookingDetails.event_name}</p>
              <p><span className="font-medium">Duration:</span> {bookingDetails.duration} minutes</p>
              <p><span className="font-medium">Date:</span> {formatDisplayDate(new Date(bookingDetails.meeting_date))}</p>
              <p><span className="font-medium">Time:</span> {formatTime(bookingDetails.meeting_time)}</p>
              <p><span className="font-medium">Name:</span> {bookingDetails.invitee_name}</p>
              <p><span className="font-medium">Email:</span> {bookingDetails.invitee_email}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{eventType.name}</h1>
        <p className="text-gray-600 mt-2">{eventType.description}</p>
        <div className="flex items-center mt-2 text-gray-500">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {eventType.duration} minutes
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Select a Date</h2>
            <div className="flex space-x-2">
              <button
                onClick={prevMonth}
                className="p-1 rounded hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={nextMonth}
                className="p-1 rounded hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day && isDateSelectable(day) && setSelectedDate(formatDate(day))}
                disabled={!day || !isDateSelectable(day)}
                className={`
                  aspect-square p-2 text-sm rounded-lg
                  ${!day ? 'invisible' : ''}
                  ${day && !isDateSelectable(day) ? 'text-gray-300 cursor-not-allowed' : ''}
                  ${day && isDateSelectable(day) ? 'hover:bg-primary-50 cursor-pointer' : ''}
                  ${selectedDate === formatDate(day) ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}
                `}
              >
                {day ? day.getDate() : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots and Form Section */}
        <div className="bg-white rounded-lg shadow p-6">
          {!selectedDate ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Please select a date
            </div>
          ) : !selectedSlot ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Available Times for {formatDisplayDate(new Date(selectedDate))}
              </h2>
              {loadingSlots ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No available slots for this date</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm font-medium"
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to time selection
              </button>

              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  {formatDisplayDate(new Date(selectedDate))} at {formatTime(selectedSlot)}
                </p>
              </div>

              <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.invitee_name}
                    onChange={(e) => setFormData({ ...formData, invitee_name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.invitee_email}
                    onChange={(e) => setFormData({ ...formData, invitee_email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
