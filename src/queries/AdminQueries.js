const classSchema = require('../models/classModel');
const userSchema = require('../models/userModel');
const parentSchema = require('../models/parentModel');
const teacherSchema = require('../models/teacherModel');
const childernSchema = require('../models/childernModel');
const ptmSchema = require('../models/ptmModel');
const locationSchema = require('../models/location');
const teacherAttributeSchema = require('../models/teacherAttributesModel');


module.exports = {

    register: async (data) => {

        try {
            const result = await userSchema.create(data);

            if (result) {
                return result;
            }
            return false;
        }
        catch (err) {
            return err;
        }
    },

    addParent: async (id) => {

        const result = await parentSchema.create({ user: id })

        if (result) {
            return result;
        }
        return false;
    },



    addChildern: async (user_ids, grades, names) => {
        try {
            const addedChildren = await childernSchema.create(
                user_ids.map((user, index) => ({
                    user,
                    grade: grades[index],
                    name: names[index],
                }))
            );

            return addedChildren;
        } catch (error) {
            console.log("Error adding children", error);
        }
    },

    addchildernToparent: async (parent_id, children) => {
        try {
            const updatedParent = await parentSchema.findByIdAndUpdate(
                parent_id,
                { $push: { children: { $each: children.map(child => child._id) } } },
                { new: true } // To return the updated document
            );

            return updatedParent;
        }

        catch (err) {

            return false;
        }
    },


    addTeacher: async (id, subjects, classes) => {

        const result = await teacherSchema.create({ user: id, subjects: subjects, classes: classes })

        if (result) {
            return result;
        }
        return false;
    },

    getTeachers: async () => {
        const result = teacherSchema.find();

        if (result) {
            return result;
        }
        return false;

    },



    addClass: async (data) => {

        try {
            const Class = await classSchema.create(data)

            if (Class) {
                return Class
            } else {
                return false
            }
        } catch (err) {
            console.error(err);
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


    addPtm: async (data) => {

        const result = await ptmSchema.create(data);

        if (result) {
            return result
        }
        return false
    },

    addTeacherAttribute: async (data) => {

        const result = await teacherAttributeSchema.create(data)

        if (result) {
            return result;
        }
        return false;
    },

    updatePtm: async (teacherAttribute, _id) => {

        const result = await ptmSchema.updateOne(
            { _id: _id },
            { $push: { teacherAttributes: teacherAttribute._id } }
        );

        if (result) {
            return result;
        }
        return false;
    },





}