const db = require('../config/database');

// Get all availability settings
const getAllAvailability = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM availability ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")');
    res.json(rows);
  } catch (error) {
    console.error('Database error in getAllAvailability:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create or update availability
const upsertAvailability = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, timezone } = req.body;
    
    if (!day_of_week || !start_time || !end_time) {
      return res.status(400).json({ error: 'Day of week, start time, and end time are required' });
    }
    
    // Check if availability exists for this day
    const [existing] = await db.query('SELECT id FROM availability WHERE day_of_week = ?', [day_of_week]);
    
    if (existing.length > 0) {
      // Update existing
      await db.query(
        'UPDATE availability SET start_time = ?, end_time = ?, timezone = ? WHERE day_of_week = ?',
        [start_time, end_time, timezone || 'UTC', day_of_week]
      );
    } else {
      // Insert new
      await db.query(
        'INSERT INTO availability (day_of_week, start_time, end_time, timezone) VALUES (?, ?, ?, ?)',
        [day_of_week, start_time, end_time, timezone || 'UTC']
      );
    }
    
    const [updated] = await db.query('SELECT * FROM availability WHERE day_of_week = ?', [day_of_week]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete availability for a specific day
const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM availability WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Availability not found' });
    }
    
    res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAvailability,
  upsertAvailability,
  deleteAvailability
};
