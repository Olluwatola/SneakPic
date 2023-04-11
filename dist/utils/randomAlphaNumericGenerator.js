"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomAlphaNumericGeneratorExports = void 0;
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * chars.length);
        code += chars[index];
    }
    return code;
}
// const myCode = generateCode();
// console.log(myCode);
exports.randomAlphaNumericGeneratorExports = {
    generateCode
};
