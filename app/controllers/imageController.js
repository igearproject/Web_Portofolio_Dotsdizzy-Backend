const Images=require('../../models/Images');
const cloudinary=require('../../config/cloudinary');
// const upload=require('../../config/multer');
const fs=require('fs');
const path = require('path');
const Validator=require('fastest-validator');
const v=new Validator();


const add=async(req,res)=>{
    // console.log(req.body);
    const schema={
        alt_text:{type:'string',optional:true},
        thumbnail:{type:'string',enum:['true','false'],optional:true},
        // thumbnail:{type:'boolean',optional:true},
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

        const thumbnail=req.body.thumbnail==="true"?true:false;

        const data=await Images.create({
            fileName:req.file.filename,
            cdnUrl:cdn.secure_url,
            cdnId:cdn.public_id,
            alt_text:req.body.alt_text,
            thumbnail:thumbnail
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
    const limit=parseInt(req.query.limit)||12;
    const page=parseInt(req.query.page)-1||0;
    // const skip=page*limit;
    const last=req.query.last||'';
    const searchBy=req.query.searchBy||'fileName';
    const searchKey=req.query.searchKey||'';
    const sortBy=req.query.sortBy||'createdAt';
    const sortOption=req.query.sortOption||'desc';
    let filter={
        [searchBy]:{
            $regex:searchKey,
            $options:"i"
        }
    };
    if(last){
        if(sortOption==="desc"){
            filter[sortBy]={$lt:last};
        }else{
            filter[sortBy]={$gt:last};
        }
        
    }
    const total=await Images.countDocuments({
        [searchBy]:{
            $regex:searchKey,
            $options:"i"
        }
    });
    const data=await Images.find(filter)
        .sort({[sortBy]:sortOption})
        // .skip(skip)
        .limit(limit)
        .exec();
    if(!data){
        return res.json({
            status:'success',
            data:[]
        });
    }
    let next;
    if(data.length>0){
        next={
            by:sortBy,
            value:data[data.length-1][sortBy]
        // [sortBy]:data[data.length-1][sortBy]
        }
    }
    console.log(next);
    return res.json({
        status:'success',
        data:data,
        total,
        limit,
        next,
        // page:page+1,
        // totalPage:Math.ceil(total/limit)
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