import express, { Request, Response, NextFunction } from 'express';
import {apiRoute} from "./src/Routes";
import { configDotenv } from 'dotenv';

const app = express();

configDotenv();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


apiRoute.get('/', (_req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', apiRoute)

const port = process.env.PORT || 3000;

app.use((err:Error, _req:Request, res:Response, _next:NextFunction)=>{
    if(err){
        res.status(500).json({
            message:"Internal Server Error",
            error: err.message
        })
    }
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
