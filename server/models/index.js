const UserModel = require('./user'); //used to allow our model files to be used within the server folder
const LogModel = require('./log');

module.exports = { //exports the UserModel and LogModel
    UserModel,
    LogModel
}