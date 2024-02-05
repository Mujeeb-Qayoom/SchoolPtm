const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB URI (connection string) from the environment variable
const uriC = process.env.MONGODB_URI_CLOUD;

// Set the database name
const dbName = 'Ptm';

// Connect to MongoDB using Mongoose
async function connectToMongoDB() {
  try {
    await mongoose.connect(uriC, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      dbName: dbName, // Specify the database name
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // You can take appropriate actions here, such as logging, sending an alert, or terminating the application.
    process.exit(1); // Exit the process with a non-zero code to indicate an error.
  }
}

// Call the function to connect to MongoDB
connectToMongoDB();

const db = mongoose.connection;

// Export the Mongoose connection for use in other parts of your application
module.exports = db;
