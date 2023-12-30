const parentSchema = require('../models/parentModel');
const teacherSchema = require('../models/teacherModel');
const ptmSchema = require('../models/ptmModel');
const teacherAttributeSchema = require('../models/teacherAttributesModel');
const timeSlotSchema = require('../models/timeSlot');
const appointmentSchema = require('../models/appointmentModel');
const Childern = require('../models/childernModel');


module.exports = {

    getMyChildren: async (id) => {

        try {
            const parent = await parentSchema.findOne({ user: id }).populate('children');

            if (parent) {
                return parent.children;
            } else {
                return false
            }
        } catch (err) {
            console.error(err);
        }
    },


    getAllPtmTeachers: async (ptmDate, childrenId) => {

        try {

            // Check if there are documents in ptmSchema for the given PtmDate
            const ptmDocuments = await ptmSchema.find({ date: ptmDate });

            if (ptmDocuments.length == 0) {
                return false;
            }

            // Check if there are documents in TeacherAttributeModel
            const teacherAttributeDocuments = await teacherAttributeSchema.find({ ptm: { $in: ptmDocuments.map(doc => doc._id) } });
            //  console.log("TeacherAttributeModel documents:", teacherAttributeDocuments);

            // Check if there are documents in Teacher
            const teacherDocuments = await teacherSchema.find({ _id: { $in: teacherAttributeDocuments.map(doc => doc.teacher) } });
            //    console.log("Teacher documents before filtering:", teacherDocuments);

            // Find the grade associated with the specified childrenId
            const child = await Childern.findById(childrenId).populate('grade');

            //console.log("child issssssssssssssssssssss", child)
            if (!child) {
                console.log("Child not found for the given ID.");
                return;
            }
            const gradeId = child.grade._id;

            // Filter teachers based on the grade
            const filteredTeachers = teacherDocuments.filter(teacher => {

                // Replace the condition below with your filtering criteria            
                return teacher.classes.includes(gradeId);
            });

            // Extract the _id values from filteredTeachers
            const teacherIds = filteredTeachers.map(teacher => teacher._id);

            // Find all timeslots associated with the filteredTeachers
            const timeslots = await timeSlotSchema.find({ teacher: { $in: teacherIds } });

            console.log("Timeslots for filtered teachers:", timeslots);

            // console.log("Filtered Teacher documents:", filteredTeachers);

            if (timeslots) {
                return timeslots;
            }
            return false;

        }
        catch (err) {

            console.error(err);

        }

    },


    MyAppoitments: async (uId) => {
        try {
            const parent = await parentSchema.findOne({ user: uId });

            if (parent) {
                const appointments = await appointmentSchema.find({ parentId: parent._id });
                console.log(appointments);
                return appointments;
            } else {
                console.log("Parent not found for the given user ID.");
                return null; // Consider returning null or an empty array depending on your use case
            }
        } catch (error) {
            console.error(error);
            throw error; // Propagate the error up to the caller
        }
    },


}