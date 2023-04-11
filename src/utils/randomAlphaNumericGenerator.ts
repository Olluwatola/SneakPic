function generateCode(): string {
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
  
  export const randomAlphaNumericGeneratorExports = {
    generateCode
}
