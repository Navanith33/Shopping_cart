import jwt from 'jsonwebtoken';
export const secret ='NAVANITH';
import { Request,Response,NextFunction } from 'express';
export const UserAuthentication = (req:Request,res:Response,next:NextFunction) =>{
      const token = req.headers.authorization;
      if(token){
          try{
              const parsed = token.split(' ')[1];
              const verify = jwt.verify(parsed,secret);
               if(typeof verify ==="string"){
                   req.headers.user=verify;
                    next();
               }
          }
          catch(e){
            res.json({message:"Auth failed"});
          }
        }
        else{
            res.status(403).json({message:"Token is missing"});
        }
}
export const generateUsertoken = (username:string) =>{
    return jwt.sign(username,secret);
}