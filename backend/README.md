# Kindle Highlights Backend API

Custom Node.js + Express + PostgreSQL backend for the Kindle Highlights Reminder app.

## Features

- ✅ User authentication (JWT)
- ✅ Highlights CRUD operations
- ✅ Sync endpoint for multi-device support
- ✅ User settings management
- ✅ PostgreSQL database with proper indexing
- ✅ Secure password hashing (bcrypt)
- ✅ CORS, Helmet, Compression middleware
- ✅ TypeScript for type safety

## Setup Instructions

### 1. Install PostgreSQL

**Mac (with Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE kindle_highlights;
CREATE USER kindle_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kindle_highlights TO kindle_user;

# Connect to the database
\c kindle_highlights

# Grant schema privileges
GRANT ALL ON SCHEMA public TO kindle_user;

\q
```

### 3. Run Database Schema

```bash
psql -U kindle_user -d kindle_highlights -f src/config/schema.sql
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=kindle_highlights
DB_USER=kindle_user
DB_PASSWORD=your_secure_password

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

**⚠️ IMPORTANT:** Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### 7. Test the API

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Register a User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (requires auth)

### Highlights
- `GET /api/highlights` - Get all highlights
- `GET /api/highlights?status=new` - Filter by status
- `POST /api/highlights` - Bulk create/update highlights
- `PUT /api/highlights/:id` - Update single highlight
- `DELETE /api/highlights/:id` - Delete highlight
- `POST /api/highlights/sync` - Sync highlights across devices

### Settings
- `GET /api/highlights/settings` - Get user settings
- `PUT /api/highlights/settings` - Update user settings

## Authentication

All highlight endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## Production Deployment

### Option 1: Railway.app (Recommended)
1. Push code to GitHub
2. Connect Railway to your repo
3. Add PostgreSQL service
4. Set environment variables
5. Deploy!

### Option 2: Heroku
```bash
heroku create kindle-highlights-api
heroku addons:create heroku-postgresql:mini
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Option 3: DigitalOcean App Platform
1. Create new app
2. Connect GitHub repo
3. Add managed PostgreSQL database
4. Configure environment variables
5. Deploy

## Database Schema

### users
- `id` - Primary key
- `email` - Unique, not null
- `password_hash` - Hashed password
- `readwise_token` - Optional Readwise API token
- `created_at`, `updated_at` - Timestamps

### highlights
- `id` - Primary key
- `user_id` - Foreign key to users
- `external_id` - External ID (Readwise/CSV)
- `text` - Highlight content
- `book_title` - Book title
- `author` - Book author
- `status` - new | done | favorite | deferred
- `deferred_until` - Timestamp for deferred highlights
- `source` - csv | readwise
- `imported_at`, `updated_at` - Timestamps

### user_settings
- `user_id` - Primary key, foreign key to users
- `highlights_per_day` - Default 3
- `last_csv_upload` - Last CSV upload timestamp
- `sync_method` - csv | readwise
- `created_at`, `updated_at` - Timestamps

## Security

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens for stateless authentication
- ✅ Helmet.js for security headers
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configured
- ✅ Request size limits (10mb)

## Troubleshooting

**Database connection error:**
```bash
# Check PostgreSQL is running
brew services list  # Mac
sudo systemctl status postgresql  # Linux

# Test connection
psql -U kindle_user -d kindle_highlights
```

**Port already in use:**
```bash
# Change PORT in .env or kill process
lsof -ti:3001 | xargs kill -9
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations

## Next Steps

1. ✅ Backend is ready!
2. Update frontend to use API
3. Add login/register pages
4. Implement API calls for highlights
5. Add offline support with localStorage fallback

---

Built with ❤️ for Kindle Highlights Reminder
