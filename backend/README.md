# CareerLink Backend API

RESTful API for CareerLink - A job and experience sharing platform built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your MongoDB Atlas connection string and JWT secret.

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:5000`.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/careerlink` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login and get JWT token |
| GET | `/api/auth/me` | 🔐 | Get current user profile |

### Jobs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | ❌ | List all jobs (with filters) |
| GET | `/api/jobs/:id` | ❌ | Get single job |
| GET | `/api/jobs/my` | 🔐 | Get jobs posted by current user |
| POST | `/api/jobs` | 🔐 | Create a new job |
| PUT | `/api/jobs/:id` | 🔐 | Update job (owner/admin only) |
| DELETE | `/api/jobs/:id` | 🔐 | Delete job (owner/admin only) |

**Query Parameters for GET /api/jobs:**
- `search` - Search by title or company (partial, case-insensitive)
- `jobType` - Filter by job type: `Full-time`, `Part-time`, `Contract`, `Internship`
- `location` - Filter by location (partial, case-insensitive)
- `skills` - Filter by skills (partial, case-insensitive)

**Example:**
```
GET /api/jobs?search=Engineer&jobType=Full-time&location=NYC&skills=Python
```

### Experiences

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/experiences` | ❌ | List all experiences (with filters) |
| GET | `/api/experiences/:id` | ❌ | Get single experience |
| GET | `/api/experiences/my` | 🔐 | Get experiences posted by current user |
| POST | `/api/experiences` | 🔐 | Create a new experience |
| PUT | `/api/experiences/:id` | 🔐 | Update experience (owner/admin only) |
| DELETE | `/api/experiences/:id` | 🔐 | Delete experience (owner/admin only) |

**Query Parameters for GET /api/experiences:**
- `search` - Search by title or company (partial, case-insensitive)
- `type` - Filter by type: `Intern`, `Interview`, `Full-time`, `Contract`, `Volunteer`

### Saved Items

All saved routes require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved/jobs` | Get saved jobs |
| POST | `/api/saved/jobs/:jobId` | Save a job |
| DELETE | `/api/saved/jobs/:jobId` | Unsave a job |
| GET | `/api/saved/jobs/:jobId/check` | Check if job is saved |
| GET | `/api/saved/experiences` | Get saved experiences |
| POST | `/api/saved/experiences/:expId` | Save an experience |
| DELETE | `/api/saved/experiences/:expId` | Unsave an experience |
| GET | `/api/saved/experiences/:expId/check` | Check if experience is saved |

## Data Models

### User
```javascript
{
  email: String,      // unique, required
  password: String,   // hashed, required
  name: String,       // required
  role: 'admin' | 'user',  // default: 'user'
  createdAt: Date,
  updatedAt: Date
}
```

### Job
```javascript
{
  title: String,           // required
  company: String,         // required
  location: String,        // required
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship',
  salaryMin: Number,
  salaryMax: Number,
  description: String,     // required
  responsibilities: String,
  qualifications: String,
  skills: String,          // comma-separated
  deadline: Date,
  link: String,            // job application URL
  postedBy: ObjectId,      // ref: User
  createdAt: Date,
  updatedAt: Date
}
```

### Experience
```javascript
{
  title: String,           // required
  company: String,         // required
  type: 'Intern' | 'Interview' | 'Full-time' | 'Contract' | 'Volunteer',
  content: String,         // required
  duration: String,
  rating: Number,          // 1-5
  postedBy: ObjectId,      // ref: User
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

1. Register or login to get a token
2. Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your-token>
   ```

## Error Responses

```javascript
// 400 Bad Request
{ "message": "Validation error message" }

// 401 Unauthorized
{ "message": "Not authorized, no token provided" }

// 403 Forbidden
{ "message": "Not authorized to modify this resource" }

// 404 Not Found
{ "message": "Resource not found" }

// 500 Server Error
{ "message": "Something went wrong!" }
```

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── jobController.js
│   ├── experienceController.js
│   └── savedController.js
├── middleware/
│   └── auth.js               # JWT verification
├── models/
│   ├── User.js
│   ├── Job.js
│   ├── Experience.js
│   ├── SavedJob.js
│   └── SavedExperience.js
├── routes/
│   ├── auth.js
│   ├── jobs.js
│   ├── experiences.js
│   └── saved.js
├── .env                      # Environment variables (create from env.example)
├── .gitignore
├── env.example               # Example environment variables
├── package.json
├── README.md
└── server.js                 # Entry point
```

