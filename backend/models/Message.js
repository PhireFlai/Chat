const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const message = sequelize.define('Message', {
    id :{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }

}
)
