const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
// const jwt = require("jsonwebtoken");

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
// POST/blogs  
const createBlog = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request,No Data Provided" })
        };

        const {title, body, category} = data

        // Checking title present or not
        if (!isValid(title)) return res.status(400).send({ msg: "Title is required" })

        if (!isValid(body)) return res.status(400).send({ msg: "Blog body is required" })

        if (!isValid(category)) return res.status(400).send({ msg: "Blog category is required" })

        let authorId = req.body.authorId
        // Validating author id from authorModel
        let checkAuthor = await authorModel.findById({ _id: authorId })
        if (!checkAuthor) {
            return res.status(400).send({ msg: "Author ID is not exist in our data base" })
        }

        if (data.isPublished == true) // if published is true publishedAt will have a date
            data.publishedAt = new Date();

        if (data.isDeleted == true) // if isDeleted is true deletedAt will have a date
            data.deletedAt = new Date();

        let blogCreated = await blogModel.create(data) // Blog created

        return res.status(201).send({ status: true, msg: "Blog has been created successfully", blogCreated })

    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })

    }
}


// GET /blogs

const getBlog = async function (req, res) {
    try {
        let options = [{ authorId: req.query.authorId }, { tags: req.query.tags }, { category: req.query.category }, { subcategory: req.query.subcategory }]

        if (!Object.keys(req.query).length) {
            let filter = await blogModel.find({ isDeleted: false, isPublished: true, authorId: req.tokenUserId }).populate('authorId')
            return res.status(200).send({ status: true, filter })
        }

        let filter = await blogModel.find({ $or: options, isDeleted: false, isPublished: true }).populate('authorId')
        if (!filter.length)
            return res.status(404).send({ status: false, msg: "No such documents found" })
        res.status(200).send({ status: true, data: filter })
    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

// PUT/blogs/:blogId

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let isPublished = req.body.isPublished

        let data = req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request,No Data Provided" })
        };

        // if (!blogId) return res.status(400).send({ msg: "Blog Id is required" })

        // Finding blogId from blogModel
        let checkBlogId = await blogModel.findById({ _id: blogId })

        if (!checkBlogId) return res.status(404).send({ msg: "Blog Id is not exist in our Data Base" })

        // Checking the particular blog deleted or not
        if (checkBlogId.isDeleted == true) return res.status(404).send({ msg: "The blog has been deleted" })

        // Updating existing blog data that received from body
        let updateData = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { title: title, body: body, tags: tags, subcategory: subcategory, isPublished: isPublished } })

        if (isPublished == true) // if published is true publishedAt will have a date
            updateData.publishedAt = new Date();

        updateData = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { publishedAt: new Date() } })

        res.status(200).send({ status: true, msg: "The blog has been updated successfully", updateData })
    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


// DELETE /blogs/:blogId

const blogDelete = async function (req, res) {
    try {
        let blogId = req.params.blogId

        // Cheking the blogId fromm blogModel exist or not 
        let checkBlogId = await blogModel.findById({ _id: blogId })

        if (!checkBlogId) return res.status(400).send({ msg: "Blog Id is not exist in our Data Base" })

        // If in the existing blog isDeleted's attribute false it will updated to true
        if (checkBlogId.isDeleted == false) {
            let updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true } }, { new: true })
            // console.log(updateBlog)

            // Leaving time stamp, if the blog will be deleted
            if (updatedBlog.isDeleted = true)
                updatedBlog.deletedAt = new Date();
            updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { deletedAt: new Date() } })

            return res.sendStatus(200).end();
        }
        else {
            res.status(404).send({ msg: ["BlogId is already deleted"] })
        }

    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


// DELETE /blogs?queryParams

const deleteBlogByQp = async function (req, res) {
    try {
        if (!Object.keys(req.query).length)
            return res.status(400).send({ status: false, msg: "Please select some filters for deletion." })

        // Authorization Check
        delete req.query.authorId
        let id = req.tokenUserId
        let findBlogs = (await blogModel.find({ $and: [req.query, { authorId: id }, { isDeleted: false }, { isPublished: false }] }))

        if (!findBlogs.length)
            return res.status(404).send({ status: false, msg: "No documents found." })

        let blogs = await blogModel.updateMany({ _id: findBlogs }, { isDeleted: true, deletedAt: Date.now() })
        if (blogs.matchedCount == 0)
            return res.status(404).send({ status: false, data: "No documents found." })
        res.status(200).send({ status: true, data: `Total deleted document count: ${blogs.modifiedCount}` });

    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }

}



module.exports.createBlog = createBlog // POST/blogs
module.exports.getBlog = getBlog // GET /blogs
module.exports.updateBlog = updateBlog // PUT/blogs/:blogId
module.exports.blogDelete = blogDelete // DELETE /blogs/:blogId
module.exports.deleteBlogByQp = deleteBlogByQp // DELETE /blogs?queryParams