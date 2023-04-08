import { deleteUserById, getUserById, getUserByUsername, getUsers, updateUserById } from '../db/users';
import express from 'express';


export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        if(!users){
            return res.status(404).send({
                type: "Nothing_Found",
                description: "Not have users registred",
                notification: users
                
            
            })
        }
    
        return res.status(200).json(users);
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            type: "Malformed_Request",
            description: "Bad_request",            
        
        });    }
}


export const getSpecificUser = async (req: express.Request, res: express.Response) => {
    try {
        const {username} = req.params;
        const user = await getUserByUsername(username);

        if(!user){
            return res.status(404).send({
                type: "Not_Found",
                description: "Invalid username",
                notification: null    
            
            })
        }
    
        return res.status(200).json(user);
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            type: "Malformed_Request",
            description: "Bad_request",            
        
        });    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;

        const existUser = await getUserById(id);

        
        if(!existUser){
            return res.status(404).send({
                type: "Not_Found",
                description: "Invalid id",
                notification: null
                
            
            })
        }

        const user = await deleteUserById(id);

    
        return res.status(204).json(user);
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            type: "Malformed_Request",
            description: "Bad_request",            
        
        });
    }
}


export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;

        const {email, username, password} = req.body;

        const existUser = await getUserById(id);

        
        if(!existUser){
            return res.status(404).send({
                type: "Not_Found",
                description: "Invalid id",
                notification: null
                
            
            })
        }

        const user = await updateUserById(id, {email, username, password});

        await user.save();
    
        return res.status(200).json(user);
        
    } catch (error) {
        return res.status(400).send({
            type: "Malformed_Request",
            description: "Bad_request",            
        
        });
    }
}