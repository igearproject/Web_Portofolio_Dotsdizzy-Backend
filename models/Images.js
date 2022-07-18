const mongoose=require('mongoose');

const imageSchema=new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    fileName:{
        type:String,
        required:true,
        maxLength:255,
        unique:true
    },
    cdnUrl:{
        type:String,
    },
    cdnId:{
        type:String,
    },
    alt_text:String,
    thumbnail:{
        type:Boolean,
        default:false,
    },
},{
    timestamps: true
});

const Images = mongoose.model('Images', imageSchema);
 
module.exports = Images;