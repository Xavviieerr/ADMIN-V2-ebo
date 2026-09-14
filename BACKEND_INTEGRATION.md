# Backend Integration Guide

This document outlines the backend integration requirements for the admin dashboard application.

## API Endpoints

The frontend expects the following API endpoints to be implemented:

### Authentication Endpoints

#### POST /auth/login
**Request:**
```json
{
  "email": "admin@example.com",
  "password": "YourPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    }
  }
}
```

#### POST /auth/logout
**Request:** (with Authorization header)
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
**Request:** (with Authorization header)
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Users Endpoints

#### GET /admin/users
**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "gender": "Male",
        "username": "username",
        "avatar": "https://example.com/avatar.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

#### GET /admin/users/:id
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "gender": "Male",
    "username": "username",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /admin/users/email/:email
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "gender": "Male",
    "username": "username",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### GET /admin/users/username/:username
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "gender": "Male",
    "username": "username",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### GET /admin/users/search
**Query Parameters:**
- `q` (required): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "gender": "Male",
        "username": "username",
        "avatar": "https://example.com/avatar.jpg"
      }
    ],
    "total": 5
  }
}
```

#### POST /admin/users
**Request:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "gender": "Female",
  "username": "newusername"
}
```

#### PUT /admin/users/:id
**Request:**
```json
{
  "name": "Updated User",
  "email": "updated@example.com",
  "gender": "Male",
  "username": "updatedusername"
}
```

#### DELETE /admin/users/:id
**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Dashboard Endpoints

#### GET /admin/dashboard
**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 12000,
    "activeUsers": 4627,
    "deletedUsers": 10,
    "topUsers": [
      {
        "id": "user_id",
        "name": "User Name",
        "gender": "Male",
        "days": 371,
        "avatar": "https://example.com/avatar.jpg"
      }
    ],
    "trendingWords": [
      {
        "id": "word_id",
        "word": "Isabato",
        "searches": 87,
        "avatar": "https://example.com/avatar.jpg"
      }
    ],
    "recentUsers": [
      {
        "id": "user_id",
        "name": "Recent User",
        "email": "recent@example.com",
        "avatar": "https://example.com/avatar.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Dictionary Endpoints

#### GET /admin/dictionary
**Query Parameters:**
- `search` (optional): Search term for filtering
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "entry_id",
        "word": "Emu",
        "category": "Dish",
        "description": "A dish refers to a prepared or cooked item of food that is served as part of a meal.",
        "details": "This is a more detailed explanation about Emu as a dish. It can include origin, ingredients, preparation methods, etc."
      }
    ],
    "total": 50
  }
}
```

#### GET /admin/dictionary/:id
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "entry_id",
    "word": "Emu",
    "category": "Dish",
    "description": "A dish refers to a prepared or cooked item of food that is served as part of a meal.",
    "details": "This is a more detailed explanation about Emu as a dish. It can include origin, ingredients, preparation methods, etc."
  }
}
```

#### POST /admin/dictionary
**Request:**
```json
{
  "word": "New Word",
  "category": "Word",
  "description": "Description of the new word",
  "details": "Detailed explanation of the new word"
}
```

#### PUT /admin/dictionary/:id
**Request:**
```json
{
  "word": "Updated Word",
  "category": "Updated Category",
  "description": "Updated description",
  "details": "Updated detailed explanation"
}
```

#### DELETE /admin/dictionary/:id
**Response:**
```json
{
  "success": true,
  "message": "Dictionary entry deleted successfully"
}
```

## Error Handling

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": {
    "field": ["field specific error"]
  }
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Authentication

The frontend uses JWT tokens for authentication. The token should be:
- Included in the `Authorization` header as `Bearer <token>`
- Stored in localStorage on the client side
- Validated on protected endpoints

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_ENABLED=true
```

## CORS Configuration

The backend should allow CORS requests from the frontend domain:

```javascript
// Example CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## Testing the Integration

1. Start your backend server
2. Set the `NEXT_PUBLIC_API_URL` environment variable
3. Run the frontend: `npm run dev`
4. Navigate to `http://localhost:3000/login`
5. Test the login functionality with valid credentials

## Notes

- All API responses should follow the `ApiResponse<T>` interface structure
- Error handling is implemented on the frontend with retry functionality
- Loading states are handled automatically by the custom hooks
- The frontend includes proper TypeScript types for all API interactions
- Search functionality uses dedicated search endpoints for better performance
- Dashboard now includes recent users section for better user management 