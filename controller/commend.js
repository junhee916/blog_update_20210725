const commendModel = require('../model/commend')

exports.commends_get_commend = async(req, res) => {

    const id = req.params.commendId

    try{
        const commend = await commendModel.findById({id})
        .populage('user', ['email'])
        .populage('board', ['board'])

        if(!commend){
            return res.status(403).json({
                msg : "no commendId"
            })
        }
        else{
            res.status(200).json({
                msg : "get commend",
                commendInfo : {
                    id : commend._id,
                    user : commend.user,
                    board : commend.board,
                    commend : commend.commend
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

exports.commends_post_commend = async(req, res) => {

    /*
    * commend
    * data : user, board, commend -> req.body  
    */

    const {user, board, commend} = req.body

    const newCommend = new commendModel(
        {
            user, board, commend
        }
    )

    try{
        await newCommend.save()

        res.status(200).json({
            msg : "register commend",
            commendInfo : {
                id : commend._id,
                user : commend.user,
                board : commend.board,
                commend : commend.commend
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.commends_update_commend = async(req, res) => {

    const id = req.params.commendId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        const commend = await commendModel.findByIdAndUpdate(id, {$set : updateOps})

        if(!commend){
            return res.status(403).json({
                msg : 'no commendId'
            })
        }
        else{
            res.status(200).json({
                msg : "update by commend id: ", id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message 
        })
    }
};

exports.commends_delete_all = async(req, res) => {

    try{
        await commendModel.remove()

        res.status(200).json({
            msg : 'delete commends'
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.commends_delete_commend = async(req, res) => {

    const id = req.params.commendId

    try{
        const commend = await commendModel.findOneAndRemove({id})

        if(!commend){
            return res.status(403).json({
                msg : "no commendId"
            })
        }
        else{
            res.status(200).json({
                msg : "delete by commend id : ", id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};