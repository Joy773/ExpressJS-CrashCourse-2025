import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import {connectDB} from './src/config/db.js'
import userRouter from './src/user/user.route.js';
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
//Database Connection
try {
    connectDB();
    console.log('Connected to DB!')
}
catch (err)
{
    console.error(err);
    process.exit(1);
}
app.use(cors());
app.use(express.json()); // --> Global Middleware

const reqLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
    next();
}

app.use(reqLogger);
app.use('/api/users',userRouter);



//Register Routes


app.get("/health", (req, res) => {
    res.send("Hey! I am healthy");
})


app.use((err, req, res, next) => {
    console.log(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({message: err.message });
})
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`))