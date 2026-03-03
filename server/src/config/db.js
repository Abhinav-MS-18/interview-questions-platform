const mongoose = require('mongoose');

const RETRY_MS = 5000;
const REQUIRED_DB_NAME = 'interview_questions_platform';

const enforceDbNameInUri = (uri) => {
    try {
        const parsed = new URL(uri);
        parsed.pathname = `/${REQUIRED_DB_NAME}`;
        return parsed.toString();
    } catch {
        return uri;
    }
};

const connectDB = async (retryOnFailure = true) => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error('MongoDB Connection Error: MONGODB_URI is not set.');
        return false;
    }

    try {
        const normalizedUri = enforceDbNameInUri(mongoUri);
        const conn = await mongoose.connect(normalizedUri, { dbName: REQUIRED_DB_NAME });
        console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        return true;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        if (retryOnFailure) {
            console.log(`Retrying MongoDB connection in ${RETRY_MS / 1000}s...`);
            setTimeout(() => connectDB(true), RETRY_MS);
        }
        return false;
    }
};

module.exports = connectDB;
