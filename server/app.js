require('dotenv').config();
const Express = require('express'); //allows the use express (node.js framework)
const app = Express();
const dbConnection = require('./db') //allows the use of the local database(imports the db.js file)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const controllers = require('./controllers'); //requires the controllers folder to access the files within it used below

// Express has functionality built into it, that allows it to be able to process requests that come into our server. And in order to use the req.body
// middleware, we need to use a middleware function called express.json().  Express needs to JSON-ify  the request to be able to parse and interpret the body of data being sent through the request.
//****************THIS MUST GO ABOVE ANY OTHER ROUTES OR THE CODE WILL BREAK ****************
app.use(Express.json());

//this is a route that is created and used to access future functions in the logcontroller.js file. The first parameter sets up
//endpoint the url will need to access a controller. The 2nd parameter, we use a dot notation to step into the controller we 
//imported.
app.use('/log', controllers.logController); //see index.js file in controllers folder. Same as below
app.use('/user', controllers.userController);

dbConnection.authenticate() //Call upon the authenticate method. This is an asynchronous method that runs a SELECT 1+1 AS a result
    // query. This method returns a promise.
    .then(() => dbConnection.sync()) //We use a promise resolver to access the returned promise and call upon the  method. This method will ensure that we sync all defined models to the database.
    .then(() => {
        app.listen(3000, () => {
            console.log(`[server]: App is listening to port 3000`); //show the user when server is running properly on port 3000
        })
    })
    .catch((err) => {
        console.log(`[server]: Server crashed. Error = ${err}`); //shows the user the error if server fails to initialize
    })