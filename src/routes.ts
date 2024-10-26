import express from 'express';
import {Controller}  from './controllers';
import { authMiddleware, authorize } from './middlewares';

export const apiRoute = express.Router();

const { loginController, signupController, adminController } = Controller;

//Public routes
apiRoute.post('/signup',signupController);

apiRoute.post('/login',loginController, (_req, res) => {
    res.status(200).json({ message: 'Login successful' });
});

//Protected routes
apiRoute.post('access-protected', authMiddleware, (_req,res)=>{
    res.status(200).json({message: 'Access granted',
        data: "This is a protected route"})
    });


//Admin access only
apiRoute.post('/admin-control',authMiddleware,authorize('admin'),adminController);

module.exports = { apiRoute}