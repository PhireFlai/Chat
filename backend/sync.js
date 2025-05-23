const { sequelize } = require('./models/db');
const User = require('./models/User');
const Follow = require('./models/Follow');
const defineAssociations = require('./models/associations');

(async () => {
  try {
    defineAssociations(); // Define associations here

    await sequelize.authenticate();
    console.log('Database connection successful.');

    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();