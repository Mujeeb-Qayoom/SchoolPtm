const classSchema = require('../models/classModel');
const userSchema = require('../models/userModel');
const parentSchema = require('../models/parentModel');
const teacherSchema = require('../models/teacherModel');
const childernSchema = require('../models/childernModel');
const ptmSchema = require('../models/ptmModel');
const subjectSchema = require('../models/subjectModel');
const locationSchema = require('../models/location');
const teacherAttributeSchema = require('../models/teacherAttributesModel');
const timeSlotSchema = require('../models/timeSlot');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;


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

    addLocation: async (data) => {

        const result = await locationSchema.create(data)

        if (result) {
            return result;
        }
        return false;
    },

    deleteLocation: async (id) => {

        try {
            const deletedLocation = await locationSchema.findByIdAndUpdate(id, { isActive: false });

            if (deletedLocation) {
                return { success: true, message: 'Location deleted successfully' };
            } else {
                return { success: false, message: 'Location not found' };
            }
        } catch (error) {
            return { success: false, message: 'Error deleting location' };
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
        const result = await teacherSchema.find();

        if (result.length != 0) {
            return result;
        }
        return false;

    },

    getAllParents: async () => {
        const result = await parentSchema.find();

        if (result.length != 0) {
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

    getclasses: async (id) => {

        const data = await teacherSchema.findOne({ _id: id });
        if (data) {
            return data.classes;
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

    deleteSubject: async (id) => {

        try {
            const deletedLocation = await subjectSchema.findByIdAndUpdate(id, { isActive: false });

            if (deletedLocation) {
                return { success: true, message: 'subject deleted successfully' };
            } else {
                return { success: false, message: 'subject not found' };
            }
        } catch (error) {
            return { success: false, message: 'Error deleting subject' };
        }
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
    updateLocation: async (location, body) => {
        const allowedFields = ["locationName", "floor", "buildingName"];

        // Update only the allowed fields
        for (const field in body) {
            if (allowedFields.includes(field)) {
                location[field] = body[field];
            } else {
                return { success: false, message: `Field '${field}' is not allowed for update` };
            }
        }

        try {
            const updatedLocation = await location.save();
            return { success: true, message: 'Location updated successfully', data: updatedLocation };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error updating location' };
        }
    },

    // getAllTimeSlotsCount : async(ptmDate) =>{

    //   const result =  timeSlotSchema.countDocuments(, (err, count) => {
    //         if (err) {
    //           return err
    //         } else {
    //           console.log(`Count of timeslots for date ${ptmDate}: ${count}`);
    //           return count;
    //           // Use the count as needed
    //         }
    //       });
    //    }


    getAllTimeSlotsCount: async (req) => {


        try {
            // const dateObject = new Date(req.body.date);
            if (req.body.date) {
                console.log("iffffffffffffffffffffffffffff");
                const ptmId = await ptmSchema.findOne({ date: req.body.date });

                if (ptmId != null) {
                    const result = await timeSlotSchema.countDocuments({ ptm: ptmId._id })
                    return result;
                }
                return null
            }
            else {
                console.log("elseeeeeeeeeeeeeeeeee");
                const result = await timeSlotSchema.countDocuments({});
                return result;
            }
        }
        catch (err) {
            console.error(err);
            return err
        }
    },

    getUsersCount: async () => {
        try {
            const result = await userSchema.aggregate([
                {
                    $group: {
                        _id: "$role",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        role: "$_id",
                        count: 1
                    }
                }
            ]);

            const counts = {};
            result.forEach(({ role, count }) => {
                counts[role] = count;
            });

            return counts;
        } catch (error) {
            console.error("Error getting users count:", error);
            throw error;
        }
    },

    getTeachersWithTimeslots: async () => {
        try {
            const result = await timeSlotSchema.find({ status: 'upcomming' })
                .populate({
                    path: 'teacher',
                    model: 'Teacher',
                    select: 'user',
                    populate: {
                        path: 'user',
                        model: 'User',
                        select: 'name _id'
                    },
                })
                .populate('ptm location');

            if (!result || result.length === 0) {
                return false;
            }

            // Create a map to group by ptmDate and teacherName
            const groupedResult = new Map();
            result.forEach(timeslot => {
                const key = `${timeslot.ptm.date}-${timeslot.teacher.user.name}`;
                if (!groupedResult.has(key)) {
                    groupedResult.set(key, {
                        teacher: timeslot.teacher._id,
                        teacherName: timeslot.teacher.user.name,
                        ptmDate: timeslot.ptm.date,
                        locationName: timeslot.location.locationName,
                        timeslots: [],
                    });
                }
                groupedResult.get(key).timeslots.push({
                    startTime: timeslot.startTime,
                    endTime: timeslot.endTime,
                });
            });

            // Convert the map values to an array
            const formattedResult = [...groupedResult.values()];
            return formattedResult;

        } catch (error) {
            console.error(error);
            return false;
        }
    },

    teacherswithCommonClasses: async (classIds, teacherId) => {

        try {
            const result = await teacherSchema
                .find({
                    classes: { $in: classIds },
                    _id: { $ne: teacherId }, // Exclude the current teacher
                })
                .select('_id') // Select only the '_id' field
                .exec();

            if (result) {
                return result.map(teacher => teacher._id); // Extract only the teacher IDs
            }
            return [];
        } catch (error) {
            console.error("Error fetching teachers with common classes:", error);
            throw error;
        }
    },

    teachersWithCommonClassesAndCurrent: async (classIds, teacherId) => {

        try {
            const result = await teacherSchema
                .find({
                    classes: { $in: classIds },
                })
                .select('_id')

            if (result) {
                const teacherIds = new Set(result.map(teacher => teacher._id));

                console.log(teacherIds);

                const Id = new ObjectId(teacherId);

                console.log(Id);

                if (Array.from(teacherIds).some(teacherObjectId => teacherObjectId.equals(Id))) {
                    console.log('In the equals function');
                    return true;
                }
                return false;
            }
        } catch (error) {
            console.error("Error fetching teachers with common classes:", error);
            throw error;
        }
    },
    getteachersfromPtm: async (ptmId) => {
        try {
            const result = await teacherAttributeSchema
                .find({ ptm: ptmId })
                .select('teacher')
                .exec();

            if (result) {
                return result.map(item => item.teacher);
            }
            return [];
        } catch (err) {
            console.error("Error fetching teachers from PTM:", err);
            throw err;
        }
    },


    matchTeachersfromPtm: async (ptmId, teacherId) => {
        try {
            const result = await teacherAttributeSchema.find({ teacher: teacherId, ptm: ptmId });

            if (result) {
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error fetching teachers from PTM:", err);
            throw err;
        }
    },

    swapTeacherUpdate: async (newTeacher, ptmId, previousTeacher) => {
        try {

            const Id = new ObjectId(ptmId);
            const pTeacherId = new ObjectId(previousTeacher);
            const nTeacherId = new ObjectId(newTeacher);

            console.log(Id, pTeacherId, nTeacherId)
            // Update teacher in teacherAttributeSchema
            const resultTeacherAttribute = await teacherAttributeSchema.updateOne(
                { ptm: Id, teacher: pTeacherId },
                { teacher: nTeacherId } // Directly provide the new teacher ID without $set
            );
            // Update teacher in timeSlotSchema
            const resultTimeSlot = await timeSlotSchema.updateMany(
                { ptm: Id, teacher: pTeacherId },
                { $set: { teacher: nTeacherId } }
            );

            console.log("result", resultTeacherAttribute)
            console.log("data", resultTimeSlot);

            if (resultTeacherAttribute.acknowledged === true && resultTimeSlot.acknowledged === true) {
                // Both updates were successful
                return true;
            }
            // One or both updates failed
            return false;
        } catch (error) {
            console.error("Error updating teacher by PTM ID and previous teacher:", error);
            throw error;
        }
    },

    getAllTimeSlotsByTeacherIdAndPtmDate: async (ptm, teacherId) => {

        try {
            if (ptm.length === 1) {
                console.log("iffffffffffffffffffffffffffffffffff");
                const timeSlots = await timeSlotSchema.find({
                    ptm: ptm,
                    teacher: teacherId,
                    status: { $nin: ['lunch', 'freezed'] }
                }).select('status startTime endTime appointment').populate('appointment');

                console.log("slotsssssssssssssssssssssssss", timeSlots);

                // Extract childIds from timeSlots

                const childIds = timeSlots.map(slot => slot.appointment.childrenId);

                console.log("children ids", childIds);

                // Fetch child details from children table using childIds
                const childrenDetails = await childernSchema.find({
                    _id: { $in: childIds }
                }).select('user')//.populate('user'); // Assuming children has userId of child user

                console.log("childrenDetails", childrenDetails);

                // Extract userIds from children details
                const userIds = childrenDetails.map(child => child.user);
                console.log(userIds);

                // Fetch child names from the user table using userIds
                const childNames = await userSchema.find({
                    _id: { $in: userIds }
                }).select('name'); // Assuming user table has a 'name' field
                console.log(childNames);

                // Map child names to their respective time slots

                const data = timeSlots.map(slot => {
                    const childId = slot.appointment.childrenId;
                    console.log("childId", childId);
                    const child = childrenDetails.find(child => child._id.equals(childId));
                    const user = childNames.find(user => user._id.equals(child.user));

                    // Assuming user table has a 'name' field
                    return { ...slot.toObject(), childName: user.name };
                    //slot.childName = user.name;
                });
                console.log("dataaaaaaaaaaaaa", data)

                const filteredData = data.map(({ status, startTime, endTime, childName }) => ({
                    status,
                    startTime,
                    endTime,
                    childName
                }));
                return filteredData;
            }
            else {

                console.log("elseeeeeeeeeeee");
                const timeSlots = await timeSlotSchema.find({
                    ptm: { $in: ptm },
                    teacher: teacherId,
                    status: { $nin: ['lunch', 'freezed'] }
                }).select('status startTime endTime appointment').populate('appointment');

                console.log("slotsssssssssssssssssssssssss", timeSlots);

                // Extract childIds from timeSlots
                const childIds = timeSlots.map(slot => slot.appointment.childrenId);

                console.log("children ids", childIds);

                // Fetch child details from children table using childIds
                const childrenDetails = await childernSchema.find({
                    _id: { $in: childIds }
                }).select('user')//.populate('user'); // Assuming children has userId of child user

                console.log("childrenDetails", childrenDetails);

                // Extract userIds from children details
                const userIds = childrenDetails.map(child => child.user);
                console.log(userIds);

                // Fetch child names from the user table using userIds
                const childNames = await userSchema.find({
                    _id: { $in: userIds }
                }).select('name'); // Assuming user table has a 'name' field
                console.log(childNames);

                // Map child names to their respective time slots
                const data = timeSlots.map(slot => {
                    const childId = slot.appointment.childrenId;
                    console.log("childId", childId);
                    const child = childrenDetails.find(child => child._id.equals(childId));
                    const user = childNames.find(user => user._id.equals(child.user));

                    // Assuming user table has a 'name' field
                    return { ...slot.toObject(), childName: user.name };
                });
                console.log("dataaaaaaaaaaaaa", data)

                const filteredData = data.map(({ status, startTime, endTime, childName }) => ({
                    status,
                    startTime,
                    endTime,
                    childName
                }));
                return filteredData;
            }
        }
        catch (error) {
            console.error('Error retrieving time slots:', error);
            throw error;
        }
    },

    getAllParentsWithChildrenDetails: async (isActive) => {

        const result = await parentSchema.find()
            .populate({
                path: 'user',
                select: 'name email',
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'user',
                        model: 'User',
                        select: 'isActive',
                    },
                    {
                        path: 'grade',
                        model: 'Class',
                        select: 'name',
                    },
                ],
                select: 'name',
            })
        if (!result) {
            return false;
        }

        else {
            if (isActive == 2) {

                const formattedParents = result.map(parent => ({
                    parentId: parent.user._id,
                    parentName: parent.user.name,
                    parentEmail: parent.user.email,
                    childrenCount: parent.children.length,
                    children: parent.children
                        .map(child => ({
                            childId: child._id,
                            childName: child.name,
                            IsActive: child.user.isActive,
                            className: child.grade ? child.grade.name : null,
                        })),
                }));

                return formattedParents;
            }
            else if (isActive == 1 || isActive == 0) {

                const formattedParents = result.map(parent => ({
                    parentId: parent.user._id,
                    parentName: parent.user.name,
                    parentEmail: parent.user.email,
                    childrenCount: parent.children.length,
                    children: parent.children.filter(child => child.user.isActive == isActive)
                        .map(child => ({
                            childId: child._id,
                            childName: child.name,
                            IsActive: child.user.isActive,
                            className: child.grade ? child.grade.name : null,
                        })),
                }));

                return formattedParents;

            }
        }
    }
}
