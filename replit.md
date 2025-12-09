# iShunea Backend API (Extended for EasyReserv)

## Overview
This is the backend API for the iShunea project, extended to support EasyReserv website. It's a Node.js/Express server that provides REST endpoints for managing blogs, jobs, services, team members, work portfolio items, offers/pricing plans, and customizable contact forms. The application uses MongoDB Atlas for data storage and supports file uploads for images.

**Current Status:** ✅ Running and connected to MongoDB Atlas
**Project:** Romanian-language EasyReserv website support

## Project Architecture

### Tech Stack
- **Runtime:** Node.js v20.19.3
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT with bcrypt password hashing
- **File Upload:** Multer + Cloudflare R2 (S3-compatible storage)
- **Email Notifications:** Nodemailer with SMTP
- **Dependencies:** cors, dotenv, mongoose, mongoose-sequence, uuid, bcryptjs, jsonwebtoken, @aws-sdk/client-s3, nodemailer

### Project Structure
```
.
├── server.js              # Main server entry point
├── db.js                  # MongoDB connection configuration
├── r2-client.js           # Cloudflare R2 storage client configuration
├── emailService.js        # Email notification service (Nodemailer)
├── handleImage.js         # Image upload handling utilities (R2 + local fallback)
├── handleFiles.js         # File handling utilities
├── enpoints/              # API route handlers
│   ├── auth.js           # Authentication endpoints
│   ├── blogs.js          # Blog CRUD operations
│   ├── custom-forms.js   # Custom forms and submissions
│   ├── forms.js          # Form submissions
│   ├── jobs.js           # Job postings
│   ├── offers.js         # Offers/pricing plans
│   ├── services.js       # Services management
│   ├── team.js           # Team members
│   └── works.js          # Portfolio works
├── middleware/            # Express middleware
│   └── auth.js           # JWT authentication middleware
├── schemas/               # Mongoose schemas
│   ├── blog.js
│   ├── custom-form.js    # Dynamic form definitions
│   ├── email-notification.js
│   ├── form-alert.js
│   ├── form-call.js
│   ├── form-job.js
│   ├── form-submission.js # Form submission tracking
│   ├── job.js
│   ├── offer.js          # Offers/pricing plans
│   ├── service.js
│   ├── team.js
│   ├── user.js           # User authentication schema
│   └── work.js
└── images/                # Static file storage
    ├── blogs/
    ├── offers/           # Offer images
    ├── services/
    ├── team/
    └── work/
```

## Configuration

### Environment Variables (Secrets)
- **MONGO_DB**: MongoDB Atlas connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=appname`
  - IP Whitelist: 0.0.0.0/0 (allows Replit dynamic IPs)
- **JWT_SECRET**: Secret key for JWT token signing and verification
  - Used for authentication token security
  - Should be a long, random, complex string
- **CLOUDFLARE_R2_ACCOUNT_ID**: Cloudflare account ID for R2 storage
- **CLOUDFLARE_R2_ACCESS_KEY_ID**: R2 Access Key ID
- **CLOUDFLARE_R2_SECRET_ACCESS_KEY**: R2 Secret Access Key
- **R2_BUCKET_NAME** (optional): R2 bucket name (default: `easyreservwebsiteb2b`)
- **R2_PUBLIC_URL** (optional): Public URL for R2 bucket (default: `https://d59ebf7a7ec395a225e24368d8355f1d.r2.cloudflarestorage.com/easyreservwebsiteb2b`)
- **EMAIL_HOST**: SMTP server hostname (e.g., mail.ishunea.io)
- **EMAIL_PORT**: SMTP port (default: 465 for SSL/TLS)
- **EMAIL_USER**: Email address for sending notifications
- **EMAIL_PASSWORD**: SMTP password for authentication

### Server Configuration
- **Port:** 5000 (configurable via SERVER_PORT env variable)
- **Host:** 0.0.0.0 (required for Replit environment)
- **CORS:** Enabled for all origins
- **Production URL:** https://business.easyreserv.io/api

## API Endpoints

### Authentication
- `POST /api/account/register` - Register new user
  - Request body: `{ email, password, role }` (role optional, defaults to 'user')
  - Response: `{ serviceToken, user: { id, email, role, createdAt } }`
- `POST /api/account/login` - User login
  - Request body: `{ email, password }`
  - Response: `{ serviceToken, user: { id, email, role, createdAt } }`
