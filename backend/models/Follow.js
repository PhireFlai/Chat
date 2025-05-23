const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Follow = sequelize.define('Follow', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    followingId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }
});

module.exports = Follow;