import express, {Application, Request, Response, NextFunction} from 'express';
import {userRoutesExports} from './routes/userRoutes';


const app: Application =express();


app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use('/api/v1/users', userRoutesExports.router);


export const appExports = {
    app: app,
}