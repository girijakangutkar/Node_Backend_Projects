# 📝 NoteHere - Smart Notes Management System - Frontend

A full-stack note-taking application with role-based access control, allowing users to create, manage, and organize their notes efficiently with secure authentication.

## ✨ Features

### 🎨 User Experience

- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Clean and intuitive interface built with Tailwind CSS
- **Fast Performance** - Optimized React frontend for smooth user interactions
- **Icon Integration** - Beautiful icons powered by Lucide React

## 🛠️ Tech Stack

### Frontend

- **React** - Modern JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautiful and customizable SVG icons
- **Axios** - HTTP client for API requests

### Backend

- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast and minimalist web framework
- **JWT** - JSON Web Tokens for secure authentication
- **bcrypt** - Password hashing library for security

### Database

- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js

### Deployment

- **Vercel** - Frontend deployment and hosting
- **MongoDB Atlas** - Cloud database hosting

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB account or local MongoDB installation
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/notehere-app.git
   cd notehere-app
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the application**

   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend (from frontend directory, in a new terminal)
   npm start
   ```

4. **Access the application**
   - Frontend: `https://notehere.vercel.app`
   - Backend API: `https://noteme-gtbw.onrender.com`

## 📊 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user" // Optional: "user" | "admin" | "moderator"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Notes Endpoints

#### Create Note

```http
POST /api/notes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note"
}
```

#### Get All Notes

```http
GET /api/notes
Authorization: Bearer <jwt_token>
```

#### Update Note

```http
PUT /api/notes/:noteId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Note Title",
  "content": "Updated note content"
}
```

#### Delete Note

```http
DELETE /api/notes/:noteId
Authorization: Bearer <jwt_token>
```

## 🏗️ Project Structure

```
notehere-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── public/
└── README.md
```

## 📱 Screenshots

### Dashboard View

<!-- ![Dashboard](<https://github.com/girijakangutkar/SchoolMgmt/blob/main/Screenshot%20(168).png>) -->

### Login Interface

_Add screenshot of login page_

### Notes Management

_Add screenshot of notes interface_

## 🔒 Security Features

- **Password Encryption** - All passwords are hashed using bcrypt with salt rounds
- **JWT Authentication** - Secure token-based authentication system
- **Input Validation** - Server-side validation for all user inputs
- **CORS Protection** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - API rate limiting to prevent abuse
- **Data Sanitization** - Input sanitization to prevent XSS attacks

## 🌐 Environment Variables

| Variable    | Description           | Required |
| ----------- | --------------------- | -------- |
| `BASE_URI ` | Backend Deployed link | Yes      |

## 👨‍💻 Author

**Girija Kangutkar**

- GitHub: [@girijakangutkar](https://github.com/girijakangutkar)
- Email: girija.kangutkar@gmail.com
