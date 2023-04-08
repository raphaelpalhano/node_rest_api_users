import { createUser, getUserByEmail } from '../db/users';
import express from 'express';
import { authentication, random } from '../helpers/authentication_system';

export const login = async (req: express.Request, res: express.Response) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send({
                type: "Parameter_missing",
                description: "Missing parameter",
                notification: [
                    "invalid parameters!"
                ]
                
            })
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if(!user){
            return res.status(401).send({
                type: "Access_denied",
                message: "Invalid parameter"
            })
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password !== expectedHash){
            return res.status(403).send({
                type: "Access_Denied",
                description: "Access denied.",
                notification: [
                    "user doesnt exist or invalid password"
                ]
            })
        }

        const salt = random();

        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('AUTH-SYSTEM', user.authentication.sessionToken, {domain: 'localhost', path: '/'});

        return  res.status(200).json(user).end();

    }catch(error){
        console.log(error);
        return res.status(400).send({
            type: "Malformed_Request",
            description: "Bad_request",            
        
        });
    }
}


export const register = async (req: express.Request, res: express.Response) => {
    try{
        const {username, email, password } = req.body;

        if(!email || !username || !password ){
            return res.status(403).send({
                type: "Access_Denied",
                description: "Access denied.",
                notification: [
                    "user doesnt exist or invalid password"
                ]
            })
        }

        const existingUser = await getUserByEmail(email);
        
        if(existingUser){
            return res.status(400).send({
                type: "Parameters_Invalid",
                description: "Invalid information",
                notification: [
                    "Verify if this email is correct."
                ]
            })
        }

        const salt = random();

        const user = await createUser({
            email,
            username,
            authentication:{
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(200).json(user).end();

    } catch (error){
        console.log(error);
        return res.status(400).send({
            type: "Malformed_Request",
            description: "Bad_request",            
        
        });    }
}