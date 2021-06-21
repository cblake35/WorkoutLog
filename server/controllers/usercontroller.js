const router = require('express').Router(); //We import the Express framework and access the Router()  method, assigning it to a variable
const { UserModel } = require('../models'); //We use object deconstructing to import the user model and store it in UserModel variable. It is convention to use Pascal casing (uppercase on both words) for a model class with Sequelize
const jwt = require('jsonwebtoken'); //requires jsonwebtoken to be used in the usercontroller file
const bcrypt = require('bcrypt'); //requires bcrypt to encode sensitive information in our server(see bottom)

router.post('/register', async (req, res) => {

    let { username, passwordhash } = req.body.user;

    try { //Try...catch statements are a part of JavaScript that allows a section of code to be attempted.
        const User = await UserModel.create({
            username,
            passwordhash: bcrypt.hashSync(passwordhash, 15) //hashSync takes in 2 parameters. First is password we want salted. 2nd is the number of time we want it salted.
        });

        //sign() is the method we use to create the token
        //user is the primary key of the user table and is the number assigned to the user when created in the databas
        //second parameter is the signature, third parameter is the duration of when the token will expire. This case 24hrs
        //third parameter is optional
        //process.env.JWT_SECRET refers to the signature of the user that we dont want seen by other users(see .gitignore & env file)
                                //payload       //signature             /optional parameter
        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(202).json({
            message: 'User succesfuly registered',
            user: User,
            sessionToken: token //Assigns a token to a specific user and the client
        })
    } catch(err) { //if the code fails, it will throw an exception which we can capture and use that to convey a message to the client via our response

        //If the error is an instance of the a UniqueConstraintError (we imported that variable from sequelize at the top of our file), then create a
        //different response. This response will have a status code of 409 and a message that says that the email is already in use. If it is not a 
        //UniqueConstraintError, then throw our normal 500 error.
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    }
})

module.exports = router; //export the module for usage outside of the file.

/* Tokenization */
//It's an identifier to be added to the body of a request, so that when you send a request, you send a token with it.
//We use a token for authenticated requests; which are requests for which a user has to be authenticated (logged in) to do CRUD type stuff
//A token consists of 3 parts
// ----header(type of token and algorithm to encode/decode)
// ----payload(data being sent)
// ----signature(used by algorith to encode/decode)

/* Bcrypt(ENCRYPTION)*/
//salt - is a random string that makes the hash unpredictable
//hash - the output after salting a password(one-way calculation) or after being salted

//bcrypt.compare(string, hash, callbackFunction, progressCallbackFunction) last 2 arguments are optional

/* Authenticated Routes(middleware function) */
//An authenticated route is another way of saying a protected route. There are parts of our database and 
//site that we only want certain people to be able to access, and only certain parts that those certain people are allowed into.
//--we use the middleware function to act as a gate between client and server
