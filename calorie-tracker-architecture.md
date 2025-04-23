# Calorie Tracking Application Architecture

## Overview

This document outlines the architecture for a calorie tracking web application with the following key components:

- **Backend**: Express.js
- **Frontend**: React
- **Database**: MongoDB
- **Authentication**: JWT-based
- **Visualization**: Line charts for displaying historical calorie data

The application will enable users to register, log in, track their daily calorie intake, and visualize their calorie consumption over time.

## 1. System Architecture

### High-Level Architecture

```mermaid
flowchart TD
    subgraph "Frontend - React"
    A[App Component] --> B[Auth Components]
    A --> C[Dashboard Component]
    A --> D[Calorie Entry Component]
    A --> E[Visualization Component]
    end

    subgraph "Backend - Express.js"
    F[Auth API] --> J[JWT Service]
    G[User API] --> K[User Service]
    H[Calorie API] --> L[Calorie Service]
    J --> M[(MongoDB)]
    K --> M
    L --> M
    end

    B <--> F
    C <--> G
    C <--> H
    D <--> H
    E <--> H
```

### Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Register/Login
    Frontend->>Backend: Authentication Request
    Backend->>Database: Validate Credentials
    Database-->>Backend: User Data
    Backend-->>Frontend: JWT Token

    User->>Frontend: Enter Calorie Data
    Frontend->>Backend: Submit Calorie Entry (with JWT)
    Backend->>Backend: Validate JWT
    Backend->>Database: Store Calorie Entry
    Database-->>Backend: Confirmation
    Backend-->>Frontend: Success Response

    User->>Frontend: Request Visualization
    Frontend->>Backend: Request Calorie History (with JWT)
    Backend->>Backend: Validate JWT
    Backend->>Database: Query Calorie Data
    Database-->>Backend: Historical Data
    Backend-->>Frontend: Calorie Data JSON
    Frontend->>User: Display Line Chart
```

## 2. Data Models

### User Model

```javascript
{
  _id: ObjectId,
  username: String,  // Required, unique
  email: String,     // Required, unique
  password: String,  // Required (stored hashed)
  calorieGoal: Number, // Optional, daily calorie target
  createdAt: Date,
  updatedAt: Date
}
```

### Calorie Entry Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId,  // Reference to User, required
  date: Date,        // Required
  calories: Number,  // Required
  notes: String,     // Optional
  createdAt: Date,
  updatedAt: Date
}
```

## 3. API Endpoint Specifications

### Authentication Endpoints

#### POST /api/auth/register

- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```
- **Status Codes**:
  - 201: Created
  - 400: Bad Request (validation errors)
  - 409: Conflict (email already exists)

#### POST /api/auth/login

- **Description**: Login an existing user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```
- **Status Codes**:
  - 200: OK
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (invalid credentials)

### User Endpoints

#### GET /api/users/me

- **Description**: Get current user's profile
- **Headers**:
  - Authorization: Bearer {token}
- **Response**:
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "calorieGoal": "number (optional)",
    "createdAt": "date"
  }
  ```
- **Status Codes**:
  - 200: OK
  - 401: Unauthorized (invalid token)

#### PUT /api/users/me

- **Description**: Update current user's profile
- **Headers**:
  - Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "username": "string (optional)",
    "email": "string (optional)",
    "password": "string (optional)",
    "calorieGoal": "number (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "calorieGoal": "number (optional)",
    "updatedAt": "date"
  }
  ```
- **Status Codes**:
  - 200: OK
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (invalid token)
  - 409: Conflict (email already exists)

### Calorie Endpoints

#### POST /api/calories

