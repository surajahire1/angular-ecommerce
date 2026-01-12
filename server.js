// server.js - Place in project root (same level as package.json)
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/modern-ecommerce-ui/browser')));

// Handle all Angular routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/modern-ecommerce-ui/browser', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Backend API: https://e-commerce-backend-cscx.onrender.com`);
});