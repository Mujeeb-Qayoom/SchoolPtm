// errorMiddleware.js
module.exports ={

 handleErrors : (err, req, res, next) => {
   // console.error(err.stack);
  
    // Send a generic error response to the client
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  