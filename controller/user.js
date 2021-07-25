const userModel = require('../model/user')
const jwt = require('jsonwebtoken')

exports.users_get_all = async (req, res) => {

    try{
        /*
        * total get userInfo / find() 진행 
        */
        const users = await userModel.find()

        res.status(200).json({
            msg : "get users",
            length : users.length,
            userInfo : users.map(user => {
                return {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_get_user = async(req, res) => {

    /*
    * params에서 진행한 id로 진행을 할 때에는 findById()
    */

    const id = req.params.userId

    try{
        const user = await userModel.findById({id})

        /*
        * 해당 데이터를 제거했을 때 알아보기 위한 조건문 생성 
        */

        if(!user){
            return res.status(402).json({
                msg : 'no userId '
            })
        }
        else{

            res.status(200).json({
                msg : "get user",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_signup_user = async(req, res) => {

    /*
    *  회원가입 
    * data : name, email, password -> req.body
    */

    const { name, email, password } = req.body

    try{

        /*
        *  email 중복 확인 
        */
       const user = await userModel.findOne({email})

       if(user){
           return res.status(400).json({
               msg : 'user email, please other email'
           })
       }
       else{
           /*
           * email 중복확인 완료 / 회원가입을 할 수 있는 조건이 성립해서 userModel 생성자를 만든다.
           */
           const user = new userModel(
               {
                   name, email, password
               }
           )

           /*
           * 회원가입에 대한 정보를 save를 할 때 비밀번호를 암호화해야한다. 
           */
           await user.save()

           res.status(200).json({
               msg : "success signup",
               userInfo : {
                   id : user._id,
                   name : user.name,
                   email : user.email,
                   password: user.password
               }
           })
       }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_login_user = async(req, res) => {

    /*
    * 로그인
    * data : email, password -> req.body
    */

    const {email, password} = req.body

    try{

        /*
        *   db에 email 유뮤 확인
        */

        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{

            await user.comparePassword(password, (err, isMatch) => {
                if(!isMatch || err){
                    return res.status(401).json({
                        msg : 'no match password'
                    })
                }
                else{
                    /*
                    * 비밀번호 암호화 된 것을 원상태로 돌리면 jsonwebtoken을 진행한다.
                    */
                    const payload = {
                        id : user._id,
                        email : user.email
                    }
                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {expiresIn : '1h'}
                    )

                    res.status(200).json({
                        msg : 'success login',
                        tokenInfo : token
                    })
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_update_user = async (req, res) => {

    const id = req.params.userId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        const user = await userModel.findByIdAndUpdate(id, {$set : updateOps})

        if(!user){
            return res.status(402).json({
                msg : 'no userId'
            })
        }
        else{
            res.status(200).json({
                msg : 'update user by id: ', id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_delete_all = async(req, res) => {
    try{
        await userModel.remove()

        res.status(200).json({
            msg : "delete users"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.users_delete_user = async(req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findByIdAndRemove({id})

        if(!user){
            return res.status(402).json({
                msg : 'no userId'
            })
        }
        else{
            res.status(200).json({
                msg : 'delete user by id: ', id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

