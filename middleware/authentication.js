const { verifyUserToken } = require("../services/authentication");


function checkForAuthentication(cookieName){
    return(req, res, next)=>{
        const token = req.cookies[cookieName];
        if(!token) return next();
        
        try{
            const userPayload = verifyUserToken(token);
            req.user = userPayload
        }
        catch(err){}
        
        next()
    }
}

module.exports = {
    checkForAuthentication,
}