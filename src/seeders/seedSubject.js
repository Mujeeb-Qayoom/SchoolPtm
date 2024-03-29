const generalQueries = require('../queries/generalQueries');
const adminQueries = require('../queries/AdminQueries');

module.exports = {



    seedSubjects: async () => {

        const existingsubjects = await generalQueries.getsubjects();
        try {

            if (existingsubjects.length == 0) {

                const subjectsData = [
                    { name: 'Mathematics' },
                    { name: 'Science' },
                    { name: 'English' },
                    { name: 'History' },
                    { name: 'Physics' },
                    { name: 'Chemistry' },
                    { name: 'Biology' },
                    { name: 'Computer Science' },
                    { name: 'Geography' },
                    { name: 'Art' },
                ]


                // Clear existing subjects
                // await Subject.deleteMany({});

                // Insert new subjects
                await adminQueries.addSubjects(subjectsData);

                console.log('Subjects seeded successfully.');
            }
            else {
                console.log("sunjects already seeded");
            }
        }

        catch (error) {
            console.error('Error seeding subjects:', error);
        }
    }


}
