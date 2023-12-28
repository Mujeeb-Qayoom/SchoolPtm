const bcrypt = require('bcrypt');

module.exports = {// Function to hash a password
  hashPassword: async (password) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  },

  // Function to compare a password with its hash
  comparePassword: async (password, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  }
}
