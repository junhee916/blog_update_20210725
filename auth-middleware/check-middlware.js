const jwt = require('jsonwebtoken')

/*
* middleware 역할
* 로그인하면 token이 생성되는데 그 token을 복호화해서 사용할 수 있게 한다. 
*/

module.exports = async(req, res, next) => {

    try{
        const token = req.headers.authorization.split(' ')[1]

        const decode = jwt.verify(token, process.env.SECRET_KEY)

        req.userData = decode;
        
        next()
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }    
} 