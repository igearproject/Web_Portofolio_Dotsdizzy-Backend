const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
        unique:true,
        maxLength:255
    },
    description:String
},{
    timestamps: true
}
);

const Categorys = mongoose.model('Categorys', categorySchema);
 
module.exports = Categorys;