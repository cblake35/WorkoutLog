const router = require('express').Router(); //We import the Express framework and access the Router()  method, assigning it to a variable
const { LogModel } = require('../models'); //We use object deconstructing to import the log model and store it in LogModel variable. It is convention to use Pascal casing (uppercase on both words) for a model class with Sequelize
let validateJWT = require('../middleware/validate-jwt'); //imported the validate-jwt middleware and assign it to a variable

/* Create WorkOut Log Endpoint */

router.post("/", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log; //deconstruct the body that is holding a log, grabbing the description, definition and result
    const { id } = req.user;// retrieves the user's id who made the request(this is dynamically created with by JWT, see validate.jwt.js line 41)
    const logEntry = {  // created a variable using the data pieces above
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry); //.create is a sequelize method that allows us to create an instance of Log
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/* Get All Log Entries Endpoint */

router.get("/", async (req, res) => {
    try {
        const entries = await LogModel.findAll(); //a sequelize method to find all items which returns a promise
        res.status(200).json(entries); //If successful, we capture the response from our promise and pass it jsonified in the response object
    } catch (err) {
        res.status(500).json({ error: err });//If the promise is rejected, we can catch this error and pass ourselves a status of 500 and message of the error.
    }
});

/* Get Individual Logs by ID  */

router.get("/:id", validateJWT, async (req, res) => { 
    const { id } = req.params;

    try {
        const userLogs = await LogModel.findAll({ //findAll() method returns us a promise, which we can await the response of and assign it to a variable userLogs.
            //we want to look at the id in the owner_id column in the database and find the log entries that correlate with 
            //that specific user id we extracted using the validateSession middleware function
            where: {
                owner_id: id
            }
        });

        res.status(200).json(userLogs);

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/* PUT/UPDATE Endpoint */

router.put("/:id", validateJWT, async (req, res) => { 
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;

    //this is the location where to place the new data, if found
    const query = {
        where: {
            id: logId,
            owner_id: userId
        }
    };
    
    //this contains the new data 
    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        //update method takes 2 arguments(1st: value we want to edit into the db, 2nd: where to place the new data if a match is found)
        const update = await LogModel.update(updatedLog, query); 
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

/* Delete Endpoint */

router.delete('/:id', validateJWT, async (req, res) => {
    const logId = req.params.id;//retrieve the id of the journal from the url parameter
    const userId = req.user.id; //retrieve the user id that send the request

    try {
        //a query that selects an entry that matches the logId and is owned by the user sending the request
        const query = {
            where: {
                id: logId,
                owner_id: userId
            }
        }

        await LogModel.destroy(query); //destroy is a sequelize method

        res.status(200).json({
            message: `Log Entry Removed`
        })
    } catch(err) {
        res.status(500).json({
            error: err,
        })
    }
})


module.exports = router; //export the module for usage outside of the file.

