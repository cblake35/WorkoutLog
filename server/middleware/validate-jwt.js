const jwt = require("jsonwebtoken"); //requires the use of jsonwebtoken to allow the access for the specifics users token
const { UserModel } = require("../models");//allows communication with the model in the databse to access more information

const validateJWT = async (req, res, next) => {
    if (req.method == "OPTIONS") { //OPTIONS is the first part of the preflighted request. This is to determine if the actual request is safe to send. 
        //Req, res, and next are parameters that can only be accessed by express middleware functions. next() is a nested middleware function that, when called, passes control to the next middleware function.
        next();
        //If we are dealing with a POST, GET, PUT, or DELETE request, we want to see if there is any data in authorization header of the incoming request AND if that string includes the word Bearer.
    } else if (req.headers.authorization && req.headers.authorization.includes("Bearer")) { 
        //we use object deconstruction to pull the value of the authorization header and store it in a variable called authorizaition.
        const { authorization } = req.headers;
        console.log('authorization -->', authorization)
        const payload = authorization
        //This ternary verifies the token if authorization contains a truthy value. If it does not contain a truthy value, 
        //this ternary returns a value of  which is then stored in a variable called payload.
            ? jwt.verify( //The verify method decodes the token(first param: our token, 2nd param: our JWT_SECRET)
                authorization.includes('Bearer') // Bearer token are web standard to be used with tokens
                    ? authorization.split(' ')[1]//if the word Bearer is included we extrapolate and return just the token.
                    : authorization, //If the word "Bearer" was not included in the authorization header, then return just the token
                process.env.JWT_SECRET
            )
            : undefined;

        console.log('payload -->', payload) //payload is the the data being sent via the token;

        // If payload comes back as a truthy value, we use Sequelize's "findOne" method to look for a user in our
        // UserModel where the ID of the user in database matches the ID stored in the token. It then stores the 
        //value of the located user in a variable called foundUser.
        if (payload) {
            let foundUser = await UserModel.findOne({
                where: {
                    id: payload.id
                }
            });
            console.log('foundUser -->', foundUser);

            //If we managed to find a user in the database that matches the information from the token, we create a new property called "user" to express's request object.
            //The value of this new property is the information stored in foundUser. Recall that this includes the username and password of the user.
            if (foundUser) {
                console.log('request -->', req)
                req.user = foundUser;
                next(); //simply exits us out of this function
            } else {
                res.status(400).send({ message: 'Not Authorized.' }) //If our code was unable to locate a user in the database, it will return a response with a 400 status code
            }
        } else {
            res.status(401).send({ message: 'Invalid Token' }); //If payload came back as undefined, we return a response with a 401 status code and a message that says "Invalid token".
        }
    } else {
        res.status(403).send({ message: 'Forbidden' });//If the authorization object in the headers object of the request is empty or does not include the word "Bearer"
    }
};

module.exports = validateJWT; //exports the function to be used within the server 