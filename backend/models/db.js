const fs = require('fs'), path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');


const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    port: process.env.MYSQL_PORT,
});

module.exports = { sequelize };