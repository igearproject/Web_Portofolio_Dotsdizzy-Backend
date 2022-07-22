const Users=require('../../models/Users');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const randomstring=require('randomstring');
const sendEmail=require('../../config/sendEmail');
const Validator=require('fastest-validator');
const v=new Validator();

const profile=async(req,res)=>{
    if(req.userId){
        return res.json({
            status:"success",
            data:{
                user:{
                    id:req.userId,
                    name:req.username,
                    role:req.role,
                }
            }
        });
    }else{
        return res.status(403).json({
            status:"error",
            message:"Access Denied"
        });
    }
}
const register=async(req,res)=>{
    const schema={
        name:{type:'string',empty:false,max:100},
        email:{type:'email',empty:false,max:255},
        password:{type:'string',empty:false,min:8},
        rePassword:{type: "equal", field: "password"},
    };
    const validate=v.validate(req.body,schema);

    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }

    try{
        const email=await Users.findOne({
            email:req.body.email
        }).exec();
        if(email){
            return res.status(400).json({
                status:'error',
                message:'Email already registered'
            });
        }
        const salt=await bcrypt.genSalt();
        const hashPassword=await bcrypt.hash(req.body.password,salt);
        const token=await randomstring.generate(64);
        const data=await Users.create({
            name:req.body.name,
            email:req.body.email,
            password:hashPassword,
            token:token
        });
        sendEmail(
            "Dotsdizzy",
            "Email Verification",
            `
            <h1>Hi ${data.name}</h1><br/>
            
            <p>To verify your email in our system, click the following link:</p>
            <a href="http://localhost:8000/email/verification/${data._id}/${data.token}">http://localhost:8000/email/verification/${data._id}/${data.token}</a>
            <br/>
            <span>thank you,</span>
            `,
            req.body.email);
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

const login=async(req,res)=>{
    const schema={
        email:{type:'email',empty:false,max:255},
        password:{type:'string',empty:false,min:8},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }

    try{
        const user=await Users.findOne({
            email:req.body.email
        }).exec();
        if(!user){
            return res.status(400).json({
                status:'error',
                message:'Wrong email or password'
            });
        }
        if(user.emailIsVerified===false){
            return res.status(400).json({
                status:'error',
                message:'Verify your email first'
            });
        }

        const match=await bcrypt.compare(req.body.password,user.password)
        if(!match){
            return res.status(400).json({
                status:'error',
                message:'Wrong email or password'
            });
        }

        const token=jwt.sign({
            userId:user._id,
            username:user.name,
            role:user.role,
        },process.env.JWT_TOKEN_SECRET,{
            expiresIn:process.env.JWT_TOKEN_EXPIRED_TIME
        });
        
        user.token=token;
        await user.save();

        res.cookie('token',
            token,{
                httpOnly:true,
                maxAge:30*24*60*60*1000
            }
        );

        res.json({
            status:'success',
            token: token
        })
    }catch(error){
        return res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

const logout=async(req,res)=>{
    try{
        const token=req.cookies.token||req.headers['authorization'];
        if(!token){
            return res.status(400).json({
                status:'error',
                message:'Logout error'
            });
        };
        const user=await Users.findOne({
            token:token
        }).exec();
        if(!user){
            return res.status(400).json({
                status:'error',
                message:'Logout error'
            });
        }
        user.token=null;
        user.save();

        res.clearCookie('token');
        return res.json({
            status:'success',
            message:'Logout successfully'
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

const changePassword=async(req,res)=>{
    const id=req.params.id;
    const schema={
        oldPassword:{type:'string',empty:false,min:8},
        password:{type:'string',empty:false,min:8},
        rePassword:{type:'equal',field:'password'},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }
    if(req.userId!==id){
        return res.status(400).json({
            status:'error',
            message:'Access Denied'
        });
    }
    try{
        const user=await Users.findById(id).exec();
        console.log(user);
        if(!user){
            return res.status(400).json({
                status:'error',
                message:'User not found'
            });
        }
        // console.log(req.body.oldPassword+'=>'+user.password);
        const match=await bcrypt.compare(req.body.oldPassword,user.password)
        // console.log(match);
        if(!match){
            return res.status(400).json({
                status:'error',
                message:'Sorry, cannot change password'
            });
        }
        
        const salt=await bcrypt.genSalt();
        const hashPassword=await bcrypt.hash(req.body.password,salt);
        user.password=hashPassword;
        await user.save();

        res.json({
            status:'success',
            data: user
        })
    }catch(error){
        return res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

const update=async(req,res)=>{
    const id=req.params.id;

    const schema={
        name:{type:'string',optional:true,max:100},
    };
    const validate=v.validate(req.body,schema);
    if(validate.length){
        return res.status(400).json({
            status:'error',
            message:validate
        });
    }

    try{
        const user=await Users.findById(id).exec();
        if(!user){
            return res.status(400).json({
                status:'error',
                message:'User not found'
            });
        }
        
        if(req.body.name) user.name=req.body.name;
        await user.save();

        res.json({
            status:'success',
            data: user
        })
    }catch(error){
        return res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

const emailVerification=async(req,res)=>{
    const id=req.params.id;
    const token=req.params.token;
    try{
        const user=await Users.findById(id).exec();
        if(!user){
            return res.status(400).json({
                status:'error',
                message:'User not found'
            });
        }
        if(user.token!=token){
            return res.status(400).json({
                status:'error',
                message:'Email verification failed'
            });
        }
        const newToken=await jwt.sign({
            userId:user._id,
            username:user.name,
            role:user.role,
        },process.env.JWT_TOKEN_SECRET,{
            expiresIn:process.env.JWT_TOKEN_EXPIRED_TIME
        });
        res.cookie('token',
        newToken,{
                httpOnly:true,
                maxAge:30*24*60*60*1000
            }
        );
        
        user.emailIsVerified=true;
        user.token=newToken;
        await user.save();

        res.json({
            status:'success',
            token:token
        })

    }catch(error){
        return res.status(500).json({
            status:'error',
            message:error.message
        });
    }
}

module.exports={
    profile,
    register,
    login,
    logout,
    changePassword,
    update,
    emailVerification
};