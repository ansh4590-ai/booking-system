# Grand Heritage Hotel Booking System

A full-stack hotel reservation system built with a clean vanilla frontend and a robust Node.js/MongoDB backend.

## Features
- **Guest Room Booking**: Full validation and availability checking.
- **Availability Check**: Real-time room availability verification.
- **Booking Retrieval**: Search by Booking ID, Email, or Phone.
- **Admin Panel**: Manage all reservations (View, Update Status, Delete).
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Double-booking Prevention**: Sophisticated logic to prevent overlapping stays.

## Tech Stack
- **Frontend**: Plain HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **API**: RESTful API using Fetch API

## Project Structure
```
WebDevEndSemProject/
├── backend/
│   ├── models/          # MongoDB/Mongoose Schemas
│   ├── routes/          # Express API Routes
│   ├── server.js        # Main Backend Server
│   └── .env             # Environment Variables
└── frontend/
    ├── css/             # Global Styles
    ├── js/              # Vanilla JS Logic
    └── *.html           # Frontend Pages
```

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) installed and running locally.

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup
1. You can serve the `frontend` folder using any static server.
2. If using VS Code, right-click `frontend/index.html` and select **"Open with Live Server"**.
3. Alternatively, use `npx`:
   ```bash
   npx serve frontend
   ```

## Sample Data
- **Room Types**: Standard, Deluxe, Suite, Family.
- **Status Types**: Pending, Confirmed, Cancelled.

## API Endpoints
- `POST /api/bookings`: Create a new booking
- `GET /api/bookings`: Fetch all bookings
- `GET /api/bookings/search`: Search bookings by ID/Email/Phone
- `GET /api/availability`: Check room availability for specific dates
- `PUT /api/bookings/:id`: Update booking status
- `DELETE /api/bookings/:id`: Remove a booking