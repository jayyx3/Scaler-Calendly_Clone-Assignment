-- Create Database
CREATE DATABASE IF NOT EXISTS calendly_clone;
USE calendly_clone;

-- Event Types Table
CREATE TABLE IF NOT EXISTS event_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  duration INT NOT NULL COMMENT 'Duration in minutes',
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Availability Table
CREATE TABLE IF NOT EXISTS availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone VARCHAR(100) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Meetings/Bookings Table
CREATE TABLE IF NOT EXISTS meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type_id INT NOT NULL,
  invitee_name VARCHAR(255) NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  status ENUM('scheduled', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE CASCADE,
  INDEX idx_meeting_datetime (meeting_date, meeting_time),
  INDEX idx_event_type (event_type_id)
);

-- Insert Sample Event Types
INSERT INTO event_types (name, duration, slug, description) VALUES
('15 Minute Meeting', 15, '15-min-meeting', 'Quick 15 minute consultation or catch-up'),
('30 Minute Meeting', 30, '30-min-meeting', 'Standard 30 minute meeting for discussions'),
('Coffee Chat', 30, 'coffee-chat', 'Casual 30 minute coffee chat'),
('1 Hour Consultation', 60, '1-hour-consultation', 'In-depth 1 hour consultation session'),
('Technical Interview', 45, 'technical-interview', '45 minute technical discussion');

-- Insert Sample Availability (Monday to Friday, 9 AM to 5 PM)
INSERT INTO availability (day_of_week, start_time, end_time, timezone) VALUES
('Monday', '09:00:00', '17:00:00', 'UTC'),
('Tuesday', '09:00:00', '17:00:00', 'UTC'),
('Wednesday', '09:00:00', '17:00:00', 'UTC'),
('Thursday', '09:00:00', '17:00:00', 'UTC'),
('Friday', '09:00:00', '17:00:00', 'UTC');

-- Insert Sample Meetings
INSERT INTO meetings (event_type_id, invitee_name, invitee_email, meeting_date, meeting_time, status) VALUES
(1, 'John Doe', 'john@example.com', '2026-01-20', '10:00:00', 'scheduled'),
(2, 'Jane Smith', 'jane@example.com', '2026-01-21', '14:00:00', 'scheduled'),
(3, 'Mike Johnson', 'mike@example.com', '2026-01-15', '11:00:00', 'scheduled'),
(4, 'Sarah Williams', 'sarah@example.com', '2026-01-10', '15:00:00', 'scheduled'),
(2, 'Tom Brown', 'tom@example.com', '2026-01-22', '10:30:00', 'scheduled');
