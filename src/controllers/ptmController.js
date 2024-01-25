const responses = require('../functions/responses');
const datavalidator = require('../validations/dataValidator');
const ptmData = require('../validations/ptmValidator');
const appointmentData = require('../validations/appointmentValidator');
const teacherAttributeData = require('../validations/teacherAttributeValidator');
const SlotData = require('../validations/timeSlotValidator');
const mapFunctiions = require('../functions/mapFunctiions');
const commonQueries = require('../queries/commonQueries');
const adminQueries = require('../queries/AdminQueries');
const generalQueries = require('../queries/generalQueries');
const parentQueries = require('../queries/parentQueries');


module.exports = {

   addPtm: async (req, res) => {
      try {

         //check whether ptm date must not less than current date
         const currentDate = new Date();

         if (new Date(req.body.date) >= currentDate) {

            // check wheather already exist or create one

            const existingPtm = await commonQueries.findPtm(req.body.date);

            const isUnique = await mapFunctiions.checkDuplicateTeacherIdsAndTimeslots(req.body);

            console.log(isUnique, existingPtm);

            if (!existingPtm && isUnique) {
               const data = {
                  date: req.body.date,
                  duration: req.body.duration,
                  startTime: req.body.startTime,
                  endTime: req.body.endTime,
                  lunchStartTime: req.body.lunchStartTime,
                  lunchEndTime: req.body.lunchEndTime
               }
               const timeDifferenceResult = await mapFunctiions.timeDifference(req.body.lunchStartTime, req.body.lunchEndTime);

               console.log(timeDifferenceResult);

               if (typeof req.body.duration !== 'number' || req.body.duration <= 0) {
                  throw new Error("Duration must be a positive number greater than zero.");
               }

               const lunchslots = timeDifferenceResult / (req.body.duration * 60 * 1000);
               console.log(lunchslots);


               // add ptm to the database
               const validatedPtmDAata = await datavalidator.validateData(data, ptmData, res);


               const result = await adminQueries.addPtm(validatedPtmDAata);

               const attributes = req.body.teacherAttributes

               // set an appoitmnet then set teacher attributes accordingly 

               const mapAttribute = await Promise.all(attributes.map(async (teacher) => {

                  const appData = {
                     ptm: result.id,
                     isActive: true,
                  }

                  const validatedAppointmentDAata = await datavalidator.validateData(appData, appointmentData, res);

                  const appt = await commonQueries.addAppointment(validatedAppointmentDAata);

                  const AttributeData = {
                     teacher: teacher.teacher_id,
                     location: teacher.location_id,
                     appointment: appt._id,
                     ptm: result._id,
                  }

                  // const validatedAttributeDAata = await datavalidator.validateData(AttributeData, teacherAttributeData, res);

                  const teacherAttribute = await adminQueries.addTeacherAttribute(AttributeData);
                  // update ptm table with teacher attributes 
                  const updateTeacherAttributes = await adminQueries.updatePtm(teacherAttribute, result._id);

                  // adding time slots to the timeslot table with curent appointment  
                  const timeslots = teacher.timeslots.map(async (timeslot) => {

                     const startTime = new Date(timeslot.startTime);
                     const endTime = new Date(timeslot.endTime);


                     const slotdata = {
                        startTime: startTime,
                        endTime: endTime,
                        isActive: true,
                        location: teacher.location_id,
                        teacher: teacher.teacher_id,
                        appointment: appt._id,
                        status: "freezed",
                        ptm: result._id
                     }
                     console.log("freeze appoitment ", slotdata.appointment);


                     //  const validatedtimeSlotData = await datavalidator.validateData(slotdata, SlotData, res);
                     const timeSlot = await commonQueries.addTimeSlot(slotdata);

                     // updating appointmnets with timeslots

                     const updateAppt = await commonQueries.updateAppoitment(timeSlot, appt._id);

                  })

                  for (let i = 0; i < lunchslots; i++) {
                     // Convert lunchStartTime to a Date object
                     const lunchStartTime = new Date(req.body.lunchStartTime);

                     if (isNaN(lunchStartTime.getTime())) {
                        console.error("Invalid lunchStartTime provided:", req.body.lunchStartTime);
                        throw new Error("Invalid lunchStartTime provided.");
                     }

                     const LsTime = new Date(lunchStartTime.getTime() + (req.body.duration * 60000) * i);
                     const LeTime = new Date(lunchStartTime.getTime() + (req.body.duration * 60000) * (i + 1));

                     console.log("slot no ", i);
                     console.log("startTime  ", LsTime.toISOString());
                     console.log("endTime", LeTime.toISOString());

                     const slotdata = {
                        startTime: LsTime,
                        endTime: LeTime,
                        isActive: true,
                        location: teacher.location_id,
                        teacher: teacher.teacher_id,
                        appointment: appt._id,
                        status: "lunch",
                        ptm: result._id
                     };
                     console.log("lunch appoitment ", slotdata.appointment);
                     // const validatedtimeSlotData = await datavalidator.validateData(slotdata, SlotData, res);
                     const timeSlot = await commonQueries.addTimeSlot(slotdata);

                     // updating appointments with time slots
                     const updateAppt = await commonQueries.updateAppoitment(timeSlot, appt._id);
                  }
               }))

               if (result) {
                  return responses.successResponse(req, res, 201, result)
               }
               return responses.errorResponse(req, res, 422, "unable to addd");
            }
            return responses.errorResponse(req, res, 409, "ptm already exists")

         }

         return responses.errorResponse(req, res, 403, "invalid data");
      }

      catch (err) {
         console.error(err)
         return responses.serverResponse(res, 500, "sever error");
      }

   },

   getAllPtm: async (req, res) => {

      try {

         const ptm = await commonQueries.getPtms();

         if (ptm) {
            return responses.successResponse(req, res, 200, ptm);
         }
         return responses.errorResponse(req, res, 404, "ptm no found");
      }
      catch (err) {

         return responses.serverResponse(res, 500, "something went wrong");
      }
   },



}