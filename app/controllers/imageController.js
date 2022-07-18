const Images=require('../../models/Images');
const cloudinary=require('../../config/cloudinary');
// const upload=require('../../config/multer');
const fs=require('fs');
const path = require('path');
const Validator=require('fastest-validator');
const v=new Validator();


const add=async(req,res)=>{
    const schema={
        alt_text:{type:'string',optional:true},
        thumbnail:{type:'boolean',optional:true},
    };
    const validate=v.validate(req.body,schema);

    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }

    try{
        const cdn=await cloudinary.uploader.upload(req.file.path, {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            folder: 'dotsdizzy'
        });

        const data=await Images.create({
            fileName:req.file.filename,
            cdnUrl:cdn.secure_url,
            cdnId:cdn.public_id,
            alt_text:req.body.alt_text,
            thumbnail:req.body.thumbnail
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
    const data=await Images.find().exec();
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
        const data=await Images.findOne({
            _id:req.params.id
        }).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Image not found'
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
        alt_text:{type:'string',optional:true},
        thumbnail:{type:'boolean',optional:true},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }
    
    try{

        const data=await Images.findOneAndUpdate({_id:req.params.id},{
            alt_text:req.body.alt_text,
            thumbnail:req.body.thumbnail
        },{new: true});
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Image not found'
            });
        }

        return res.json({
            status:'success',
            data:data
        });

    }catch(error){
        message=error.message;
        return res.status(500).json({
            status:'error',
            message:message
        });
    }
}

const destroy=async(req,res)=>{    
    
    try{
        const data=await Images.findOneAndDelete({_id:req.params.id});
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Images not found'
            });
        }
        await cloudinary.uploader.destroy(data.cdnId);
        // data.delete();
        await fs.unlink('./public/images/uploads/'+data.fileName,(err)=>{
            if(err) console.log(err);
        });
        return res.json({
            status:'error',
            message:'Delete Images Successfuly',
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