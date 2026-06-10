// Importing moduels 
import express from 'express';
import securityMiddlewares from './shared/middlewares/security.middleware.js';

// Function to create express app
function createApp() {

    // creating a express app
    const app = express();

    // applying middlewares
    securityMiddlewares(app);

    // returning the app
    return app;
}

export default createApp;