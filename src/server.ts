import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {config} from './config/config';

import {appExports} from './app';

dotenv.config()


mongoose
    .connect('mongodb://127.0.0.1:27017/SPic')
    .then(()=>{
        console.log(`mongoose connected on port ${config.server.port}`);
    })
    .catch((error:unknown)=>{
        console.log(`An error has occured in the Database connection , details below ${error}`)
    });


const server = appExports.app.listen(config.server.port, () => {
    console.log(`App running on port ${config.server.port}`);
});
    