const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

// Phase - 1 ------------------------------------------------->

// Author APIs /authors

const createAuthor = async function (req, res) {
    try {
        let data = req.body

        if (!data.fname) return res.status(400).send({msg: "First Name is Required"})

        if (!data.lname) return res.status(400).send({msg: "Last Name is Required"})

        if (!data.title) return res.status(400).send({msg: "Title is Required"})

        if (!data.email) return res.status(400).send({msg: "Email Id is Required"})

        if (!data.password) return res.status(400).send({msg: "Password is Required"})

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
        let userName = req.body.email
        let password = req.body.password

        // Finding user from author collection
        let findUser = await authorModel.findOne({status:false, email: userName, password: password})
        if (!findUser) return res.status(404).send({msg: "User is not exist"})

        let token = await jwt.sign({userId: findUser._id.toString()}, 'India')
        res.status(201).send({status: true, msg: token})

    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.createAuthor = createAuthor // Author APIs /authors
module.exports.userLogin = userLogin // POST /login

