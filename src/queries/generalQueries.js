
const parentSchema = require('../models/parentModel');
const locationSchema = require('../models/location');

const subjectSchema = require('../models/subjectModel');


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


    addSubjects: async (subjects) => {

        try {
            const subject = await subjectSchema.create(subjects)

            if (subject) {
                return subject
            } else {
                return false
            }
        } catch (err) {
            console.error(err);
        }

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




}