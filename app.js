const express = require('express');
const app = express();

const userRoutes = require('./src/routes/userRoutes');
const ptmRoutes = require('./src/routes/ptmRoutes');
const ParentRoutes = require('./src/routes/parentRoutes');
const adminRoutes = require('./src/routes/adminRoutes')


const errors = require('./src/middleware/handleErrors')

app.use(errors.handleErrors);
app.use(express.json());

app.use(adminRoutes)
app.use(userRoutes);
app.use(ptmRoutes);
app.use(ParentRoutes);


app.all('*', (req, res, next) => {

    return res.status(404).json({ message: "url not found" });
    next()
})


module.exports = app;
