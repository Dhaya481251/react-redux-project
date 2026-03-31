const jwt = require('jsonwebtoken');

const generateToken = (res,userId,cookieName = 'jwt') => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })

    res.cookie(cookieName,token,{
        httpOnly:true,
        secure:process.env.NODE_ENV,
        sameSite:'lax',
        maxAge:24*60*60*1000
    })
    return token;
}

module.exports = generateToken;
