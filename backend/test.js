const { Sequelize } = require('sequelize');

const db = new Sequelize('mydb', 'user', 'password', {
    host: 'db',
    dialect: 'mysql',
    port: 3306,
});

async function testConnection() {
  try {
    await db.authenticate();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection();