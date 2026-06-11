// Importing modules 
import Session from './session.model.js';

// class to communicate with the sessions from database 
class SessionRepository {

    constructor() {

        // setting the session model
        this.sessionModel = Session;

    }

    // method to create a session
    async createSession(sessionData) {

        // creating the session
        const session = await this.sessionModel.create(sessionData);

        // returning the sessions
        return session;
    }

    // find one sessions
    async findOneSession(data) {

        // finding a session
        const sessions = await this.sessionModel.findOne(data);

        //returning the session
        return sessions;
    }

    // find many sessions 
    async findSessions(data) {

        // finding the sessions
        const sessions = await this.sessionModel.find(data);

        //returning the sessions
        return sessions;
    }

    // method to delete one session
    async deleteSessions(data) {

        // deleting the session
        const sessions = await this.sessionModel.deleteOne(data);

        // returning the deleted session
        return sessions;
    }

    async deleteManySessions(data) {
        // deleting the sessions
        const sessions = await this.sessionModel.deleteMany(data);
        
        // returning the deleted sessions
        return sessions;
    }
}