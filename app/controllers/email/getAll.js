const Emails=require('../../../models/Email');

const getAll=async(req,res)=>{
    const data=await Emails.find().populate('message');
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

module.exports=getAll;