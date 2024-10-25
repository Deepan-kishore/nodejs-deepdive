// loginController
import express, { Request, Response } from 'express';



const mockUsers = {
'jasmine': {
    role: 'admin',
    'password': '1234'},
}

// adminController

export const adminController = (req: Request, res: Response,next:()=>void) => {

    const { username,role } = req.body;
    const user = mockUsers[username as keyof typeof mockUsers];
    if(!user){
        res.status(400).json({message: 'User not found'});
        return;
    }
    if(user.role !== 'admin'){
        res.status(401).json({message: 'User is not an admin'});
        return;
    }
    res.status(200).json({ message: 'Admin control panel' });
}

// accessProtectedController

export const signuoController = (req: Request, res: Response) => {
    const {username, password, role = 'user'} = req.body;
    if(mockUsers[username  as keyof typeof mockUsers] ){
         res.status(400).json({message: 'User already exists'});
    }
    mockUsers[username as keyof typeof mockUsers] = {
        password,
        role
    };
}

export const loginController = (req: Request, res: Response,next:()=>void) => {

    const { username, password } = req.body;

const getUser = mockUsers[username as keyof typeof mockUsers];
if (!getUser) {
    res.status(400).json({ message: 'User not found' });
    return;
}
if (getUser.password !== password) {
    res.status(400).json({ message: 'Invalid password' });
    return;
}

next();


}

module.exports = {
    loginController,
    signuoController,
    adminController,
    // accessProtectedController
}