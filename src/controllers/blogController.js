const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

// Phase - 1 ------------------------------------------------->

// POST/blogs  
const createBlog = async function (req, res) {
    try {
        let data = req.body

        // Checking title present or not
        if (!data.title) return res.status(400).send({ msg: "Title is required" })

        if (!data.body) return res.status(400).send({ msg: "Blog body is required" })

        if (!data.category) return res.status(400).send({ msg: "Blog category is required" })

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
        const cat = req.query.category;
        const subcat = req.query.subcategory;
        const tag = req.query.tags;
        const query = req.query;
        const id = query.authorId;

        //validate author
        if (id) {
            const validauthor = await authorModel.findById({ _id: id }).select({ _id: 1 });
            if (!validauthor) return res.status(400).send({ status: false, msg: "Author does not exist" });
        }

        // validate catagory
        if (cat) {
            const validcat = await blogModel.find({ category: cat });
            if (validcat.length == 0) {
                return res.status(400).send({ status: false, msg: "Category does not exist " });
            }
        }

        // validate tag
        if (tag) {
            const validtag = await blogModel.find({ tags: "tags.tag" });
            if (validtag.length == 0) {
                return res.status(400).send({ status: false, msg: "Tag does not exist " });
            }
        }

        // validate subCatagory
        if (subcat) {
            const validsubcategory = await blogModel.find({ subcategory: subcat });
            if (validsubcategory.length == 0) {
                return res.status(400).send({ status: false, msg: "SubCategory does not exist " });
            }
        }
        // Fetcting all the blogs that have => isDeleted: false, isPiblished: true
        let getallBlog = await blogModel.find({ $or: [{category: cat}, {tags: tag}, {subcategory: subcat}, {authorId: id}], isDeleted: false, isPublished: true })
        if (getallBlog.length == 0) {
            return res.status(404).send({ msg: "No blog found" })
        } else return res.status(200).send({ msg: "Blogs are successfully fetched: ", getallBlog })

        // const { authorId, category, tags, subcategory } = query;
        // const blog = await blogModel.find(query); // Finding data from blogModel, received input from query.
        // if (!blog.length) {
        //     return res.status(404).send({ status: false, msg: "NOT found" });
        // }
        // return res.status(200).send({ status: true, msg: blog });
    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


// PUT/blogs/:blogId

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.id
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let isPublished = req.body.isPublished

        if (!blogId) return res.status(400).send({ msg: "Blog Id is required" })

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
        let blogId = req.params.id

        if (!blogId) return res.status(400).send({ msg: "Blog Id is required" })

        // Cheking the blogId fromm blogModel exist or not 
        let checkBlogId = await blogModel.findById({ _id: blogId })

        if (!checkBlogId) return res.status(404).send({ msg: "Blog Id is not exist in our Data Base" })

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

const deleteBlog = async function (req, res) {
    try {
        let cat = req.query.category;
        let subcat = req.query.subcategory;
        let tag = req.query.tags;
        let query = req.query;
        let id = query.authorId;

        //validate author
        if (id) {
            const validauthor = await authorModel.findById({ _id: id }).select({ _id: 1 });
            if (!validauthor) return res.status(400).send({ status: false, msg: "Author does not exist" });
        }

        // validate catagory
        if (cat) {
            const validcat = await blogModel.find({ category: cat });
            if (validcat.length == 0) {
                return res.status(400).send({ status: false, msg: "Category does not exist " });
            }
        }

        // validate tag
        if (tag) {
            const validtag = await blogModel.find({ tags: "tags.tag" });
            if (validtag.length == 0) {
                return res.status(400).send({ status: false, msg: "Tag does not exist " });
            }
        }

        // validate subCatagory
        if (subcat) {
            const validsubcategory = await blogModel.find({ subcategory: subcat });
            if (validsubcategory.length == 0) {
                return res.status(400).send({ status: false, msg: "SubCategory does not exist " });
            }
        }

        let { authorId, category, tags, subcategory, isPublished } = query;
        let blog = await blogModel.find(query); // Finding data from blogModel, received input from query.

        if (blog) {
            // Updating document isDeleted = true
            blog = await blogModel.updateMany({ isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } })

        } if (!blog) {
            return res.status(404).send({ status: false, msg: "NOT found" })
        }
        else {
            return res.status(200).send({ status: true, msg: blog });
        }


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
module.exports.deleteBlog = deleteBlog // DELETE /blogs?queryParams