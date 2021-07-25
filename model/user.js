const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            match : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        password : {
            type : String,
            required : true
        },
        rule : {
            type : String,
            default : 'user'
        }
    },
    {
        timestamps : true
    }
)

userSchema.pre('save', async function(next){
    try{
        const salt = await bcryptjs.genSalt(10)
        const passwordHash = await bcryptjs.hash(this.password, salt)

        this.password = passwordHash;

        next()
    }
    catch(err){
        next(err)
    }
})

userSchema.methods.comparePassword = async function(isInputPassword, cb){

    await bcryptjs.compare(isInputPassword, this.password, (err, isMatch)=> {
        if(err) return cb(err)
        cb(isMatch)
    })
}

module.exports = mongoose.model('user', userSchema)

