// const fieldToRemove = 'age';

// const newArray = arrayOfObjects.map(obj => {
//   // Use destructuring to create a new object without the specified field
//   const { [fieldToRemove]: removedField, ...newObj } = obj;

//   // Return the new object without the specified field
//   return newObj;
// });

const crypt = require('../functions/bcrypt');
module.exports =
{

  mapChildren: async (childrenArray, fieldToRemove) => {
    h
    return Promise.all(childrenArray.map(async (child) => {
      // Use destructuring to create a new object without the specified field
      const { [fieldToRemove]: removedField, ...newChild } = child;

      // Hash the password using bcrypt
      const hash = await crypt.hashPassword(child.email); // Use an appropriate saltRounds value

      // Add additional fields to each child entry
      return {
        ...newChild,
        isactive: true,
        password: hash,
      };
    }));
  },


  checkDuplicateTeacherIdsAndTimeslots: async (body) => {

    if (body.teacherAttributes) {
      console.log("iffffffffffffffffffffff", body.teacherAttributes)

      const teacherIds = new Set();

      return !body.teacherAttributes.some(teacherAttributes => {
        const teacherId = teacherAttributes.teacher_id;

        if (teacherIds.has(teacherId)) {
          // Duplicate teacher ID found
          return true;
        }

        const timeslotsSet = new Set();

        if (teacherAttributes.timeslots.some(timeslot => {
          const timeslotString = JSON.stringify(timeslot); // Convert timeslot to string for Set comparison

          if (timeslotsSet.has(timeslotString)) {
            // Duplicate timeslot found
            return true;
          }

          timeslotsSet.add(timeslotString);
          return false;
        })) {
          // Duplicate timeslot found.

          return true;
        }

        teacherIds.add(teacherId);
        return false;
      });
    }
    else {
      // const teacherIds = new Set();

      // return !body.teacherId.some(teacher => {
      //   const teacherId = teacher.teacherId;

      //   if (teacherIds.has(teacherId)) {
      //     // Duplicate teacher ID found
      //     return true;
      //   }

      const timeslotsSet = new Set();
      const teacherIdSet = new Set();

      if (body.some(timeslot => {

        // Convert timeslot and teacherId to string for Set comparison 

        const timeslotString = JSON.stringify(timeslot.startTime);
        const teacherString = JSON.stringify(timeslot.techerId)

        if (timeslotsSet.has(timeslotString) || teacherIdSet.has(teacherString)) {
          // Duplicate timeslot found
          return true;
        }

        timeslotsSet.add(timeslotString);
        teacherIdSet.add(teacherString);
        return false;
      })) {
        // Duplicate timeslot found.
        return true;
      }


      //   teacherIds.add(teacherId);
      //   return false;
      // });

    }
  },


};
