const express = require('express');
const app = express();

const userRoutes = require('./src/routes/userRoutes');
const ptmRoutes = require('./src/routes/ptmRoutes');
const ParentRoutes = require('./src/routes/parentRoutes');


const errors = require('./src/middleware/handleErrors')

app.use(errors.handleErrors);
app.use(express.json());

app.use(userRoutes);
app.use(ptmRoutes);
app.use(ParentRoutes);


// Create a new user

module.exports = app;
