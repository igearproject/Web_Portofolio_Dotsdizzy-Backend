module.exports=async(req,res,next)=>{
    if(req.role==='admin'){
        next();
    }else{
        return res.status(403).json({
            status:'error',
            message:'Access Denied!'
        });
    }
}