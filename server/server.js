// Importing modules
import env from './src/shared/config/env.config.js';
import createApp from './src/app.js';
import logger from './src/shared/config/logger.config.js';

// Creating the express app
function startServer() {

    // making the app
    const app = createApp();

    // Handling server errors
    app.on('error', (err) => {
        logger.error('Server error:', err);
    });

    // Starting the server
    app.listen(env.PORT, () => {
        logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Handling server shutdown
    app.on('close', () => {
        logger.info('Server is shutting down');
    });
}


// check env -> start db -> connect -> if (err) -> dont start and log -> if (not like this) -> run the server -> close the db -> close server

// Starting the server
startServer();