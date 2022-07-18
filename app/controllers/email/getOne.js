const Emails=require('../../../models/Email');

const getOne=async(req,res)=>{
    const data=await Emails.findOne({
        _id:req.params.id
    }).populate('message');
    if(!data){
        return res.status(404).json({
            status:'error',
            message:'Email not found'
        });
    }
    return res.json({
        status:'success',
        data:data
    });
}

module.exports=getOne;