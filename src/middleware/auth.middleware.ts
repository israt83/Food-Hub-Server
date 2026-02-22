
import { NextFunction , Request , Response} from "express"
import { auth } from "../lib/auth"
import { success } from "better-auth/*"

export enum UserRole{
    customer = "CUSTOMER",
	provider = "PROVIDER",
	admin = "ADMIN",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
export const authMiddleware = (...roles : UserRole[]) =>{
    return async(req : Request, res : Response, next : NextFunction) =>{
        try {

            const session = await auth.api.getSession({
                headers: req.headers as any,
                
            })

            if(!session){
                return res.status(401).json({
                    success : false,
                    message : "Unauthorized"
                })
            }

            if(!session?.user.emailVerified){
                return res.status(403).json({
                    success : false,
                    message : "Email not verified.Please verify your email!"
                })
            }

            const UserRole = session.user.role as UserRole

            req.user = {
                id : session?.user.id!,
                name : session?.user.name!,
                email : session?.user.email!,
                emailVerified : session?.user.emailVerified!,
                role : UserRole
            }

            if(roles.length && !roles.includes(UserRole)){
                return res.status(403).json({
                    success : false,
                    message : "Forbidden ! You are not authorized to access this resource"
                })
            }
            
        } catch (error) {
            next(error)
        }
    }
}