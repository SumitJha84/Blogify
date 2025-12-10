const {Router} = require("express")
const {handelUserSignup, handelUserSignin} = require("../controllers/user")

const router = Router()

router.get("/signin", (req, res)=>{
    res.render("signin")
})

router.get("/signup", (req, res)=>{
    res.render("signup")
})

router.get("/logout", (req, res)=>{
    res.clearCookie("uid").redirect("/")
})

router.post("/signup", handelUserSignup)

router.post("/signin", handelUserSignin)

module.exports = router;