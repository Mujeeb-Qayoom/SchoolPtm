const commonQueries = require('../queries/commonQueries');
const parentQueries = require('../queries/parentQueries')
const responses = require('../functions/responses');
const mapFunctiions = require('../functions/mapFunctiions');
const generalQueries = require('../queries/generalQueries');



module.exports = {

    getMyChildren: async (req, res) => {
        try {

            const children = await parentQueries.getMyChildren(req.user._id);


            if (children) {

                return responses.successResponse(req, res, 200, children);
            }
            return responses.errorResponse(req, res, 404, "no data found")
        }
        catch (err) {
            return responses.serverResponse(res, 500, "internal server error");
        }
    },

    // getPtmTeachers: async (req, res) => {

    //     try {
    //         const teachers = await parentQueries.getPtmTeachers(req.body.ptmDate);

    //         if (teachers) {
    //             return responses.successResponse(req, res, 200, teachers);
    //         }
    //         return responses.errorResponse(req, res, 400, "no data found");

    //     } catch (err) {
    //         return responses.serverResponse(res, 500, "something went wrong");
    //     }

    // },


    getAllPtmTeachersbyChildId: async (req, res) => {

        try {

            const teachers = await parentQueries.getAllPtmTeachersbyChildId(req, req.body.ptmDate, req.body.childrenId);

            if (teachers) {
                return responses.successResponse(req, res, 200, teachers);
            }
            return responses.errorResponse(req, res, 400, "no data found");

        } catch (err) {
            return responses.serverResponse(res, 500, "something went wrong");
        }

    },

    bookAppoitment: async (req, res) => {

        //   console.log(req.body.parentId, req.body.ptmId, req.body.childId);
        // const parentId = await dbQueries.findId(req.user);
        // console.log("parent Id is ", parentId)

        const TimeSlots = req.body.timeslots;


        const isDuplicate = await mapFunctiions.checkDuplicateTeacherIdsAndTimeslots(TimeSlots);
        console.log("unique is ", isDuplicate);

        if (isDuplicate) {
            return responses.errorResponse(res, res, 400, "check your data");
        }

        const appData = {
            ptm: req.body.ptmId,
            isActive: true,
            parentId: req.body.parentId,
            childrenId: req.body.childId
        }

        const appt = await commonQueries.addAppointment(appData);

        console.log("appointment is ", appt);


        // adding time slots to the timeslot table with curent appointment  

        const Slot = await Promise.all(TimeSlots.map(async (timeslot) => {
            const startTime = new Date(timeslot.startTime);
            const endTime = new Date(timeslot.endTime);
            console.log("appoyment id is ", appt._id);
            const slotdata = {
                startTime: startTime,
                endTime: endTime,
                isActive: true,
                location: timeslot.locationId,
                teacher: timeslot.teacherId,
                appointment: appt._id,
                status: "upcomming",
                ptm: req.body.ptmId
            };

            // Validate time slot data (assuming this function is correctly implemented)

            // const validatedtimeSlotData = await datavalidator.validateData(slotdata, SlotData, res);

            // Add time slot to the database
            return commonQueries.addTimeSlot(slotdata);
        }));

        console.log("Slots are ", Slot)
        const updateAppt = await commonQueries.updateAppoitment(Slot, appt._id);


        if (updateAppt) {
            return responses.successResponse(req, res, 201, updateAppt)
        }
        return responses.errorResponse(req, res, 422, "unable to addd");
    },

    cancelAppointment: async (req, res) => {

        try {

            const appt = await generalQueries.getAppointment(req.body.appointmentId);

            if (!appt) {
                return responses.errorResponse(req, res, 404, "appointment not found");
            }

            const parent = await generalQueries.findParentId(appt.parentId);

            if (!parent) {
                return responses.errorResponse(req, res, 401, "not authorized")
            }

            if (parent.user.equals(req.user._id)) {

                // Update appointment status to inactive
                const cancelAppt = await generalQueries.updateAppointmentStatus(req.body.appointmentId);

                console.log("ttttttttttttttttt", cancelAppt);

                if (!cancelAppt.success) {
                    return responses.errorResponse(req, res, 400, cancelAppt.message);
                }

                // Loop through associated timeslots and update their status to inactive

                for (const timeslotId of appt.timeSlots) {
                    const cancelSlot = await generalQueries.updateTimeslotStatus(timeslotId);

                    if (!cancelSlot.success) {

                        return responses.errorResponse(req, res, 400, cancelSlot.message)

                    }
                }

                // Return success response or any other relevant information
                return responses.successResponse(req, res, 200, "Appointment canceled successfully");
            }

            return responses.errorResponse(req, res, 401, "not authorized")
        }
        catch {
            return responses.errorResponse(req, res, 404, "something went wrong")
        }
    },

    getAppoitments: async (req, res) => {

        try {

            // const getMyChildren = await dbQueries.getMyChildren(req.user._id);

            const myAppt = await parentQueries.MyAppoitments(req.user._id);


            if (myAppt) {
                return responses.successResponse(req, res, 200, myAppt);
            }
            return responses.errorResponse(req, res, 400, "no data found")
        }
        catch (err) {

            return responses.serverResponse(res, 500, "something went wrong");
        }
    },

    updateAppointment: async (req, res) => {

        try {

            const appt = await parentQueries.getAppointmentById(req.body.appointmentId);

            if (result) {

                const isExisting = await mapFunctiions.mapTimeSlots(req.body.timeSlots, result.timeSlots);

                if (isExisting && req.timeSlots.isDeleted) {

                    const deleteSlot = await parentQueries.deleteTimeslot(req.body.timeSlots);
                }

                else if (isExisting && !(eq.timeSlots.isDeleted)) {

                    const updateSlot = await parentQueries.updateSlot(req.body.timeSlots, isExisting);
                }
                else {

                    const createdSlot = await parentQueries.createSlot(req.body, req.timeSlots);
                    const updateAppt = await commonQueries.updateAppoitment(createdSlot._id, req.appointmentId);
                }

                //  const result = await parentQueries.updateAppointment(req, req.body.ptmDate, req.body.childrenId);

                if (appt) {
                    return responses.successResponse(req, res, 200, appt);
                }
            }
            return responses.errorResponse(req, res, 400, "unable to update");

        } catch (err) {
            return responses.serverResponse(res, 500, "something went wrong");
        }
    },
}                       