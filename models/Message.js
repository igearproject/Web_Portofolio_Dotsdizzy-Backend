const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    message:{
        type:String,
        required:true,
        maxLength:255
    },
    subject:{
        type:String,
        required:true,
        maxLength:255
    },
    emailId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Emails'
    },
    emailTo:{
        type:String,
        required:true,
        maxLength:255
    }
},{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
 
module.exports = Message;