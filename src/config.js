import dotenv from 'dotenv';
import { Command } from 'commander';

const commandLineOptions = new Command();
commandLineOptions
    .option('--mode <mode>')
    .option('--port <port>')
commandLineOptions.parse()

// Estan en .gitignore pero es igual a .env
switch (commandLineOptions.opts().mode) {
    case 'prod':
        dotenv.config({ path: './.env'});
        break;
    
    case 'devel':
    default:
        dotenv.config({ path: './.env'});
}

const config = {
    //PORT: commandLineOptions.opts().port || process.env.PORT || 5500,
    mongoose_URL: process.env.MONGOOSE_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    githubAuth: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackUrl: `${process.env.GITHUB_CLIENT_CALLBACK.replace('8080', process.env.PORT || '5500')}`
    },
    PERSISTENCE: process.env.PERSISTENCE,
    //MODE: commandLineOptions.opts().mode || 'devel',
    GOOGLE_APP_EMAIL: process.env.GOOGLE_APP_EMAIL,
    GOOGLE_APP_PASS: process.env.GOOGLE_APP_PASS
};

export default config;