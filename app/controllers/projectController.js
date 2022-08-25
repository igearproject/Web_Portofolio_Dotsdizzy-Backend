const Projects=require('../../models/Projects');
// const Categorys=require('../../models/Categorys');
// const Images=require('../../models/Images');
const  { ObjectID } = require("mongodb");
const Validator=require('fastest-validator');
const v=new Validator();

const add=async(req,res)=>{
    const schema={
        title:{type:'string',empty:false},
        description:{type:'string',empty:false},
        tags:{type:'string',optional:true},
        url:{type:'string',empty:false,alphadash:true},
        metaKeyword:{type:'string',optional:true},
        metaDescription:{type:'string',optional:true},
        published:{type:'boolean',optional:true},
        showAtHome:{type:'boolean',optional:true},
        categorys: { type: "array", items: {
            type: "object", props: {
                _id: { type: "objectID",ObjectID },
                name: { type: "string", empty: false }
            }
        },optional:true},
        images: { type: "array", items: {
            type: "object", props: {
                _id: { type: "objectID",ObjectID },
            }
        },optional:true},
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
            showAtHome:req.body.showAtHome,
            categorys:req.body.categorys,
            images:req.body.images
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
    try{
        const page=parseInt(req.query.page)-1||0;
        const limit=parseInt(req.query.limit)||12;
        const skip=page*limit;

        const searchKey=req.query.searchKey||"";
        const searchBy=req.query.searchBy||"title";
        let sortBy=req.query.sortBy||"createdAt";
        const sortOption=req.query.sortOption||"desc";
        const category=req.query.category||"";
        let filter={
            [searchBy]:{$regex:searchKey,$options:"i"},
            // "categorys.name":{
            //     $regex:category,
            //     $options:"i"
            // }
        }
        if(category){
            filter["categorys.name"]=category
        }
        // console.log(filter)
        if(typeof sortBy==='object'){
            sortBy=sortBy[0]
        }
        const total=await Projects.countDocuments(filter);
        const data=await Projects.find(filter)
        // .populate('categorys', null, { name: { $in: "Vektor" }})
        // .sort({createdAt:'asc'})
        .sort({[sortBy]:sortOption})
        .skip(skip)
        .limit(limit)
        .exec();
        if(!data){
            return res.json({
                status:'success',
                data:[]
            });
        }
        return res.json({
            status:'success',
            data:data,
            total,
            limit,
            page:page+1,
            totalPage:Math.ceil(total/limit)
        });

    }catch(err){
        return res.status(500).json({
            status:'error',
            message:"Intenal Server Error >> "+err.message
        });
    }
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
        categorys: { type: "array", items: {
            type: "object", props: {
                _id: { type: "objectID",ObjectID },
                name: { type: "string", empty: false }
            }
        },optional:true},
        images: { type: "array", items: {
            type: "object", props: {
                _id: { type: "objectID",ObjectID },
            }
        },optional:true},
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
        if(typeof req.body.categorys=="object") data.categorys=req.body.categorys;
        if(typeof req.body.images=="object") data.images=req.body.images;

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