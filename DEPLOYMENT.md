# Deployment Guide

## Prerequisites
- MySQL database (use PlanetScale, Railway, or any MySQL hosting service)
- Vercel account

## Step 1: Setup MySQL Database

### Option A: PlanetScale (Recommended - Free Tier)
1. Go to [PlanetScale](https://planetscale.com/)
2. Create a free account
3. Create a new database
4. Import the schema from `backend/config/schema.sql`
5. Get the connection credentials

### Option B: Railway
1. Go to [Railway](https://railway.app/)
2. Create a MySQL database
3. Import the schema
4. Get connection details

### Option C: AWS RDS / DigitalOcean / etc.
Use any MySQL hosting provider and import the schema.

## Step 2: Deploy Backend to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel Dashboard:
   - Go to your project settings
   - Add these environment variables:
     - `DB_HOST`: Your MySQL host
     - `DB_USER`: Your MySQL username
     - `DB_PASSWORD`: Your MySQL password
     - `DB_NAME`: calendly_clone
     - `PORT`: 5000

5. Redeploy after setting env vars:
```bash
vercel --prod
```

6. Note your backend URL (e.g., `https://your-backend.vercel.app`)

## Step 3: Deploy Frontend to Vercel

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Update `.env.production` with your backend URL:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

3. Deploy:
```bash
vercel --prod
```

4. Your frontend will be live at the provided URL

## Step 4: Test Your Deployment

1. Visit your frontend URL
2. Test all features:
   - Create event types
   - Set availability
   - Book a meeting
   - View meetings

## Alternative: Deploy Both on Railway

If you prefer to deploy both frontend and backend on Railway:

1. Create a Railway account
2. Create a new project
3. Add MySQL service
4. Add backend service (connect to GitHub repo)
5. Add frontend service (connect to GitHub repo)
6. Set environment variables
7. Deploy

## Troubleshooting

### CORS Issues
If you face CORS issues, update the backend CORS configuration to whitelist your frontend domain.

### Database Connection
Ensure your database is accessible from Vercel's servers. Some hosting providers require IP whitelisting.

### Environment Variables
Make sure all environment variables are properly set in your deployment platform.

## Post-Deployment Checklist

- [ ] Backend is live and responding to API calls
- [ ] Frontend is live and can connect to backend
- [ ] Database is populated with sample data
- [ ] Event types can be created
- [ ] Availability can be set
- [ ] Bookings can be made
- [ ] Meetings can be viewed and cancelled
- [ ] No console errors in browser
- [ ] All routes are working

## GitHub Repository Setup

1. Create a new GitHub repository
2. Initialize git in your project:
```bash
git init
git add .
git commit -m "Initial commit: Calendly Clone"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

3. Make sure the repository is **public** as per requirements

## Submission

Submit both:
1. GitHub repository URL (public)
2. Deployed application URL (frontend)

Example:
- GitHub: `https://github.com/yourusername/calendly-clone`
- Live App: `https://your-calendly-clone.vercel.app`
