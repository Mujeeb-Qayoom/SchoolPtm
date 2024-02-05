
const generalQueries = require('../queries/generalQueries');
const adminQueries = require('../queries/AdminQueries');

module.exports = {
  seedLocations: async () => {
    try {
      const existingLocations = await generalQueries.getLocations();

      if (!existingLocations) {
        // Sample data for 10 locations
        const locationsData = [
          { locationName: 'Location 1', floor: 'ground', buildingName: 'Primary' },
          { locationName: 'Location 2', floor: 'ground', buildingName: 'Primary' },
          { locationName: 'Location 3', floor: 'first', buildingName: 'primary' },
          { locationName: 'Location 4', floor: 'first', buildingName: 'primary' },
          { locationName: 'Location 5', floor: 'second', buildingName: 'Primary' },
          { locationName: 'Location 6', floor: 'second', buildingName: 'Primary' },
          { locationName: 'Location 7', floor: 'ground', buildingName: 'secondary' },
          { locationName: 'Location 8', floor: 'first', buildingName: 'secondary' },
          { locationName: 'Location 9', floor: 'second', buildingName: 'secondary' },
          { locationName: 'Location 10', floor: 'third', buildingName: 'secondary' },
          // Add more locations as needed
        ];

        // Insert the sample data into the Location model
        const insertedLocations = await adminQueries.addLocation(locationsData);

        console.log('Locations seeded successfully:', insertedLocations);
      } else {
        console.log('Locations already exist.');
      }
    } catch (error) {
      console.error('Error seeding locations:', error);
    }
  },
};