- **Description**: Create a new calorie entry
- **Headers**:
  - Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "date": "date",
    "calories": "number",
    "notes": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "date": "date",
    "calories": "number",
    "notes": "string (optional)",
    "createdAt": "date"
  }
  ```
- **Status Codes**:
  - 201: Created
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (invalid token)

#### GET /api/calories

- **Description**: Get calorie entries for the current user
- **Headers**:
  - Authorization: Bearer {token}
- **Query Parameters**:
  - startDate: date (optional)
  - endDate: date (optional)
  - limit: number (optional, default 30)
  - page: number (optional, default 1)
- **Response**:
  ```json
  {
    "entries": [
      {
        "id": "string",
        "date": "date",
        "calories": "number",
        "notes": "string (optional)",
        "createdAt": "date"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "pages": "number"
    }
  }
  ```
- **Status Codes**:
  - 200: OK
  - 400: Bad Request (invalid query parameters)
  - 401: Unauthorized (invalid token)

#### GET /api/calories/:id

- **Description**: Get a single calorie entry
- **Headers**:
  - Authorization: Bearer {token}
- **Response**:
  ```json
  {
    "id": "string",
    "date": "date",
    "calories": "number",
    "notes": "string (optional)",
    "createdAt": "date"
  }
  ```
- **Status Codes**:
  - 200: OK
  - 401: Unauthorized (invalid token)
  - 403: Forbidden (not owner of this entry)
  - 404: Not Found

#### PUT /api/calories/:id

- **Description**: Update a calorie entry
- **Headers**:
  - Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "date": "date (optional)",
    "calories": "number (optional)",
    "notes": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "date": "date",
    "calories": "number",
    "notes": "string (optional)",
    "updatedAt": "date"
  }
  ```
- **Status Codes**:
  - 200: OK
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (invalid token)
  - 403: Forbidden (not owner of this entry)
  - 404: Not Found

#### DELETE /api/calories/:id

- **Description**: Delete a calorie entry
- **Headers**:
  - Authorization: Bearer {token}
- **Response Status Codes**:
  - 204: No Content (successful deletion)
  - 401: Unauthorized (invalid token)
  - 403: Forbidden (not owner of this entry)
  - 404: Not Found

#### GET /api/calories/stats

- **Description**: Get calorie statistics for current user
- **Headers**:
  - Authorization: Bearer {token}
- **Query Parameters**:
  - period: string (optional, "day", "week", "month", "year", default "week")
- **Response**:
  ```json
  {
    "dailyAverage": "number",
    "totalEntries": "number",
    "periodTotal": "number",
    "periodAverage": "number",
    "highestDay": {
      "date": "date",
      "calories": "number"
    },
    "lowestDay": {
      "date": "date",
      "calories": "number"
    }
  }
  ```
- **Status Codes**:
  - 200: OK
  - 400: Bad Request (invalid query parameters)
  - 401: Unauthorized (invalid token)

## 4. Database Recommendations

### MongoDB Configuration

- **Database Type**: MongoDB (NoSQL document database)
- **Connection**: Mongoose ODM for schema validation and connection management
- **Collections**:
  - Users
  - CalorieEntries
- **Indexes**:
  - Users collection:
    - email (unique)
    - username (unique)
  - CalorieEntries collection:
    - userId, date (compound index)
    - date (for date range queries)

### Sample Mongoose Schemas

```javascript
// User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    calorieGoal: { type: Number, default: 2000 },
  },
  { timestamps: true }
);

// Calorie Entry Schema
const calorieEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    calories: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// Create compound index
calorieEntrySchema.index({ userId: 1, date: -1 });
```

### Database Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/calorie-tracker
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/calorie-tracker
```

## 5. Authentication Approach

### JWT Authentication

- **Token Generation**: Using jsonwebtoken library
- **Token Storage**: Client-side in localStorage or HTTP-only cookies
- **Token Expiration**: 24 hours (configurable)
- **Token Payload**:
  ```javascript
  {
    "userId": "user's MongoDB _id",
    "iat": "issued at timestamp",
    "exp": "expiration timestamp"
  }
  ```

### Authentication Middleware

```javascript
// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
```

### Security Measures

- Password hashing using bcrypt
- JWT secrets stored in environment variables
- HTTPS for production
- Rate limiting for authentication endpoints
- Input validation and sanitization

## 6. Frontend Components

### Component Architecture

```mermaid
flowchart TD
    A[App] --> B[AuthContext Provider]
    B --> C[Router]
    C --> D[PrivateRoute]
    C --> E[PublicRoute]
    D --> F[Dashboard]
    D --> G[Profile]
    E --> H[Login]
    E --> I[Register]
    F --> J[CalorieSummary]
    F --> K[CalorieEntryForm]
    F --> L[CalorieHistory]
    L --> M[CalorieChart]
```

### Key Components and Responsibilities

#### Core Components

1. **App**

   - Root component
   - Sets up routing and context providers

2. **AuthContext Provider**

   - Manages authentication state
   - Provides login/logout functions
   - Stores and retrieves JWT token

3. **Router & Route Guards**
   - Handles navigation
   - PrivateRoute: Protects authenticated routes
   - PublicRoute: For non-authenticated users (redirects if logged in)

#### Authentication Components

1. **Login**

   - Email/password form
   - Form validation
   - Login API call

2. **Register**
   - Registration form with username, email, password
   - Form validation
   - Registration API call

#### Main Application Components

1. **Dashboard**

   - Main application interface after login
   - Navigation to other sections
   - Quick statistics overview

2. **Profile**

   - User profile information
   - Update user profile
   - Calorie goal setting

3. **CalorieSummary**

   - Daily/weekly calorie statistics
   - Progress towards goal
   - Quick trends

4. **CalorieEntryForm**

   - Form to add new calorie entries
   - Date picker (defaults to current day)
   - Calorie input field
   - Optional notes field

5. **CalorieHistory**

   - Tabular view of calorie entries
   - Filtering options (date range)
   - Edit/delete entries
   - Pagination

6. **CalorieChart**
   - Line chart showing calorie intake over time
   - Date range selector
   - Uses a charting library (e.g., Chart.js, Recharts)
   - Responsive design

### Frontend Libraries and Tools

- **State Management**:

  - React Context API for global state
  - Local component state with useState
  - Forms with React Hook Form

- **API Communication**:

  - Axios for HTTP requests
  - Custom hooks for API calls

- **Styling**:

  - CSS Modules or styled-components
  - Responsive design principles

- **Charting**:

  - Recharts or Chart.js for line charts

- **UI Components**:
  - Material-UI or Bootstrap for base components
  - Custom styled components for app-specific UI

## 7. Project Structure

### Backend Structure

```
/server
├── /config
│   ├── db.js         # Database connection
│   └── passport.js   # Authentication configuration
├── /controllers
│   ├── auth.js       # Authentication logic
│   ├── users.js      # User management logic
│   └── calories.js   # Calorie entries logic
├── /middleware
│   ├── auth.js       # JWT authentication middleware
│   └── validation.js # Input validation
├── /models
│   ├── User.js       # User model schema
│   └── CalorieEntry.js # Calorie entry model schema
├── /routes
│   ├── auth.js       # Authentication routes
│   ├── users.js      # User routes
│   └── calories.js   # Calorie routes
├── /utils
│   ├── errorHandler.js # Error handling
│   └── validators.js   # Input validation helpers
├── .env              # Environment variables
├── server.js         # Express app entry point
└── package.json      # Dependencies
```

### Frontend Structure

```
/client
├── /public
│   ├── index.html    # HTML template
│   └── favicon.ico   # Site favicon
├── /src
│   ├── /components
│   │   ├── /auth
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── /layout
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── /dashboard
│   │   │   ├── CalorieSummary.js
│   │   │   ├── CalorieEntryForm.js
│   │   │   └── CalorieHistory.js
│   │   └── /charts
│   │       └── CalorieChart.js
│   ├── /context
│   │   └── AuthContext.js # Authentication context
│   ├── /hooks
│   │   ├── useAuth.js     # Auth custom hook
│   │   └── useCalories.js # Calorie data hook
│   ├── /services
│   │   ├── api.js         # API setup (axios)
│   │   └── calorieService.js # Calorie API functions
│   ├── /utils
│   │   ├── dateUtils.js   # Date formatting helpers
│   │   └── tokenUtils.js  # JWT token handling
│   ├── App.js            # Main app component
│   ├── index.js          # App entry point
│   └── routes.js         # Routing configuration
├── .env                  # Frontend environment variables
└── package.json         # Dependencies
```

## 8. Development & Deployment Considerations

### Development Environment

- **Node.js**: v16+ recommended
- **npm** or **yarn** for package management
- **nodemon** for backend development
- **create-react-app** for frontend setup
- **concurrently** to run frontend and backend simultaneously
- **dotenv** for environment variables

### Testing Approach

- **Backend Testing**:

  - Jest for unit and integration tests
  - Supertest for API endpoint testing
  - Mongoose memory server for database testing

- **Frontend Testing**:
  - Jest for unit tests
  - React Testing Library for component tests
  - Mock Service Worker for API mocking

### Deployment Options

- **Backend Deployment**:

  - Heroku, Digital Ocean, or AWS for Node.js hosting
  - MongoDB Atlas for database

- **Frontend Deployment**:

  - Netlify or Vercel for React app
  - GitHub Pages as a simpler alternative

- **Full Stack Deployment**:
  - Render or Railway for full-stack JS applications
  - Docker containers for more complex deployments

### Production Considerations

- HTTPS enforcement
- Environment-specific configurations
- Error logging and monitoring
- Rate limiting
- Database backups
- CI/CD pipeline for automated testing and deployment

## 9. Future Enhancements

- Social login (Google, Facebook)
- Food database integration
- Barcode scanning
- Nutritional information (not just calories)
- Meal planning features
- Goal setting and achievement tracking
- Mobile app using React Native
- Progressive Web App capabilities
- Data export functionality
- User activity and achievement badges
