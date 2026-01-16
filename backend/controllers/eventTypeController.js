const db = require('../config/database');

// Get all event types
const getAllEventTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM event_types ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get event type by slug
const getEventTypeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.query('SELECT * FROM event_types WHERE slug = ?', [slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create event type
const createEventType = async (req, res) => {
  try {
    const { name, duration, slug, description } = req.body;
    
    if (!name || !duration || !slug) {
      return res.status(400).json({ error: 'Name, duration, and slug are required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO event_types (name, duration, slug, description) VALUES (?, ?, ?, ?)',
      [name, duration, slug, description || '']
    );
    
    const [newEventType] = await db.query('SELECT * FROM event_types WHERE id = ?', [result.insertId]);
    res.status(201).json(newEventType[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Event type with this slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update event type
const updateEventType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, slug, description } = req.body;
    
    const [result] = await db.query(
      'UPDATE event_types SET name = ?, duration = ?, slug = ?, description = ? WHERE id = ?',
      [name, duration, slug, description, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    const [updatedEventType] = await db.query('SELECT * FROM event_types WHERE id = ?', [id]);
    res.json(updatedEventType[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Event type with this slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete event type
const deleteEventType = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM event_types WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    res.json({ message: 'Event type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEventTypes,
  getEventTypeBySlug,
  createEventType,
  updateEventType,
  deleteEventType
};
