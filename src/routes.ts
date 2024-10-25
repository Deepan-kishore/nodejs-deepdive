import express, { Request, Response } from 'express';
import { loginController, adminController, signuoController,  } from './controller';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/signup',signuoController)


app.post('/login',loginController, (req, res) => {
    res.status(200).json({ message: 'Login successful' });
});
app.post('/admin-control',adminController);

app.post('access-protected', authMiddleware, accessProtectedController);


app.use((err, req, res, next) => {
    res.status(500).json({
        message:"Internal Server Error",
        error: err.message });
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})


