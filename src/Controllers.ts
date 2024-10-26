// loginController
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';



const mockUsers = {
'jasmine': {
    role: 'admin',
    'password': '1234'},
};

export const getUser = (username:string)=>{
    return mockUsers[username as keyof typeof mockUsers];
}

const generateToken = (name:string,role:string)=>{
    jwt.sign({name,role},process.env.SECRET || 'secret',{
        expiresIn: '1d'
    })
}


// adminController

 const adminController = (req: Request, res: Response,next:()=>void) => {

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
};


// accessProtectedController

 const signupController = (req: Request, res: Response) => {
    const {username, password, role = 'user'} = req.body;
    if(mockUsers[username  as keyof typeof mockUsers] ){
         res.status(400).json({message: 'User already exists'});
    }
    mockUsers[username as keyof typeof mockUsers] = {
        password,
        role
    };

   try{
    const token = generateToken(username,role);
    res.json({
        message: 'User created',
        token: token
    })
   }
    catch(error){
         res.status(500).json({message: 'Server error - Error creating user'});
    }
};

 const loginController = (req: Request, res: Response) => {

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

try{
    const token = generateToken(username,getUser.role);
    res.json({
        message: 'User logged In',
        data: getUser,
        token: token
    })
   }
    catch(error){
         res.status(500).json({message: 'Server error - Error logging user'});
    }


};


export const  Controller = {loginController,signupController,adminController}