const { DataTypes } = require('sequelize'); // object destructuring is used to extrapolate the DataTypes object from the sequelize dependency.
const db = require('../db'); //import the connection to our database that we set up in the db.js. This will unlock methods from the sequelize connection that we can call upon


//This is where the definition and creation of the model takes place. "Model/Structure/Schema" of our data.
const User = db.define('user', { //define() is a Sequelize method that will map model properties in the server file to a table in Postgres.
    username: {
        type: DataTypes.STRING, //DataTypes is a parameter in the function brought in through Sequelize.
        allowNull: false, //optional property. Simply means that you will be unable to send null data through
        unique: true //optional propert. Means you cannot have duplicate username/data
    },
    passwordhash: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = User //exports User Model in order to access it in other files in this application and to allow Sequelize to create the users table with the email and password columns