- `GET /api/account/me` - Get current user (protected route)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ user: { id, email, role, createdAt } }`

### Blogs
- `POST /blogs` - Create new blog (supports R2 image upload)
  - Images automatically uploaded to Cloudflare R2 if configured
  - Falls back to local storage if R2 credentials missing
- `GET /blogs` - Get all blogs
- `GET /blogs/tags` - Get unique blog tags
- `GET /blogs/:id` - Get blog by ID
- `GET /admin/blogs/list` - Get blog list for admin
- `GET /admin/edit/blogs/:id` - Get blog for editing
- `PUT /admin/edit/blogs/:id` - Update blog (supports R2 image upload)

### Jobs
- Similar CRUD operations for job postings

### Services
- Similar CRUD operations for services

### Team
- Similar CRUD operations for team members

### Works
- Similar CRUD operations for portfolio works

### Forms
- Form submission endpoints for contact/applications

### Offers (EasyReserv)
- `POST /offers` - Create new offer/pricing plan
  - Request body: `{ id, title, description, price, currency, features, status, ctaLabel, ctaLink, ... }`
  - Response: `{ message, offer: {...} }`
- `GET /offers` - Get all offers
  - Query params: `?status=active` (optional filter)
  - Response: Array of offers
- `GET /offers/:id` - Get offer by ID
  - Response: Offer object or 404
- `PUT /offers/:id` - Update offer
  - Request body: Partial offer data
  - Response: `{ message, offer: {...} }`
- `DELETE /offers/:id` - Delete offer
  - Response: `{ message }`

### Custom Forms (EasyReserv)
- `POST /custom-forms` - Create custom form definition
  - Request body: `{ id, name, title, description, fields: [...], submitButtonText, successMessage, status }`
  - Fields support: text, email, phone, number, textarea, select, checkbox, radio, date, file
  - Response: `{ message, form: {...} }`
- `GET /custom-forms` - Get all custom forms
  - Query params: `?status=active` (optional filter)
  - Response: Array of forms
- `GET /custom-forms/:id` - Get form by ID
  - Response: Form object or 404
- `PUT /custom-forms/:id` - Update form definition
  - Request body: Partial form data
  - Response: `{ message, form: {...} }`
- `DELETE /custom-forms/:id` - Delete form
  - Response: `{ message }`
- `POST /custom-forms/:formId/submit` - Submit form data
  - Request body: Form field values
  - Supports file uploads via multipart/form-data
  - **Sends automatic email notification** to configured email address with submission details
  - Response: `{ message: <customSuccessMessage>, submissionId }`
- `GET /custom-forms/:formId/submissions` - Get all submissions for a form
  - Response: Array of submissions with data, files, IP, user agent, status, timestamp

## Deployment Notes

### Environment URLs
- **Development (Replit):** Dynamic Replit URL (port 5000)
- **Production:** https://business.easyreserv.io/api

### Infrastructure
- Database: MongoDB Atlas with 0.0.0.0/0 IP access (required for Replit)
- **Image Storage**: Cloudflare R2 (primary) with local fallback
  - Blog images uploaded to R2 bucket: `easyreservwebsiteb2b/blogs/`
  - Public URL format: `https://d59ebf7a7ec395a225e24368d8355f1d.r2.cloudflarestorage.com/easyreservwebsiteb2b/blogs/{uuid}.jpg`
  - Falls back to local `/images` directory if R2 credentials not configured
- Static files served from `/images` directory (legacy/fallback)
- File uploads handled via Multer with UUID naming

### Production Deployment
- Target URL: **https://business.easyreserv.io/api**
- All API endpoints will be prefixed with `/api`
- CORS configured to accept all origins
- Recommended deployment: Replit Autoscale (stateless API architecture)

## Recent Changes
- **2025-10-22**: Added email notification system for contact forms
  - **Email Notifications**: Automatic email alerts when users submit contact forms
    - Created emailService.js with Nodemailer configuration
    - Integrated SMTP with mail.ishunea.io server (port 465, SSL/TLS)
    - Professional HTML email templates with submission details
    - Non-blocking async email sending (doesn't delay form response)
    - Graceful fallback if email credentials not configured
    - Secure TLS certificate validation enabled
  - Updated custom-forms endpoint to trigger email notifications on submission
  - Added EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD environment variables
  - Tested successfully with live SMTP server
  
- **2025-10-17**: Integrated Cloudflare R2 for blog image storage
  - **R2 Storage Integration**: All blog images now uploaded to Cloudflare R2
    - Created r2-client.js for S3-compatible R2 client configuration
    - Updated handleImage.js with uploadToR2 function and memory storage for R2
    - Modified blogs endpoints to use R2 upload with automatic fallback to local storage
    - Images stored in R2 bucket path: `blogs/{uuid}.{ext}`
    - Public URLs: `https://d59ebf7a7ec395a225e24368d8355f1d.r2.cloudflarestorage.com/easyreservwebsiteb2b/blogs/...`
    - Graceful fallback to local storage if R2 credentials missing
  - Added @aws-sdk/client-s3 for S3-compatible API
  - Tested successfully with multiple image uploads
  
- **2025-10-17**: Extended for EasyReserv website
  - **Offers Management System**: Created complete CRUD API for pricing plans/offers
    - Offer schema with id, title, description, price, currency, features array, status, CTA buttons
    - Image upload support for offer images (stored in /images/offers)
    - Filter by status (active/inactive)
    - Full CRUD: POST, GET (all/by-id), PUT, DELETE
  - **Custom Forms System**: Built flexible, customizable contact forms
    - CustomForm schema with dynamic field definitions (9 field types: text, email, phone, number, textarea, select, checkbox, radio, date, file)
    - FormSubmission schema tracking submissions with data, files, IP address, user agent, status
    - Admin endpoints: Create, read, update, delete form definitions
    - Public endpoint: Submit form with file upload support
    - Custom success messages per form
    - Submissions listing with full metadata
  - Added /offers and /custom-forms routes to server.js
  - Tested all endpoints successfully via curl
  
- **2025-10-17**: Added authentication system
  - Implemented JWT-based authentication with bcrypt password hashing
  - Created User schema with email, password, and role fields
  - Added authentication endpoints: /api/account/register, /api/account/login, /api/account/me
  - Created JWT middleware for protecting routes
  - Configured JWT_SECRET for token security

- **2024-10-16**: Initial Replit setup
  - Configured MongoDB Atlas connection
  - Set up workflow to run backend server
  - Configured server to bind to localhost:3000
  - Added IP whitelist 0.0.0.0/0 to MongoDB Atlas for Replit access

## User Preferences
- Communication in Romanian language
- Backend designed for EasyReserv website (Romanian market)
- Prefer autoscale deployment for stateless API architecture
