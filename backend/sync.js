const { sequelize } = require('./db');
const User = require('./models/User');
const Follow = require('./models/Follow');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');

    await sequelize.sync({ force: true }); // WARNING: This will drop and recreate tables
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();