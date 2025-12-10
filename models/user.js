const {Schema, model} = require("mongoose")
const {randomBytes, createHmac} = require("crypto")
const { error } = require("console")
const {verifyUserToken,generateTokenForUser} = require("../services/authentication")

const userSchema = Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["ADMIN", "NORMAL"],
        default: "NORMAL"
    },
    profileImageURL:{
        type: String,
        default: "/images/profile_default"
    }
}, {timestamps: true})

userSchema.pre("save", function(next){
    const user = this

    if(!user.isModified("password")) return next()

    const salt = randomBytes(16).toString("hex")
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex")

    user.salt = salt
    user.password = hashedPassword

    next()
})

userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({email})
    if(!user) throw new Error("user not found")

    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex")

    if (hashedPassword !== userProvidedHash) throw new Error("Incorrect Password");

    const token = generateTokenForUser(user) 
    return token
})

const User = model("user", userSchema)

module.exports = User