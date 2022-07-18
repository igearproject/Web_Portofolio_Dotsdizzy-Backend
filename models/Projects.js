const mongoose=require('mongoose');

const projectSchema=new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    title:{
        type:String,
        required:true,
        maxLength:255
    },
    description:String,
    tags:String,
    url:String,
    metaKeyword:{type:String,maxLength:255},
    metaDescription:{type:String,maxLength:255},
    published:{
        type:Boolean,
        default:false
    },
    showAtHome:{
        type:Boolean,
        default:false
    },
    categorys:[{
        _id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Categorys'
        },
        name:{type:String,maxLength:255}
    }],
    images:[{
        _id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Images'
        },
    }]
},{
    timestamps: true
});

const Projects = mongoose.model('Projects', projectSchema);
 
module.exports = Projects;