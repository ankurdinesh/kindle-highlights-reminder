# Kindle Highlights Reminder

A full-stack application for managing and reviewing your Kindle highlights daily.

## Features

- 📚 Import highlights from CSV or Readwise
- 🔄 Multi-device sync with PostgreSQL backend
- 🎯 Daily review sessions with customizable highlights
- ⭐ Mark highlights as favorites or defer for later
- 🔐 JWT authentication
- 📱 Responsive design with dark mode support

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Router
- Framer Motion

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT authentication
- bcrypt for password hashing

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd kindle-highlights-reminder
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. **Setup Frontend**
```bash
cd daily-highlight
npm install
cp .env.example .env
npm run dev
```

4. **Setup Database**
```bash
# Create database
createdb kindle_highlights

# Run schema
psql kindle_highlights < backend/src/config/schema.sql
```

## Deployment to Render.com

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically detect `render.yaml` and create all services
4. Set the `ALLOWED_ORIGINS` environment variable in the backend service dashboard

### Option 2: Manual Setup

#### Backend API
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `PORT=3001`
     - `DATABASE_URL` (from PostgreSQL service)
     - `JWT_SECRET` (generate a random string)
     - `ALLOWED_ORIGINS` (your frontend URL)

#### PostgreSQL Database
1. Create a new PostgreSQL database on Render
2. Note the connection string
3. Run the schema SQL from `backend/src/config/schema.sql`

#### Frontend
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd daily-highlight && npm install && npm run build`
   - **Publish Directory**: `daily-highlight/dist`
   - **Environment Variables**:
     - `VITE_API_URL` (your backend API URL)

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
DB_HOST=<render-postgres-host>
DB_PORT=5432
DB_NAME=kindle_highlights
DB_USER=<render-postgres-user>
DB_PASSWORD=<render-postgres-password>
JWT_SECRET=<random-secret-key>
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=<your-frontend-url>
```

### Frontend (.env)
```env
VITE_API_URL=<your-backend-api-url>/api
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Highlights
- `GET /api/highlights` - Get all highlights
- `POST /api/highlights` - Bulk create/update
- `PUT /api/highlights/:id` - Update highlight
- `DELETE /api/highlights/:id` - Delete highlight
- `POST /api/highlights/sync` - Sync highlights

### Settings
- `GET /api/highlights/settings` - Get user settings
- `PUT /api/highlights/settings` - Update settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
