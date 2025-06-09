# 🚀 EAUT Assessment Platform - Vercel Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/eaut-assessment-platform)

## 📋 Prerequisites

1. **Database**: You'll need an external PostgreSQL database (Vercel doesn't provide built-in databases)
   - **Recommended Options:**
     - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (Official)
     - [Supabase](https://supabase.com/) (Free tier available)
     - [Railway PostgreSQL](https://railway.app/) (Simple setup)
     - [Neon](https://neon.tech/) (Serverless PostgreSQL)

## 🔧 Environment Variables Setup

After clicking "Deploy with Vercel", you'll need to configure these environment variables:

### Required Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-very-secure-jwt-secret-key-at-least-32-characters-long
```

### Optional Variables (with defaults)
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 Step-by-Step Deployment

### Step 1: Prepare Database

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage → Browse → Create Database
3. Select PostgreSQL
4. Copy the connection string

#### Option B: Supabase (Free Option)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection string
4. Copy the connection string

#### Option C: Railway PostgreSQL
1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the DATABASE_URL from variables

### Step 2: Deploy to Vercel

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/your-username/eaut-assessment-platform
   cd eaut-assessment-platform
   ```

2. **Deploy to Vercel**
   - Option A: Click the "Deploy with Vercel" button above
   - Option B: Use Vercel CLI
     ```bash
     npm i -g vercel
     vercel
     ```

3. **Configure Environment Variables**
   - In Vercel dashboard → Project → Settings → Environment Variables
   - Add all required variables from the list above

### Step 3: Initialize Database

1. **Connect to your database** and run the schema:
   ```sql
   -- Copy and paste the contents of src/database/schema.sql
   ```

2. **Create initial admin user** (optional):
   ```sql
   INSERT INTO users (username, password, email, full_name, role_name, department_id) 
   VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
           'admin@eaut.edu.vn', 'System Administrator', 'System Administrator', 1);
   ```
   Default login: `admin` / `password`

## 🔍 Verification

After deployment:

1. **Check deployment status** in Vercel dashboard
2. **Visit your app** at `https://your-app-name.vercel.app`
3. **Test API health** at `https://your-app-name.vercel.app/api/health`
4. **Login with** admin/password (if you created the admin user)

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify your DATABASE_URL is correct
- Ensure database allows connections from Vercel (check IP whitelist)
- For Supabase: Make sure to use the "connection pooling" URL for production

#### Environment Variables
- Check that all required environment variables are set
- JWT_SECRET must be at least 32 characters long
- DATABASE_URL must include all connection parameters

#### Build Issues
- Ensure all dependencies are in package.json
- Check that the build logs don't show any errors
- Verify that your Node.js version is compatible (>=14.0.0)

### Error Messages

#### "Database connection failed"
```
💥 Initial database connection failed: connection error
```
**Solution**: Check your DATABASE_URL and database server accessibility

#### "JWT secret not configured"
```
❌ JWT_SECRET environment variable is required
```
**Solution**: Set a secure JWT_SECRET in environment variables

#### "Port already in use"
```
Port 3000 is already in use
```
**Solution**: This is normal for Vercel - the platform handles port assignment

## 📱 Post-Deployment Setup

1. **Update CORS settings** if needed
2. **Configure custom domain** (optional)
3. **Set up monitoring** and alerts
4. **Import initial data** through the admin interface

## 🔒 Security Considerations

- Change default admin password immediately
- Use strong JWT_SECRET (32+ characters)
- Configure CORS_ORIGIN for your domain only
- Enable SSL (Vercel provides this automatically)

## 📞 Support

- 📧 **Issues**: Open a GitHub issue
- 📚 **Documentation**: Check `/docs` folder
- 🌐 **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

## Quick Reference

### Environment Variables Template
```env
# Database (Required)
DATABASE_URL=postgresql://username:password@host:port/database

# Security (Required)  
JWT_SECRET=your-very-secure-jwt-secret-key-at-least-32-characters-long

# Optional Configuration
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Schema Location
```
src/database/schema.sql
```

### Default Login
```
Username: admin
Password: password
```

🎉 **Ready to deploy!** Click the button at the top to get started.
