
const generalQueries = require('../queries/generalQueries');

module.exports = {

  seedLocations: async () => {
    try {

      const existingLocations = await generalQueries.getLocations();

      if (!existingLocations) {

        // Sample data for 10 locations
        const locationsData = [
          { locationName: 'Location 1' },
          { locationName: 'Location 2' },
          { locationName: 'Location 3' },
          { locationName: 'Location 4' },
          { locationName: 'Location 5' },
          { locationName: 'Location 6' },
          { locationName: 'Location 7' },
          { locationName: 'Location 8' },
          { locationName: 'Location 9' },
          { locationName: 'Location 10' },
          // Add more locations as needed
        ];

        // Insert the sample data into the Location model
        const insertedLocations = await generalQueries.addLocation(locationsData);

        console.log('Locations seeded successfully:', insertedLocations);
      } else {
        console.log('locationsalready exists.');
      }
    }
    catch (error) {
      console.error('Error seeding locations:', error);
    } finally {
    }
  }
}
