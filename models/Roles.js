const mongoose=require('mongoose');

const roleSchema=new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
        unique:true,
        maxLength:255
    },
    description:String,
    // createdAt: { 
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: { 
    //     type: Date,
    //     default: Date.now
    // }
},{
    timestamps: true
});

const Roles = mongoose.model('Roles', roleSchema);
 
module.exports = Roles;