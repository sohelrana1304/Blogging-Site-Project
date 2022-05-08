const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

// Phase - 1 ------------------------------------------------->

// Validation
const isValid = function(value){
    if (typeof (value)==='undefined'|| typeof(value)=== null){
        return false
    }
    if (typeof(value)=== "string" && (value).trim().length == 0){
        return false
    } return true

}

// Author APIs /authors

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        // Checking input from req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request,No Data Provided" })
        };

        const {fname, lname, title, email, password} = data

        if (!isValid(fname)) return res.status(400).send({msg: "First Name is Required"})

        if (!isValid(lname)) return res.status(400).send({msg: "Last Name is Required"})

        if (!isValid(title)) return res.status(400).send({msg: "Title is Required"})

        if (!isValid(email)) return res.status(400).send({msg: "Email Id is Required"})

        if (!isValid(password)) return res.status(400).send({msg: "Password is Required"})

        // This is the mail format for checking if the inputted email id perfectely formatted or not
        let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // Checking if the inputted email id perfectely formatted or not
        if (!(data.email.match(mailFormat))) {
            return res.status(400).send({msg: "Valid Email Id is Required"})
        }

        let emailid = req.body.email
        // Checking the inputted email id is already existed in our data base or not
        let reusedEmail = await authorModel.findOne({email: emailid})
        if (reusedEmail){
            return res.status(400).send({msg: "Email Id is alrady registered"})
        }

        let authorData = await authorModel.create(data)
        res.status(201).send({status: true, msg: "Author data has been captured successfully", authorData})
        
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


// POST /login

const userLogin = async function (req, res){
    try{
        let data = req.body
        // Checking input from req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request,No Data Provided" })
        };

        let userName = req.body.email
        let password = req.body.password

        // Checking input from req.body for username
        if(!isValid(userName)) return res.status(400).send({status: false, msg:"Input user name"})
        // Checking input from req.body for password
        if(!isValid(password)) return res.status(400).send({status: false, msg:"Input password"})

        // Finding user from author collection
        let findUser = await authorModel.findOne({status:false, email: userName, password: password})
        if (!findUser) return res.status(400).send({msg: "User is not exist"})

        let token = await jwt.sign({userId: findUser._id.toString()}, 'India')
        res.status(201).send({status: true, msg:"Login successfull", token})

    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.createAuthor = createAuthor // Author APIs /authors
module.exports.userLogin = userLogin // POST /login

