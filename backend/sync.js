const { sequelize } = require('./models/db');
const defineAssociations = require('./models/associations');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');
    defineAssociations(); // Define associations here
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();