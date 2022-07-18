const Emails=require('../../../models/Email');
const Message=require('../../../models/Message');
const randomstring = require("randomstring");
const sendEmail=require('../../../config/sendEmail');
const Validator=require('fastest-validator');
const v=new Validator();

const add=async(req,res)=>{
    const schema={
        name:{type:'string',max:255,empty:false},
        email:{type:'email',empty:false},
        subject:{type:'string',max:255,empty:false},
        message:{type:'string',max:255,empty:false},
        emailTo:{type:'email',empty:false},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }
    try{
        const row=await Emails.findOne({email:req.body.email}).exec();
        let data;
        const token=await randomstring.generate(64);
        if(!row){
            data=await Emails.create({
                name:req.body.name,
                email:req.body.email,
                token:token
            });
        }else{
            data=row;
        }
        
        const message=await Message.create({
            message:req.body.message,
            subject:req.body.subject,
            emailId:data._id,
            emailTo:req.body.emailTo
        });
        await data.message.push(message._id);
        data.save();
        
        sendEmail(req.body.email,req.body.subject,req.body.message,req.body.emailTo);
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

module.exports=add;