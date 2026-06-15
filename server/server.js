// Importing modules
import env from './src/shared/config/env.config.js';
import createApp from './src/app.js';
import logger from './src/shared/config/logger.config.js';
import http from "http"
import initializeSocket from './src/socket/socket.server.js';
import connectDB from './src/shared/config/db.config.js';


// Creating the express app
async function startServer() {

    await connectDB();

    // making the app
    const app = createApp();

    // making http server
    let httpServer = http.createServer(app);

    initializeSocket(httpServer)

    // Handling server errors
    httpServer.on('error', (err) => {
        logger.error('Server error:', err);
    });

    // Starting the server
    httpServer.listen(env.PORT, () => {
        logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Handling server shutdown
    httpServer.on('close', () => {
        logger.info('Server is shutting down');
    });
}


// check env -> start db -> connect -> if (err) -> dont start and log -> if (not like this) -> run the server -> close the db -> close server

// Starting the server
startServer().catch((error) => {
    logger.fatal(error, "Server failed to start");
    process.exit(1);
});
