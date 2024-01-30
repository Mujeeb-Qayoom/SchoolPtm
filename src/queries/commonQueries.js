
const userSchema = require('../models/userModel');
const ptmSchema = require('../models/ptmModel');
const timeSlotSchema = require('../models/timeSlot');
const appointmentSchema = require('../models/appointmentModel');
const classSchema = require('../models/classModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {

    addAppointment: async (data) => {

        const result = await appointmentSchema.create(data)

        if (result) {
            return result;
        }
        return false;
    },


    addTimeSlot: async (data) => {

        try {
            console.log("data is ", data)
            const result = await timeSlotSchema.create(data)


            if (result) {
                return result;
            }
            return false;
        }
        catch (err) {
            console.error(err);
        }

    },

    updateAppoitment: async (timeSlot, _id) => {

        try {
            const result = await appointmentSchema.updateOne(
                { _id: _id },
                { $push: { timeSlots: timeSlot } }
            );

            if (result) {
                return true; // Document was successfully updated
            }

            return false; // No document was modified
        } catch (error) {
            console.error(error);
            throw error; // Propagate the error up to the caller
        }

    },

    // updateAppoitment: async (timeSlot, _id) => {
    // try {
    //   const result = await appointmentSchema.updateOne(
    //     { _id: appointmentId },
    //     { $push: { timeSlots: { $each: timeSlotIdArray } } }
    //   );

    //   if (result.nModified > 0) {
    //     return true; // Document was successfully updated
    //   }

    //   return false; // No document was modified
    // } catch (error) {
    //   console.error(error);
    //   throw error; // Propagate the error up to the caller
    // }
    // },

    findUser: async (data) => {

        if (data === "admin") {

            const result = await userSchema.findOne({ role: data })

            if (result) {
                return result;
            }
            return false;
        }

        else if (data === "teacher") {

            const result = await userSchema.findOne({ role: data })
            if (result) {
                return result;
            }
            return false;

        }
        else {
            const result = await userSchema.findOne({ email: data })

            if (result) {
                return result;
            }
            return false;
        }
    },

    findPtm: async (data) => {

        const result = await ptmSchema.findOne({ date: data })

        if (result) {
            return true;
        }
        return false;
    },

    getPtms: async () => {

        const result = await ptmSchema.find();

        if (result) {
            return result;
        }
        return false;
    },

    getAllClasses: async (req, res) => {
        try {
            const result = await classSchema.find();

            if (result.length > 0) {
                return { success: true, message: result }
            }
            return {
                success: false, message: "no data found"
            }
        }
        catch (err) {
            return { success: false, message: "server error" }
        }
    },
    resetPassword: async (email, password) => {

        try {

            const result = await userSchema.updateOne(
                { email: email },
                { $set: { password: password } })

            if (result) {
                console.log(result);
                return { success: true, message: result }
            }
            return { success: false, message: "no data found" }
        }
        catch (err) {
            return { success: false, message: "server error" }
        }
    }
}
