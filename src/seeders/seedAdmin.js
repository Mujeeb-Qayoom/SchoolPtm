
const crypt = require('../functions/bcrypt');
const commonQueries = require('../queries/commonQueries');
const adminQueries = require('../queries/AdminQueries');
// Import your User model

module.exports = {
  seedAdmin: async () => {
    try {
      // Check if an admin user already exists

      const existingAdmin = await commonQueries.findUser('admin');

      if (!existingAdmin) {
        // Create a new admin user
        const hash = await crypt.hashPassword('admin@123')
        const adminData = {
          name: 'admin',
          password: hash, // You should hash passwords in a real scenario
          role: 'admin',
          email: "admin@gmail.com",
          isctive: true,
        };

        const admin = await adminQueries.register(adminData);

        console.log('Admin user seeded successfully.');
      } else {
        console.log('Admin user already exists.');
      }

    }
    catch (error) {
      console.error('Error seeding admin user:', error);
    }
  }
}

