const Emails=require('../../../models/Email');
const Message=require('../../../models/Message');

const destroy=async(req,res)=>{    
    
    try{
        
        const data=await Emails.findOne({_id:req.params.id}).exec();
        if(!data){
            return res.status(404).json({
                status:'error',
                message:'Email not found'
            });
        }
        Message.deleteMany({emailId:data._id});
        data.delete();
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

module.exports=destroy;