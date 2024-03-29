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
        const teacherString = JSON.stringify(timeslot.teacherId)
        // console.log(timeslotString)
        // console.log(teacherString);

        if (timeslotsSet.has(timeslotString) || teacherIdSet.has(teacherString)) {
          console.log('if ', timeslotsSet)
          // Duplicate timeslot found
          return true;
        }

        timeslotsSet.add(timeslotString);
        teacherIdSet.add(teacherString);
        // console.log('else ', timeslotsSet);
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


  timeDifference: async (start_time, end_time) => {

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
      throw new Error("Both arguments must be Date objects.");
    }

    // getTime() returns the number of milliseconds since January 1, 1970
    const timeDifferenceMs = endTime.getTime() - startTime.getTime();

    // Create a new Date object with the time difference
    const timeDifference = new Date(timeDifferenceMs);

    // You can access individual components of the time difference if needed
    // const hours = timeDifference.getUTCHours();
    // const minutes = timeDifference.getUTCMinutes();
    // const seconds = timeDifference.getUTCSeconds();

    // Return the time difference as a Date object
    return timeDifference;
  },

  findIntersection: async (array1, array2) => {

    return array1.filter(value => !array2.includes(value));
  },

  mapTimeSlots: async (bodyTimeSlot, apptTimeslots) => {

    // Map the timeslots based on teacherId
    const matchingAppointmentTimeslot = apptTimeslots.find(
      apptTimeslot => apptTimeslot.teacher === bodyTimeSlot.teacherId
    );

    console.log("matching ", matchingAppointmentTimeslot);
    // If a matching timeslot is found in the appointment, map the data
    if (matchingAppointmentTimeslot) {
      return {
        startTime: bodyTimeSlot.startTime,
        endTime: bodyTimeSlot.endTime,
        teacherId: bodyTimeSlot.teacherId,
        isDeleted: matchingAppointmentTimeslot.isDeleted,
        timeslot: matchingAppointmentTimeslot
      };
    } else {
      // Handle the case when no matching timeslot is found
      console.error(`No matching timeslot found for teacherId: ${bodyTimeSlot.teacherId}`);
      return null;
    }
  }
};
