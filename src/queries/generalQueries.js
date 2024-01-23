
const parentSchema = require('../models/parentModel');
const locationSchema = require('../models/location');
const ptmSchema = require('../models/ptmModel');
const subjectSchema = require('../models/subjectModel');
const appointmentSchema = require('../models/appointmentModel');
const timeslotSchema = require('../models/timeSlot');
const mongoose = require('mongoose');


module.exports = {

    addLocation: async (data) => {

        const result = await locationSchema.create(data)

        if (result) {
            return result;
        }
        return false;
    },

    getLocations: async () => {

        const result = await locationSchema.find()

        if (result.length > 0) {
            return result;
        }
        return false;
    },

    getSubjects: async () => {

        const result = await subjectSchema.find()

        if (result.length > 0) {
            return result;
        }
        return false;
    },



    getsubjects: async () => {

        try {
            const subjects = await subjectSchema.find()

            if (subjects) {
                return subjects
            } else {
                return false
            }
        } catch (err) {
            console.error(err);
        }

    },

    getAppointment: async (appt) => {


        const result = await appointmentSchema.findOne({ _id: appt });

        if (result) {
            return result;
        } else {
            return false
        }

    },

    updateAppointmentStatus: async (appointmentId) => {

        try {
            // Convert the appointmentId to a MongoDB ObjectId
            const objectId = new mongoose.Types.ObjectId(appointmentId);
            console.log("id issss", objectId);

            // Update the appointment
            const result = await appointmentSchema.updateOne(
                { _id: objectId },
                { $set: { isActive: 'false' } }
            );

            console.log("result", result)

            // Check if the update was successful
            if (result.modifiedCount > 0) {
                return { success: true, message: 'Appointment status updated successfully' };
            } else {
                return { success: false, message: 'No appointment was updated. Appointment not found or isActive value is the same.' };
            }
        } catch (error) {
            return error;;
        }

    },

    updateTimeslotStatus: async (timeslotId) => {
        try {
            // Convert the timeslotId to a MongoDB ObjectId
            const objectId = new mongoose.Types.ObjectId(timeslotId);

            // Update the timeslot
            const result = await timeslotSchema.updateOne(
                { _id: objectId },
                { $set: { isActive: 'false' } }
            );
            console.log("result slot", result);
            // Check if the update was successful
            if (result.modifiedCount > 0) {
                return { success: true, message: 'Timeslot status updated successfully' };
            } else {
                return { success: false, message: 'No timeslot was updated. Timeslot not found or isActive value is the same.' };
            }
        } catch (error) {
            return error;
        }
    },

    findId: async (user) => {
        try {

            const id = await parentSchema.findOne({ user: user._id });

            if (id) {
                return id
            } else {
                return false
            }
        } catch (err) {
            console.error(err);
        }
    },

    findParentId: async (user) => {
        try {

            const id = await parentSchema.findOne({ _id: user });

            if (id) {
                return id
            } else {
                return false
            }
        } catch (err) {
            console.error(err);
        }
    },

    getPtmIdByDay: async (date) => {
        try {
            // Create a Date object from the dateString
            const ptmDate = new Date(date);

            // Extract day and year,month

            const day = ptmDate.getDate();
            const month = ptmDate.getMonth() + 1
            const year = ptmDate.getFullYear();

            const result = await ptmSchema.find({
                $expr: {
                    $and: [
                        { $eq: [{ $dayOfMonth: '$date' }, day] }, // Check day
                        { $eq: [{ $month: '$date' }, month] },    //check month
                        { $eq: [{ $year: '$date' }, year] },      // Check year
                    ],
                },
            }, '_id');

            const ptmIdsArray = result.map(item => item._id);

            if (ptmIdsArray.length > 0) {
                return ptmIdsArray;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error retrieving PTMs:', error);
            throw error;
        }
    },


    getPtmIdByMonth: async (date) => {
        try {

            // Create a Date object from the dateString
            const ptmDate = new Date(date);

            // Extract month and year
            const month = ptmDate.getMonth() + 1; // Months are zero-based, so add 1
            const year = ptmDate.getFullYear();

            const result = await ptmSchema.find({
                $expr: {
                    $and: [
                        { $eq: [{ $month: '$date' }, month] },
                        { $eq: [{ $year: '$date' }, year] },
                    ],
                },
            }, '_id');

            const ptmIdsArray = result.map(item => item._id);


            if (ptmIdsArray.length > 0) {
                return ptmIdsArray;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error retrieving PTMs:', error);
            throw error;
        }
    },

}