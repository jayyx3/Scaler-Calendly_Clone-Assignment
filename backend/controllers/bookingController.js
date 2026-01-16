const db = require('../config/database');

// Get available time slots for a specific date and event type
const getAvailableSlots = async (req, res) => {
  try {
    const { date, eventTypeId } = req.query;
    
    if (!date || !eventTypeId) {
      return res.status(400).json({ error: 'Date and event type ID are required' });
    }
    
    // Get event type duration
    const [eventTypes] = await db.query('SELECT duration FROM event_types WHERE id = ?', [eventTypeId]);
    if (eventTypes.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    const duration = eventTypes[0].duration;
    
    // Get day of week from date
    const dateObj = new Date(date);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[dateObj.getDay()];
    
    // Get availability for that day
    const [availability] = await db.query('SELECT * FROM availability WHERE day_of_week = ?', [dayOfWeek]);
    
    if (availability.length === 0) {
      return res.json([]);
    }
    
    const { start_time, end_time } = availability[0];
    
    // Get already booked slots for that date
    const [bookedSlots] = await db.query(
      'SELECT meeting_time, duration FROM meetings m JOIN event_types e ON m.event_type_id = e.id WHERE meeting_date = ? AND status = "scheduled"',
      [date]
    );
    
    // Generate available time slots
    const slots = [];
    const startMinutes = timeToMinutes(start_time);
    const endMinutes = timeToMinutes(end_time);
    
    for (let minutes = startMinutes; minutes + duration <= endMinutes; minutes += duration) {
      const slotTime = minutesToTime(minutes);
      
      // Check if slot conflicts with any booked meeting
      const isBooked = bookedSlots.some(booked => {
        const bookedStart = timeToMinutes(booked.meeting_time);
        const bookedEnd = bookedStart + booked.duration;
        const slotEnd = minutes + duration;
        
        // Check for overlap
        return (minutes < bookedEnd && slotEnd > bookedStart);
      });
      
      if (!isBooked) {
        slots.push(slotTime);
      }
    }
    
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a booking
const createBooking = async (req, res) => {
  try {
    const { event_type_id, invitee_name, invitee_email, meeting_date, meeting_time } = req.body;
    
    if (!event_type_id || !invitee_name || !invitee_email || !meeting_date || !meeting_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if slot is still available
    const [eventType] = await db.query('SELECT duration FROM event_types WHERE id = ?', [event_type_id]);
    if (eventType.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    const duration = eventType[0].duration;
    const requestedStart = timeToMinutes(meeting_time);
    const requestedEnd = requestedStart + duration;
    
    // Check for conflicts
    const [conflicts] = await db.query(
      `SELECT m.meeting_time, e.duration FROM meetings m 
       JOIN event_types e ON m.event_type_id = e.id 
       WHERE m.meeting_date = ? AND m.status = 'scheduled'`,
      [meeting_date]
    );
    
    const hasConflict = conflicts.some(conflict => {
      const bookedStart = timeToMinutes(conflict.meeting_time);
      const bookedEnd = bookedStart + conflict.duration;
      return (requestedStart < bookedEnd && requestedEnd > bookedStart);
    });
    
    if (hasConflict) {
      return res.status(400).json({ error: 'This time slot is no longer available' });
    }
    
    // Create booking
    const [result] = await db.query(
      'INSERT INTO meetings (event_type_id, invitee_name, invitee_email, meeting_date, meeting_time) VALUES (?, ?, ?, ?, ?)',
      [event_type_id, invitee_name, invitee_email, meeting_date, meeting_time]
    );
    
    const [newBooking] = await db.query(
      `SELECT m.*, e.name as event_name, e.duration 
       FROM meetings m 
       JOIN event_types e ON m.event_type_id = e.id 
       WHERE m.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newBooking[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all meetings
const getAllMeetings = async (req, res) => {
  try {
    const { filter } = req.query; // 'upcoming' or 'past'
    
    let query = `
      SELECT m.*, e.name as event_name, e.duration 
      FROM meetings m 
      JOIN event_types e ON m.event_type_id = e.id 
      WHERE m.status = 'scheduled'
    `;
    
    const now = new Date().toISOString().split('T')[0];
    
    if (filter === 'upcoming') {
      query += ` AND m.meeting_date >= '${now}' ORDER BY m.meeting_date ASC, m.meeting_time ASC`;
    } else if (filter === 'past') {
      query += ` AND m.meeting_date < '${now}' ORDER BY m.meeting_date DESC, m.meeting_time DESC`;
    } else {
      query += ` ORDER BY m.meeting_date DESC, m.meeting_time DESC`;
    }
    
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel a meeting
const cancelMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'UPDATE meetings SET status = "cancelled" WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    res.json({ message: 'Meeting cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper functions
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
}

module.exports = {
  getAvailableSlots,
  createBooking,
  getAllMeetings,
  cancelMeeting
};
