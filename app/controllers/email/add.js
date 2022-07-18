const Emails=require('../../../models/Email');
const Validator=require('fastest-validator');
const v=new Validator();

const add=async(req,res)=>{
    const schema={
        name:{type:'string',empty:false},
        email:{type:'email',empty:false},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }
    try{
        const data=await Emails.create({
            name:req.body.name,
            email:req.body.email,
        });
        return res.json({
            status:'success',
            data:data
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

module.exports=add;