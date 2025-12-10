const {Router} = require("express")
const multer = require("multer")
const path = require("path")
const Blog = require("../models/blog")


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        return cb(null, path.resolve(`./public/uploads/`))
    },
    filename: (req, file, cb)=>{
        return cb(null, `${Date.now()}--${file.originalname}`)
    }
})

const upload = multer({storage: storage})

const router = Router()

router.get("/add", (req, res)=>{
    res.render("addBlog", {
        user : req.user
    })
})

router.post("/", upload.single("coverImageURL"), async (req, res)=>{
    const {title, body} = req.body
    await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
    })

    res.redirect("/")

    console.log(req.file)
})

router.get("/:id", async (req, res)=>{
    const id = req.params.id
    const blog = await Blog.findOneAndUpdate({_id : id},
        {$push:{visitHistory: {timestamp: new Date().toLocaleString()}}},
        {new:true}
    ).populate('createdBy')

    res.render("blog", {
        user: req.user,
        blog: blog, // This was missing in your original route!
        id,
        req,
    })
})


module.exports = router