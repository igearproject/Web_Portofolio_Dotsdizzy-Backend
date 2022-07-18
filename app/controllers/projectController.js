const Projects=require('../../models/Projects');
// const Categorys=require('../../models/Categorys');
// const Images=require('../../models/Images');
const Validator=require('fastest-validator');
const v=new Validator();

const add=async(req,res)=>{
    const schema={
        title:{type:'string',empty:false},
        description:{type:'string',empty:false},
        tags:{type:'string',optional:true},
        url:{type:'string',empty:false},
        metaKeyword:{type:'string',optional:true},
        metaDescription:{type:'string',optional:true},
        published:{type:'boolean',optional:true},
        showAtHome:{type:'boolean',optional:true},
    };
    const validate=v.validate(req.body,schema);

    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }

    try{
        const data=await Projects.create({
            title:req.body.title,
            description:req.body.description,
            tags:req.body.tags,
            url:req.body.url,
            metaKeyword:req.body.metaKeyword,
            metaDescription:req.body.metaDescription,
            published:req.body.published,
            showAtHome:req.body.showAtHome
        });
        return res.json({
            status:'success',
            data:data
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

const getAll=async(req,res)=>{
    const data=await Projects.find().exec();
    if(!data){
        return res.json({
            status:'success',
            data:[]
        });
    }
    return res.json({
        status:'success',
        data:data
    });
}

const getOne=async(req,res)=>{
    try{
        const data=await Projects.findOne({
            _id:req.params.id
        }).populate('images').populate('categorys').exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Category not found'
            });
        }
        return res.json({
            status:'success',
            data:data
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

const update=async(req,res)=>{
    const schema={
        title:{type:'string',optional:true},
        description:{type:'string',optional:true},
        tags:{type:'string',optional:true},
        url:{type:'string',optional:true},
        metaKeyword:{type:'string',optional:true},
        metaDescription:{type:'string',optional:true},
        published:{type:'boolean',optional:true},
        showAtHome:{type:'boolean',optional:true},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }
    
    try{

        const data=await Projects.findOne({_id:req.params.id}).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Project not found'
            });
        }
        if(req.body.title) data.title=req.body.title;
        if(req.body.description) data.description=req.body.description;
        if(req.body.tags) data.tags=req.body.tags;
        if(req.body.url) data.url=req.body.url;
        if(req.body.metaKeyword) data.metaKeyword=req.body.metaKeyword;
        if(req.body.metaDescription) data.metaDescription=req.body.metaDescription;
        if(typeof req.body.published!=undefined) data.published=req.body.published;
        if(typeof req.body.showAtHome!=undefined) data.showAtHome=req.body.showAtHome;
        // data.title=req.body.title||data.title;
        // data.description=req.body.description||data.description;
        // data.tags=req.body.tags||data.tags;
        // data.url=req.body.url||data.url;
        // data.metaKeyword=req.body.metaKeyword||data.metaKeyword;
        // data.metaDescription=req.body.metaDescription||data.metaDescription;
        // if(typeof req.body.published!=undefined) data.published=req.body.published;
        // if(typeof req.body.showAtHome!=undefined) data.showAtHome=req.body.showAtHome;

        await data.save();

        return res.json({
            status:'success',
            data:data
        });

    }catch(error){
        message=error.message;
        if(error.code === 11000) {
            message="Projects already exist"
        };
        return res.status(500).json({
            status:'error',
            message:message
        });
    }
}

const destroy=async(req,res)=>{    
    
    try{
        const data=await Projects.findOne({_id:req.params.id}).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Projects not found'
            });
        }
        data.delete();
        return res.json({
            status:'error',
            message:'Delete Projects Successfuly'
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

module.exports={
    add,
    getAll,
    getOne,
    update,
    destroy
};