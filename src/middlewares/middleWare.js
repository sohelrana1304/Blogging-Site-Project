const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken")


let authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(404).send({ status: false, msg: "Token must be present" });
        let decodedToken = jwt.verify(token, "India");

        if (!decodedToken)
            return res.status(400).send({ status: false, msg: "Invalid Token" })
        req.tokenUserId = decodedToken.userId

        next();
    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

const authorization = async function (req, res, next){
    try{
        let tokenUserId = req.tokenUserId
        let user = req.body.authorId
        if (!user){
            user = req.query.authorId
        }
        // console.log(user, tokenUserId)
        if (user != tokenUserId) return res.status(404).send({ msg: "User must login" })
    next();
    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

const authorization2 = async function (req, res, next){
    try{
        let tokenUserId = req.tokenUserId
        let user = req.body.authorId
        // let user = req.params.blogId
       
        if (!user){
            user = req.params.blogId
        }

        let findAuthor = await blogModel.findById({_id: user}).select({authorId: 1, _id: 0})
        if(!findAuthor) return res.status(404).send({ msg: "Unauthorized access" })
        let findAuthorId = findAuthor.authorId.toString() //for extrxting id like this - 626ba1610a95a6c52d0b4d0b
        // console.log(findAuthorId)
        if (findAuthorId != tokenUserId) return res.status(404).send({ msg: "User must be login" })

    next();
    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.authentication = authentication
module.exports.authorization = authorization
module.exports.authorization2 = authorization2


// Token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjY4NTA5ODIxNjc3NDE4MWUyZmRkNDEiLCJpYXQiOjE2NTE1ODUzNTd9.GihKIqwFTN8VM46YdFOVgWKCR0-2Q6uHcsRxj5BIgEY