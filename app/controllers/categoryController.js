const Categorys=require('../../models/Categorys');
const Projects=require('../../models/Projects');
const Validator=require('fastest-validator');
const v=new Validator();

const add=async(req,res)=>{
    const schema={
        name:{type:'string',empty:false},
        description:{type:'string',optional:true},
    };
    const validate=v.validate(req.body,schema);

    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }

    try{
        const data=await Categorys.create({
            name:req.body.name,
            description:req.body.description,
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
    const data=await Categorys.find().exec();
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
        const data=await Categorys.findOne({
            _id:req.params.id
        }).exec();
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
        name:{type:'string',optional:true},
        description:{type:'string',optional:true},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }
    
    try{

        const data=await Categorys.findOne({_id:req.params.id}).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Category not found'
            });
        }
        if(req.body.name) data.name=req.body.name;
        if(req.body.description) data.description=req.body.description;
        await data.save();

        return res.json({
            status:'success',
            data:data
        });

    }catch(error){
        message=error.message;
        if(error.code === 11000) {
            message="Categorys already exist"
        };
        return res.status(500).json({
            status:'error',
            message:message
        });
    }
}

const destroy=async(req,res)=>{    
    
    try{
        const data=await Categorys.findOne({_id:req.params.id}).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Category not found'
            });
        }
        data.delete();
        const project=await Projects.findOne({"categorys._id":data._id}).exec();
        if(project && project.categorys){
            project.message.pull({_id:data._id});
            project.save();
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

module.exports={
    add,
    getAll,
    getOne,
    update,
    destroy
};