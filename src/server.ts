import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { config } from './config/config';

import { appExports } from './app';

dotenv.config();

mongoose
    .connect(process.env.DB_HOST as string)
    .then(() => {
        console.log(`mongoose connected on port ${config.server.port}`);
    })
    .catch((error: unknown) => {
        console.log(
            `An error has occured in the Database connection , details below ${error}`
        );
    });

const server = appExports.app.listen(config.server.port, () => {
    console.log(`App running on port ${config.server.port}`);
});
