const Messages=require('../../models/Message');
const Emails=require('../../models/Email');
const Validator=require('fastest-validator');
const v=new Validator();

const add=async(req,res)=>{
    const schema={
        email:{type:'email',empty:false},
        subject:{type:'string',empty:false},
        emailTo:{type:'email',empty:false},
        message:{type:'string',empty:false},
    };
    const validate=v.validate(req.body,schema);

    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }

    const emailData=await Emails.findOne({
        email:req.body.email,
    }).exec();
    if(!emailData){
        return res.status(404).json({
            status:'error',
            message:'Email not found'
        });
    }
    
    try{
        const data=await Messages.create({
            email:emailData._id,
            subject:req.body.subject,
            emailTo:req.body.emailTo,
            message:req.body.message
        });
        emailData.message.push(data._id);
        emailData.save()
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
    const data=await Messages.find().populate('emailId').exec();
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
        const data=await Messages.findOne({
            _id:req.params.id
        }).populate('emailId').exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Message not found'
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
        email:{type:'email',empty:false},
        subject:{type:'string',empty:false},
        emailTo:{type:'email',empty:false},
        message:{type:'string',empty:false},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }
    
    try{

        const email=await Emails.findOne({email:req.body.email}).exec();
        if(!email){
            return res.status(404).json({
                status:'error',
                message:'Email not found'
            });
        }
        
        const data=await Messages.findOne({_id:req.params.id}).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Message not found'
            });
        }
        if(req.body.email) data.emailId=email._id;
        if(req.body.subject) data.subject=req.body.subject;
        if(req.body.emailTo) data.emailTo=req.body.email;
        if(req.body.message) data.message=req.body.message;

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

const destroy=async(req,res)=>{    
    
    try{
        const data=await Messages.findOne({_id:req.params.id}).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Message not found'
            });
        }
        data.delete();
        const email=await Emails.findOne({_id:data.emailId}).exec();
        // email.message.id(req.params.id).remove();
        if(email && email.message){
            email.message.pull(req.params.id);
            email.save();
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