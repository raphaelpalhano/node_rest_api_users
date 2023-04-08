import { isAuthenticated, isOwner } from '../middlewares';
import { deleteUser, getAllUsers, getSpecificUser, updateUser } from '../controllers/users';
import express from 'express';



export default (router: express.Router) =>{

    router.get('/users/listUsers', isAuthenticated, getAllUsers);

    router.get(`/users/user/:username`, isAuthenticated, getSpecificUser);

    router.delete(`/users/user/:id`, isAuthenticated,  isOwner, deleteUser);


    router.put(`/users/user/:id`, isAuthenticated, isOwner, updateUser)

}