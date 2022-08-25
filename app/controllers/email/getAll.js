const Emails=require('../../../models/Email');

const getAll=async(req,res)=>{
    const page=parseInt(req.query.page)-1||0;
    const limit=parseInt(req.query.limit)||12;
    const skip=page*limit;

    const searchKey=req.query.searchKey||"";
    let filter={
        $or:[
                {name:{$regex:searchKey,$options:"i"}},
                {email:{$regex:searchKey,$options:"i"}},
                {'message.subject':{$regex:searchKey,$options:"i"}}
            ]
    }
    const total=await Emails.countDocuments(filter);
    const data=await Emails.find(filter)
        .populate('message')
        .sort({'updatedAt':'desc'})
        .skip(skip)
        .limit(limit);
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
}

module.exports=getAll;