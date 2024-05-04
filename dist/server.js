"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config/config");
const app_1 = require("./app");
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.DB_HOST)
    .then(() => {
    console.log(`mongoose connected on port ${config_1.config.server.port}`);
})
    .catch((error) => {
    console.log(`An error has occured in the Database connection , details below ${error}`);
});
const server = app_1.appExports.app.listen(config_1.config.server.port, () => {
    console.log(`App running on port ${config_1.config.server.port}`);
});
