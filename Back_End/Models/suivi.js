const mongoose = require("mongoose")


const suiviSchema = new mongoose.Schema({
    _user1 : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    _user2 :{
        type : mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    status : {
        type : String,
        enum:['suvi','non suivi'],
        default:'non suivi'
    }},
    {timestamps:true}
)

const suivi = mongoose.model('suivi', suiviSchema);


module.exports=suivi