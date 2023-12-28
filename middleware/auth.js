
const jwt = require('jsonwebtoken');


module.exports = {

 generateToken : async (userId) => {
     const newtoken = jwt.sign({user_id :userId.toString()},process.env.JWT_SECRET_KEY,{ expiresIn : '50m'});
    return newtoken;
    },

}   