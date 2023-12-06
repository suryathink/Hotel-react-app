const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const blacklistTokenData = require("../models/blacklist")

const {signup,login,verifyToken, getUserById,addImage}= require("../controllers/authController")

async function authMiddleware(req, res, next) {
    try {
        const headers = req.headers;

        const authHeader = headers['authorization'];

        if (authHeader) {

            const token = authHeader.split(' ').pop();
   
            // blacklist code
            let blacklistedToken = await blacklistTokenData.findOne({token})
            if(blacklistedToken){
                return res.status(401).json({ message: 'Unauthorized, Login Again' });
              }
                 // blacklist code ends here
                 
            const payload = verifyToken(token);

            const user = await getUserById(payload._id);
             
            req.loggedInUser = user; 

            next();

        } else {
            return res.status(400).send({
                message: 'User is not logged in'
            })
        }
    } catch(err) {
        console.error(err);

        return res.status(500).send({
            error: 'Something went wrong'
        })
    }
}

module.exports = authMiddleware;