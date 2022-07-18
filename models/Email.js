const mongoose=require('mongoose');

const emailSchema=new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
        maxLength:255
    },
    email:{
        type:String,
        required:true,
        unique:true,
        maxLength:255
    },
    token:{
        type:String,
        required:false,
        // unique:true
    },
    verifed:{
        type:Boolean,
        default:false
    },
    // createdAt: { 
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: { 
    //     type: Date,
    //     default: Date.now
    // },
    message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
},{
    timestamps: true
});

const Emails = mongoose.model('Emails', emailSchema);
 
module.exports = Emails;