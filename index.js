const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const {connection} = require("./connection")
const cookieParser = require("cookie-parser")
// const multer = require("multer")

const Blog = require("./models/blog")

const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const { checkForAuthentication } = require("./middleware/authentication")

const app = express()
const PORT = 8001

connection("mongodb://127.0.0.1:27017/Blogify")

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(express.static(path.resolve("./public")))
app.use(checkForAuthentication("uid"))

app.get("/", async (req, res)=>{
    const allBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    })
})

app.use("/user", userRoute)
app.use("/blog", blogRoute)

app.listen(PORT, ()=> console.log(`Server running on PORT: ${PORT}`))