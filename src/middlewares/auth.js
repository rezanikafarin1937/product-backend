const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function auth(req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).send("Access denied");
    }

    try {
        const decode = jwt.verify(
            token,
            process.env.SECRET_KEY
        );

        next();

    } catch (err) {
        return res.status(400).send(err.message);
    }
}

module.exports = auth;


// import jwt from "jsonwebtoken"
// import dotenv from "dotenv";

// dotenv.config();

// function auth(req,res,next){
//     const token = req.header("Authorization")
//     if(!token){
//         return res.status(401).send("Access denied")
//     }

//     try{
//     const decode = jwt.verify(token,process.env.SECRET_KEY)
//     }
//     catch(err){
//         return res.status(400).send(err)
//     }

// }

// module.exports = auth;