import express, {Application, Request, Response, NextFunction} from 'express';
import {userRoutesExports} from './routes/userRoutes';
import {postRoutesExports} from './routes/postRoutes';


const app: Application =express();


app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use('/api/v1/users', userRoutesExports.router);
app.use('/api/v1/posts', postRoutesExports.router);



export const appExports = {
    app: app,
}