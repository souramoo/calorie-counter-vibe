# Calorie Tracker Application

![Calorie Tracker Banner](https://via.placeholder.com/1200x300/4CAF50/FFFFFF?text=Calorie+Tracker+App)

## Overview

Calorie Tracker is a full-stack web application that enables users to track their daily calorie intake and visualize their consumption patterns over time. The application helps users monitor their diet and maintain healthy eating habits.

### Key Features

- **User Authentication**: Secure registration and login system
- **Daily Calorie Tracking**: Add, edit, and delete calorie entries
- **Data Visualization**: View calorie consumption trends through interactive charts
- **Profile Management**: Update personal information and set daily calorie goals
- **Statistics**: Get insights about your calorie consumption patterns
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

### Backend

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Custom validation middleware
- **Security**: Helmet for HTTP headers, bcrypt for password hashing

### Frontend

- **Framework**: React 19
- **Routing**: React Router v7
- **UI Components**: Material-UI v7
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Visualizations**: Recharts
- **Form Handling**: React Hook Form (implied)

## Installation

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Clone the Repository

```bash
git clone <repository-url>
cd calorie-tracker
```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/calorie-tracker
   MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/calorie-tracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

   > **Note**: Replace placeholder values with your actual MongoDB connection string and a secure JWT secret.

4. Set up MongoDB:
   - For local development, ensure MongoDB is running at localhost:27017
   - For production, create a MongoDB Atlas cluster and update the MONGODB_URI_PROD

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

   This will run the server using nodemon for automatic reloading.

2. Start the frontend development server:

   ```bash
   cd frontend
   npm start
   ```

   The frontend will be available at http://localhost:3000

3. For concurrent development (both frontend and backend):
   ```bash
   # From the project root
   npm run dev
   ```

### Production Mode

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend in production mode:
   ```bash
   cd backend
   npm start
   ```

## API Documentation

### Authentication Endpoints

- **POST /api/auth/register**: Register a new user

  - Body: `{ username, email, password }`
  - Returns: JWT token and user object

- **POST /api/auth/login**: Login a user
  - Body: `{ email, password }`
  - Returns: JWT token and user object

### User Endpoints

- **GET /api/users/me**: Get current user's profile

  - Headers: Authorization: Bearer {token}
  - Returns: User object

- **PUT /api/users/me**: Update user profile
  - Headers: Authorization: Bearer {token}
  - Body: `{ username, email, password, calorieGoal }`
  - Returns: Updated user object

### Calorie Endpoints

- **GET /api/calories**: Get all calorie entries for the current user

  - Headers: Authorization: Bearer {token}
  - Query params: startDate, endDate, limit, page
  - Returns: Array of calorie entries with pagination

- **GET /api/calories/:id**: Get a specific calorie entry

  - Headers: Authorization: Bearer {token}
  - Returns: Single calorie entry

- **POST /api/calories**: Create a new calorie entry

  - Headers: Authorization: Bearer {token}
  - Body: `{ date, calories, notes }`
  - Returns: Created calorie entry

- **PUT /api/calories/:id**: Update a calorie entry

  - Headers: Authorization: Bearer {token}
  - Body: `{ date, calories, notes }`
  - Returns: Updated calorie entry

- **DELETE /api/calories/:id**: Delete a calorie entry

  - Headers: Authorization: Bearer {token}
  - Returns: 204 No Content

- **GET /api/calories/stats**: Get calorie statistics
  - Headers: Authorization: Bearer {token}
  - Query params: period (day, week, month, year)
  - Returns: Statistics object

## Deployment Guide

### Backend Deployment (Express.js)

#### Deploying to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app:

   ```bash
   heroku create your-app-name
   ```

3. Add MongoDB add-on or set environment variables for your MongoDB Atlas connection:

   ```bash
   heroku config:set MONGODB_URI_PROD=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_production_jwt_secret
   heroku config:set NODE_ENV=production
   ```

4. Deploy your backend:
   ```bash
   git subtree push --prefix backend heroku main
   ```

#### Deploying to AWS

1. Create an EC2 instance or use Elastic Beanstalk
2. Set up environment variables for production
3. Use PM2 to manage the Node.js process:
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

### Frontend Deployment (React)

#### Deploying to Netlify

1. Build your React app:

   ```bash
   cd frontend
   npm run build
   ```

2. Create a Netlify account and install Netlify CLI
3. Deploy the build folder:

   ```bash
   netlify deploy
   ```

4. Set up environment variables for the production API URL
5. Configure \_redirects or netlify.toml for client-side routing

#### Deploying to Vercel

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy the frontend:
   ```bash
   cd frontend
   vercel
   ```

### Production Considerations

1. **Security**:

   - Use HTTPS for all communications
   - Set secure and SameSite cookies
   - Implement rate limiting for API endpoints
   - Keep dependencies updated

2. **Performance**:

   - Enable gzip compression
   - Implement caching strategies
   - Use a CDN for static assets
   - Optimize frontend bundle size

3. **Monitoring**:

   - Set up logging (e.g., Winston, Morgan)
   - Use monitoring tools (e.g., Sentry, New Relic)
   - Configure alerts for critical errors

4. **Database**:

   - Set up database backups
   - Implement connection pooling
   - Consider sharding for large datasets

5. **Scaling**:
   - Use load balancers for multiple instances
   - Implement horizontal scaling strategies
   - Consider containerization (Docker) and orchestration (Kubernetes)

## Screenshots

![Login Page](https://via.placeholder.com/800x450/3F51B5/FFFFFF?text=Login+Page)
_Login page with form validation_

![Dashboard](https://via.placeholder.com/800x450/00BCD4/FFFFFF?text=Dashboard)
_Main dashboard showing calorie summary and recent entries_

![Add Entry](https://via.placeholder.com/800x450/FFC107/FFFFFF?text=Add+Entry)
_Form for adding new calorie entries_

![Charts](https://via.placeholder.com/800x450/9C27B0/FFFFFF?text=Charts)
_Visualization of calorie consumption over time_

![Profile](https://via.placeholder.com/800x450/E91E63/FFFFFF?text=Profile)
_User profile and settings page_

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
