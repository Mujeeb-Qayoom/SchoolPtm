const userSchema = require('./userModel');
const parentSchema = require('./parentModel');
const teacherSchema = require('./teacherModel');
const childernSchema = require('./childernModel');
const ptmSchema = require('./ptmModel');
const locationSchema = require('./location');
const teacherAttributeSchema = require('../models/teacherAttributesModel');
const timeSlotSchema = require('../models/timeSlot');
const appointmentSchema = require('../models/appointmentModel');
const subjectSchema = require('./subjectModel');
const Childern = require('./childernModel');
const classSchema = require('./classModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports =

{

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

  addParent: async (id) => {

    const result = await parentSchema.create({ user: id })

    if (result) {
      return result;
    }
    return false;
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

  addPtm: async (data) => {

    const result = await ptmSchema.create(data);

    if (result) {
      return result
    }
    return false
  },

  findPtm: async (data) => {

    const result = await ptmSchema.findOne({ date: data })

    if (result) {
      return true;
    }
    return false;
  },

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


  addAppointment: async (data) => {

    const result = await appointmentSchema.create(data)

    if (result) {
      return result;
    }
    return false;
  },


  addTeacherAttribute: async (data) => {

    const result = await teacherAttributeSchema.create(data)

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

  getPtm: async (ptm, children) => {

    const ptmId = new ObjectId(ptm);
    const childrenId = new ObjectId(children)
    console.log("ptmId is ", ptmId, " childrenId  is ", childrenId);
    try {
      const result = await appointmentSchema.find({
        $and: [
          { ptm: ptmId },
          { childrenId: childrenId },
        ],
      });

      console.log("result is ", result);
      return result; // or do something with the result
    } catch (error) {
      console.error('Error occurred during find operation:', error);
      return false;
    }

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

  }
}




