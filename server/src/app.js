// Importing moduels 
import express from 'express';
import securityMiddlewares from './shared/middlewares/security.middleware.js';
import mainRouter from './shared/routers/index.router.js';
import errorMiddleware from './shared/middlewares/error.middleware.js';
import notFoundHandler from './shared/middlewares/notfound.middleware.js';
import ApiResponse from './shared/utils/ApiResponse.utils.js';
import connectDB from './shared/config/db.config.js';

// Function to create express app
function createApp() {

    // creating a express app
    const app = express();

    // connecting to the database
    connectDB();

    // applying middlewares
    securityMiddlewares(app);

    // making the health router 
    app.get('/health', (req, res) => {
        return ApiResponse(res, 200, 'Service is running smoothly');
    });
    
    // adding the main router
    app.use("/api" ,mainRouter);

    // adding the not found handler 
    app.use(notFoundHandler);


    // adding the error middlware
    app.use(errorMiddleware);

    // returning the app
    return app;
}

export default createApp;