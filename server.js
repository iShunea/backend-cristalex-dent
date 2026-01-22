require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const path = require('path');

const blogPostsRoutes = require('./enpoints/blog-posts');
const teamMembersRoutes = require('./enpoints/team-members');
const testimonialsRoutes = require('./enpoints/testimonials');
const socialMediaPostsRoutes = require('./enpoints/social-media-posts');
const servicesNewRoutes = require('./enpoints/services-new');
const beforeAfterRoutes = require('./enpoints/before-after');
const galleryMediaRoutes = require('./enpoints/gallery-media');

const formsRoutes = require('./enpoints/forms');
const authRoutes = require('./enpoints/auth');
const customFormsRoutes = require('./enpoints/custom-forms');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5000',
      'http://localhost:3000',
      'http://localhost:3060',
      'http://localhost:5173',
      'https://backend-cristalex-dent.onrender.com'
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // For development, allow all origins
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());

connectDB();

app.use('/api', blogPostsRoutes);
app.use('/api', teamMembersRoutes);
app.use('/api', testimonialsRoutes);
app.use('/api', socialMediaPostsRoutes);
app.use('/api', servicesNewRoutes);
app.use('/api', beforeAfterRoutes);
app.use('/api', galleryMediaRoutes);

app.use('/api', formsRoutes);
app.use('/api', authRoutes);
app.use('/api', customFormsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.SERVER_PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
