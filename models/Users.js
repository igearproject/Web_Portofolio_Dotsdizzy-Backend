const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
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
    password:{
        type:String,
        required:false
    },
    // pin:{
    //     type:Date,
    //     maxLength:10,
    //     required:false
    // },
    // pinExpiredIn:{
    //     type:Date,
    //     required:false
    // },
    token:{
        type:String,
        required:false
    },
    emailIsVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type: String, 
        enum: ['admin','client'],
        default:'client'
    }
    // role:{
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Roles'
    // }
    // status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
},{
    timestamps: true
});

const Users = mongoose.model('Users', userSchema);
 
module.exports = Users;