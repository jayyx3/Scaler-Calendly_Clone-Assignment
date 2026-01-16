# Calendly Clone - Scheduling Platform

A full-stack scheduling and booking web application that replicates Calendly's core functionality. Built with React.js, Node.js/Express, and MySQL.

![Calendly Clone](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)

## 🚀 Live Demo

- **Frontend:** [Link to your deployed frontend]
- **Backend:** [Link to your deployed backend]

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Assumptions](#assumptions)

## ✨ Features

### 1. Event Types Management
- ✅ Create event types with name, duration (in minutes), and URL slug
- ✅ Edit and delete existing event types
- ✅ List all event types on the scheduling page
- ✅ Each event type has a unique public booking link

### 2. Availability Settings
- ✅ Set available days of the week (e.g., Monday to Friday)
- ✅ Set available time slots for each day (e.g., 9:00 AM - 5:00 PM)
- ✅ Set timezone for the availability schedule

### 3. Public Booking Page
- ✅ Month calendar view to select a date
- ✅ Display available time slots for the selected date
- ✅ Booking form to collect invitee's name and email
- ✅ Prevent double booking of the same time slot
- ✅ Booking confirmation page with meeting details

### 4. Meetings Page
- ✅ View upcoming meetings
- ✅ View past meetings
- ✅ Cancel a meeting

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js 18.2.0 (Single Page Application)
- **Styling:** Tailwind CSS 3.3.6
- **Routing:** React Router DOM 6.20.1
- **HTTP Client:** Axios 1.6.2

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.18.2
- **Database:** MySQL 2 (mysql2 package)
- **Additional:** CORS, dotenv, body-parser

### Database
- **MySQL** with custom schema design

## 📁 Project Structure

```
Scaler Calendly_Clone Assignment/
├── backend/
│   ├── config/
│   │   ├── database.js          # Database connection configuration
│   │   └── schema.sql            # Database schema and seed data
│   ├── controllers/
│   │   ├── eventTypeController.js    # Event types logic
│   │   ├── availabilityController.js # Availability logic
│   │   └── bookingController.js      # Booking logic
│   ├── routes/
│   │   ├── eventTypes.js        # Event types routes
│   │   ├── availability.js      # Availability routes
│   │   └── bookings.js          # Booking routes
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── EventTypes.js    # Event types management
│   │   │   ├── Availability.js  # Availability settings
│   │   │   ├── BookingPage.js   # Public booking page
│   │   │   └── Meetings.js      # Meetings list
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js               # Main app component
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles with Tailwind
│   ├── .gitignore
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/jayyx3/Scaler-Calendly_Clone-Assignment.git
cd Scaler-Calendly_Clone-Assignment
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=calendly_clone
# PORT=5000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional, for custom API URL)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## 🗄 Database Setup

### Option 1: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source backend/config/schema.sql
```

### Option 2: Using MySQL Workbench or phpMyAdmin

1. Open MySQL Workbench or phpMyAdmin
2. Create a new database named `calendly_clone`
3. Import and execute the SQL file: `backend/config/schema.sql`

### Database Schema

The application uses the following tables:

**event_types**
- id (INT, Primary Key)
- name (VARCHAR)
- duration (INT) - in minutes
- slug (VARCHAR, Unique)
- description (TEXT)
- created_at, updated_at (TIMESTAMP)

**availability**
- id (INT, Primary Key)
- day_of_week (ENUM)
- start_time (TIME)
- end_time (TIME)
- timezone (VARCHAR)
- created_at, updated_at (TIMESTAMP)

**meetings**
- id (INT, Primary Key)
- event_type_id (INT, Foreign Key)
- invitee_name (VARCHAR)
- invitee_email (VARCHAR)
- meeting_date (DATE)
- meeting_time (TIME)
- status (ENUM: scheduled, cancelled)
- created_at, updated_at (TIMESTAMP)

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serves static files from build/ directory
```

## 📚 API Documentation

### Event Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/event-types` | Get all event types |
| GET | `/api/event-types/:slug` | Get event type by slug |
| POST | `/api/event-types` | Create new event type |
| PUT | `/api/event-types/:id` | Update event type |
| DELETE | `/api/event-types/:id` | Delete event type |

### Availability

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability` | Get all availability settings |
| POST | `/api/availability` | Create/update availability |
| DELETE | `/api/availability/:id` | Delete availability |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/slots?date=YYYY-MM-DD&eventTypeId=1` | Get available time slots |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/meetings?filter=upcoming` | Get meetings (filter: upcoming/past) |
| PUT | `/api/bookings/meetings/:id/cancel` | Cancel a meeting |

### Example API Requests

**Create Event Type:**
```json
POST /api/event-types
{
  "name": "30 Minute Meeting",
  "duration": 30,
  "slug": "30-min-meeting",
  "description": "Standard 30 minute meeting"
}
```

**Create Availability:**
```json
POST /api/availability
{
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "17:00",
  "timezone": "UTC"
}
```

**Create Booking:**
```json
POST /api/bookings
{
  "event_type_id": 1,
  "invitee_name": "John Doe",
  "invitee_email": "john@example.com",
  "meeting_date": "2026-01-20",
  "meeting_time": "10:00:00"
}
```

## 🌐 Deployment

### Backend Deployment (Vercel)

1. Create `vercel.json` in the backend directory (already included)
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy:
```bash
cd backend
vercel --prod
```
4. Set environment variables in Vercel dashboard:
   - DB_HOST
   - DB_USER
   - DB_PASSWORD
   - DB_NAME

### Frontend Deployment (Vercel)

1. Update `REACT_APP_API_URL` in frontend/.env with your backend URL
2. Deploy:
```bash
cd frontend
vercel --prod
```

### Alternative Deployment Options
- **Railway:** For both frontend and backend
- **Render:** Free tier available
- **Netlify:** For frontend
- **Heroku:** For backend with ClearDB MySQL

## 📝 Assumptions

1. **No Authentication:** The application assumes a default user is always logged in for the admin side (event types, availability, meetings management). The public booking page is accessible without login.

2. **Timezone:** Default timezone is set to UTC. Users can select from predefined timezones in the availability settings.

3. **Sample Data:** The database is seeded with sample event types, availability (Monday-Friday, 9 AM - 5 PM), and a few sample meetings for demonstration purposes.

4. **Validation:** 
   - Event duration must be at least 15 minutes
   - Time slots are generated based on event duration
   - Double booking prevention is implemented at the backend level

5. **UI/UX:** The design closely follows Calendly's interface patterns with a clean, modern look using Tailwind CSS.

6. **Meeting Duration:** All time slots are based on the event type's duration. For example, a 30-minute meeting will show available slots every 30 minutes within the configured availability window.

7. **Database Connection:** The application assumes a local or remote MySQL database is accessible with the credentials provided in the .env file.

8. **CORS:** The backend is configured to accept requests from any origin for development. In production, this should be restricted to your frontend domain.

## 🎨 UI Design

The application features a clean, modern interface that closely resembles Calendly's design:

- **Color Scheme:** Blue primary color (#0ea5e9) with gray accents
- **Typography:** System fonts for optimal readability
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements:** Hover states, transitions, and loading indicators
- **Calendar View:** Intuitive month calendar for date selection
- **Form Design:** Clean, well-spaced forms with validation

## 🧪 Testing

To test the application:

1. **Event Types:** Create, edit, and delete different event types
2. **Availability:** Set your available days and times
3. **Booking:** Visit `/book/{slug}` to test the booking flow
4. **Meetings:** View and cancel upcoming meetings

## 📧 Support

For issues or questions, please open an issue in the GitHub repository.

## 📄 License

This project is created as an assignment for Scaler's SDE Intern position.

---

**Note:** This is a demonstration project created for educational purposes as part of a fullstack developer assignment.
