# Calorie Tracker Backend

This is the Express.js backend for the calorie tracking application.

## Features

- User authentication with JWT
- User profile management
- CRUD operations for calorie entries
- Statistics and reporting features
- MongoDB integration with Mongoose
- Input validation and error handling

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file based on the provided example
   - Update the MongoDB connection string and JWT secret

### Running the Application

#### Development mode

```
npm run dev
```

#### Production mode

```
npm start
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user

### User Endpoints

- `GET /api/users/me` - Get current user's profile
- `PUT /api/users/me` - Update current user's profile

### Calorie Endpoints

- `POST /api/calories` - Create a new calorie entry
- `GET /api/calories` - Get calorie entries with optional filtering
- `GET /api/calories/:id` - Get a single calorie entry
- `PUT /api/calories/:id` - Update a calorie entry
- `DELETE /api/calories/:id` - Delete a calorie entry
- `GET /api/calories/stats` - Get calorie statistics

## Project Structure

```
backend/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # Express routes
├── utils/          # Utility functions
├── .env            # Environment variables
├── package.json    # Project dependencies
├── README.md       # Project documentation
└── server.js       # Application entry point
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Input validation and sanitization
- Protected routes
- Error handling
