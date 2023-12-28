require('../config/db');
const crypt = require('../functions/bcrypt');
const dbQuries = require('../models/dbQueries'); // Import your database queries module
const { db } = require('../models/teacherAttributesModel');

module.exports = {

 seedTeachers : async () => {
  try {
     
    const existingTeachers = await dbQuries.findUser('teacher');

if(!existingTeachers)
    {
    
    // Generate 10 teachers
    for (let i = 1; i <= 10; i++) {
      const hashedPassword = await crypt.hashPassword(`teacher${i}`, 10); // Replace with a secure password hashing mechanism

      const body = {
        name: `Teacher${i}`,
        email: `teacher${i}@gmail.com`,
        password: hashedPassword,
        role: 'teacher',
        isActive: true,
      };

      const result = await dbQuries.register(body);

      // Add the teacher to the teacher table with subjects
      const subjects = ['Math', 'Science', 'English','Arabic']; // Replace with the desired subjects
      const data = await dbQuries.addTeacher(result.id, subjects);

      console.log(`Teacher ${i} seeded successfully`);
    }

    // Disconnect from the database after seeding
  }else {
    console.log('teachers already exists.');
 }
}
  catch (error) {
    console.error('Error seeding teachers:', error);
  }
}
}
// Run the seedTeachers function

