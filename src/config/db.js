const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB URI (connection string) from the environment variable
const uri = process.env.MONGODB_URI;

// Set the database name
const dbName = 'Ptm';

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName, // Specify the database name
});

const db = mongoose.connection


// Export the Mongoose connection for use in other parts of your application
module.exports = db;              