import { NextFunction, Response, Request } from "express"
import jwt from 'jsonwebtoken';
import { getUser } from "./controllers";

interface CustomRequest extends Request {
    user?: ReturnType<typeof getUser>;
}

export const authMiddleware = (req:CustomRequest,res:Response,next:NextFunction)=>{
   try {
    if(!req.headers.authorization){
        throw new Error('Unauthorized');
    }
    const {authorization} = req.headers;
    const [bearer, token] = authorization.split(' ');
    if(bearer !== 'Bearer'){
     new Error('Invalid token - Bearer Missing');
    }

    const isValid = jwt.verify(token,process.env.SECRET ||'secret');
    if(!isValid){
        new Error('Invalid token');
    }
    if (typeof isValid !== 'string' && 'name' in isValid) {
      
        req.user = getUser(isValid.name);
    } else {
        throw new Error('Invalid token payload');
    }
next();
   } catch (error:any) {
    res.status(401).json({
        message: 'Unauthorized',
    error: error.message
    });
   }
}

export const authorize = (role:string)=>(req:CustomRequest,res:Response,next:NextFunction)=>{

try {
    const user = req.user;
    if(!user){
        throw new Error('User Not Found');
    }

    if(user.role !== role){
        throw new Error('Unauthorized');
    }

    next();

} catch (error:any) {
    res.status(403).json({
        message: 'Forbidden',
        error: error.message
    });
}    
}





 


  
  

module.exports = {authMiddleware,authorize}