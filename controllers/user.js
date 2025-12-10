const User = require("../models/user")

async function handelUserSignup(req, res){
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password
    })

    res.redirect("/")
}

async function handelUserSignin(req, res){
    const {email, password} = req.body
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password)
        res.cookie("uid", token)
        return res.redirect("/")
    }
    catch(error){
        return res.render("signin", {
            error: "Incorrect email or password"
        })
    }
}

module.exports = {handelUserSignup, handelUserSignin}