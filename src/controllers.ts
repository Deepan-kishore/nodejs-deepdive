// loginController
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const mockUsers: Record<string, { password: string; role: string }> = {
    jasmine: {
      role: 'admin',
      password: '$2a$10$5D/1uC4tAgErdMZC9ujyQe.2ZZZYCH4/0rN2y.dOzd8k0w2l5aOxe', // hashed password for '1234'
    },
  };

export const getUser = (username:string)=>{
    return mockUsers[username as keyof typeof mockUsers];
}

export const hashPassword = async (password:string)=>{
    const hashedPassword = await bcryptjs.hashSync(password,10);
    return hashedPassword;
}

const generateToken = (name:string,role:string)=>
    jwt.sign({name,role},process.env.SECRET || 'secret',{
        expiresIn: '1d'
    })



// adminController
// Admin Role checks already implemented in the authorize middleware
 const adminController = (req: Request, res: Response) => {
    const { username } = req.body;
    const user = mockUsers[username as keyof typeof mockUsers];
    if(!user){
        res.status(400).json({message: 'User not found'});
        return;
    }
    res.status(200).json({ message: 'Admin control panel', data: user });
};


// accessProtectedController
 const signupController = async (req: Request, res: Response) => {
    const {username, password, role = 'user'} = req.body;

    if(!username || !password){
        res.status(400).json({message: 'Username or password missing'});
    }
    if(mockUsers[username  as keyof typeof mockUsers] ){
         res.status(400).json({message: 'User already exists'});
    }
    const hashedPassword = await hashPassword(password);
    if(!hashedPassword){
        res.status(500).json({message: 'Server error - Error hashing password'});
    }


    mockUsers[username as keyof typeof mockUsers] = {
        password: hashedPassword,
        role
    };

   try{
    const token = generateToken(username,role);
    res.json({
        message: 'User created',
        data: mockUsers[username as keyof typeof mockUsers],
        token: token
    })
   }
    catch(error){
         res.status(500).json({message: 'Server error - Error creating user'});
    }
};

 const loginController = async (req: Request, res: Response) => {

    const { username, password } = req.body;

const getUser = mockUsers[username as keyof typeof mockUsers];
if (!getUser) {
    res.status(400).json({ message: 'User not found' });
    return;
}
const isPasswordVaid = await bcryptjs.compare(password, getUser.password);
if (!isPasswordVaid) {
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
