import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';
import express from 'express';


export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {


        const { id } = req.params;
        
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            return res.status(403).send({
                type: "Session_invalid",
                description: "Access denied",
                notification: "Invalid User"
                
            
            })
        }

        if(currentUserId.toString() !== id){
            return res.status(403).send({
                type: "Parameter_invalid",
                description: "Access denied",
                notification: "Invalid user id"
                
            
            })
        }
        
        next();
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['AUTH-SYSTEM'];

        if(!sessionToken){
            return res.status(403).send({
                type: "Access_Denied",
                description: "Access denied.",
                notification: [
                    "Expired token"
                ]
            })
        }
        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.status(403).send({
                type: "Access_Denied",
                description: "Access denied.",
                notification: [
                    "user or password doesnt exist!"
                ]
            })
        }

        merge(req, {identity: existingUser});

        return next();



        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}