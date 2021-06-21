const router = require('express').Router(); //We import the Express framework and access the Router()  method, assigning it to a variable
const { LogModel } = require('../models'); //We use object deconstructing to import the user model and store it in LogModel variable. It is convention to use Pascal casing (uppercase on both words) for a model class with Sequelize
let validateJWT = require('../middleware/validate-jwt'); //imported the validate-jwt middleware and assign it to a variable


module.exports = router; //export the module for usage outside of the file.