require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import the main server logic
const app = require('./src/backend/server.js');

// If this is being run directly (not imported), start the server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 EAUT Assessment Platform running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
  });
}

module.exports = app;
