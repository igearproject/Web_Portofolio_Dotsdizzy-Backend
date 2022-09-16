const jwt=require('jsonwebtoken');
const Users = require('../../models/Users');

module.exports=async (req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    // console.log('token:'+token);
    // if(token==null) return res.sendStatus(401);
    if(!token){
        return res.status(403).json({
            status:'error',
            message:'no token, access is not allowed'
        });
    }
    try{
        const decode=await jwt.verify(token,process.env.JWT_TOKEN_SECRET);
        if(!decode){
            return res.status(403).json({
                status:'error',
                message:'Invalid token, access is not allowed'
            });
        }
        const user=await Users.findOne({
            '_id':decode.userId,
            token:token
        }).exec();
    
        if(!user){
            return res.status(403).json({
                status:'error',
                message:'Invalid token, access is not allowed'
            });
        }
        req.userId=decode.userId;
        req.username=user.name;
        req.role=decode.role;
    
        next()
    }catch(err){
        return res.status(403).json({
            status:'error',
            message:err.message
        });
    }
    
}