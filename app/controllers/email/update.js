const Emails=require('../../../models/Email');
const Validator=require('fastest-validator');
const v=new Validator();

const update=async(req,res)=>{
    const schema={
        name:{type:'string',optional:true},
        email:{type:'email',optional:true},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }
    
    
    try{
        
        const data=await Emails.findOne({_id:req.params.id}).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Email not found'
            });
        }
        if(req.body.name) data.name=req.body.name;
        if(req.body.email&&req.body.email!=data.email) data.email=req.body.email;

        const result=await data.save();
        return res.json({
            status:'success',
            data:result
        });
    }catch(error){
        message=error.message;
        if(error.code === 11000) {
            message="Email already exist"
        };
        return res.status(500).json({
            status:'error',
            message:message
        });
    }
}

module.exports=update;