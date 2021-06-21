const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://postgres:12Ezbl23!!@localhost:5432/workout-log");

module.exports = sequelize;