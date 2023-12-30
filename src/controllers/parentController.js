const commonQueries = require('../queries/commonQueries');
const adminQueries = require('../queries/AdminQueries');
const parentQueries = require('../queries/parentQueries')
const responses = require('../functions/responses');
const mapFunctiions = require('../functions/mapFunctiions')

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

    getAllPtmTeachers: async (req, res) => {

        try {

            const teachers = await parentQueries.getAllPtmTeachers(req.body.ptmDate, req.body.childrenId);

            if (teachers) {
                return responses.successResponse(req, res, 200, teachers);
            }
            return responses.errorResponse(req, res, 400, "no data found");

        } catch (err) {
            return responses.serverResponse(res, 500, "something went wrong");
        }

    },

    bookAppoitment: async (req, res) => {
        console.log(req.user);
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
                status: "upcomming"
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
    }



}                       