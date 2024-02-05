require('dotenv').config();
const adminSeed = require('./src/seeders/seedAdmin');
const locationSeed = require('./src/seeders/seedLocation');
const subjectSeed = require('./src/seeders/seedSubject');

const db = require('./src/config/db');

const http = require('http');
const app = require('./app');


const normalizePort = (val) => {
  // Check if the value is a named pipe
  if (val.startsWith('\\\\.\\pipe\\')) {
    return val;
  }
  const port = parseInt(val, 10);
  if (isNaN(port) || port < 0) {
    return 3000; // Default port if the provided value is invalid
  }
  return port;
};
const port = normalizePort(process.env.PORT || '3300');
app.set('port', port);


const server = http.createServer(app);


server.listen(port, () => {

  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  db.once('open', () => {

    console.log('Connected to MongoDB');
    adminSeed.seedAdmin();
    locationSeed.seedLocations();
    subjectSeed.seedSubjects();

  });
  console.log(`listening to the port ${port}`);
})
// // process.on('unhandledRejection', err => {
// //   console.log(err.name, err.message);
// //   console.log("UNHANDLED REJECTION, SHUTTING DOWN....")
// //   serverr.close(() => {
// //     process.exit(1)
// //   })

// })